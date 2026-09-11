import os
import shutil
import socket
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from agent_runtime import REVIEWER_PERMISSION_PROFILE, reviewer_permission_toml

CODEX = shutil.which("codex")


@unittest.skipUnless(sys.platform == "darwin" and CODEX, "requires Codex on macOS")
class ReviewerSandboxIntegrationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory(prefix="thinkso-sandbox-test-")
        self.root = Path(self.temporary.name)
        self.checkout = self.root / "checkout"
        self.outside = self.root / "outside"
        self.codex_home = self.root / "codex-home"
        self.checkout.mkdir()
        self.outside.mkdir()
        self.codex_home.mkdir()
        (self.checkout / "visible.txt").write_text("reviewable\n", encoding="utf-8")
        (self.outside / "secret.txt").write_text("secret\n", encoding="utf-8")
        (self.outside / "auth.json").write_text(
            '{"access_token":"fake-canary-token"}\n', encoding="utf-8"
        )
        (self.outside / "reviewer.pem").write_text(
            "fake-canary-private-key\n", encoding="utf-8"
        )
        (self.codex_home / "config.toml").write_text(
            reviewer_permission_toml(self.checkout), encoding="utf-8"
        )
        self.environment = {
            **os.environ,
            "CODEX_HOME": str(self.codex_home),
        }

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def sandbox(self, *command: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [
                str(CODEX),
                "sandbox",
                "-P",
                REVIEWER_PERMISSION_PROFILE,
                "-C",
                str(self.checkout),
                *command,
            ],
            env=self.environment,
            text=True,
            capture_output=True,
            check=False,
        )

    def assert_denied(self, path: Path) -> None:
        result = self.sandbox("/bin/cat", str(path))
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertNotIn(path.read_text(encoding="utf-8").strip(), result.stdout)

    def test_can_read_the_review_checkout(self) -> None:
        result = self.sandbox("/bin/cat", str(self.checkout / "visible.txt"))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(result.stdout, "reviewable\n")

    def test_cannot_read_files_outside_the_checkout(self) -> None:
        self.assert_denied(self.outside / "secret.txt")
        self.assert_denied(self.outside / "auth.json")
        self.assert_denied(self.outside / "reviewer.pem")

    def test_cannot_write_to_the_review_checkout(self) -> None:
        target = self.checkout / "created.txt"
        result = self.sandbox(
            "/bin/sh", "-c", 'printf changed > "$1"', "reviewer-test", str(target)
        )
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertFalse(target.exists())

    def test_cannot_open_a_tcp_connection(self) -> None:
        with socket.socket() as listener:
            listener.bind(("127.0.0.1", 0))
            listener.listen(1)
            port = str(listener.getsockname()[1])
            control = subprocess.run(
                ["/usr/bin/nc", "-z", "127.0.0.1", port],
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(control.returncode, 0, control.stdout + control.stderr)
            result = self.sandbox("/usr/bin/nc", "-z", "127.0.0.1", port)
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
