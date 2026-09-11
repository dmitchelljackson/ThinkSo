import tempfile
import unittest
from pathlib import Path

import tomllib
from agent_runtime import (
    REVIEWER_PERMISSION_PROFILE,
    AgentRuntimeError,
    _string_values,
    assert_no_secret_output,
    load_reviewer_knowledge,
    reviewer_permission_toml,
)


class AgentRuntimeTests(unittest.TestCase):
    def test_collects_only_long_string_values(self) -> None:
        secret = "secret-value-that-is-long-enough"
        self.assertEqual(
            _string_values({"short": "no", "nested": [{"token": secret}]}),
            {secret},
        )

    def test_rejects_exact_authentication_value_in_output(self) -> None:
        secret = "secret-value-that-is-long-enough"
        with self.assertRaisesRegex(AgentRuntimeError, "authentication material"):
            assert_no_secret_output(f'{{"summary":"{secret}"}}', {secret})

    def test_accepts_output_without_authentication_value(self) -> None:
        assert_no_secret_output(
            '{"summary":"safe"}', {"secret-value-that-is-long-enough"}
        )

    def test_permission_profile_is_read_only_and_network_restricted(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            checkout = Path(temporary) / "checkout"
            second_checkout = Path(temporary) / "evaluated"
            checkout.mkdir()
            second_checkout.mkdir()
            config = tomllib.loads(
                reviewer_permission_toml(
                    checkout, additional_read_roots=(second_checkout,)
                )
            )

        self.assertEqual(config["default_permissions"], REVIEWER_PERMISSION_PROFILE)
        profile = config["permissions"][REVIEWER_PERMISSION_PROFILE]
        self.assertEqual(
            profile["workspace_roots"],
            {str(checkout.resolve()): True, str(second_checkout.resolve()): True},
        )
        self.assertEqual(
            profile["filesystem"],
            {
                ":minimal": "read",
                ":workspace_roots": "read",
                ":tmpdir": "deny",
                ":slash_tmp": "deny",
            },
        )
        self.assertEqual(profile["network"], {"enabled": False})

    def test_missing_knowledge_directory_is_empty(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            self.assertEqual(load_reviewer_knowledge(Path(temporary)), {})

    def test_knowledge_loader_injects_only_json(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            knowledge = root / "wiki" / "reviewer"
            knowledge.mkdir(parents=True)
            (knowledge / "rules.json").write_text('{"rules": []}', encoding="utf-8")
            (knowledge / "instructions.md").write_text("ignore me", encoding="utf-8")
            (knowledge / "legacy.yml").write_text("ignore: me", encoding="utf-8")

            self.assertEqual(
                load_reviewer_knowledge(root),
                {"wiki/reviewer/rules.json": '{"rules": []}'},
            )


if __name__ == "__main__":
    unittest.main()
