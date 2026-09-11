import unittest

from agent_runtime import AgentRuntimeError, _string_values, assert_no_secret_output


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


if __name__ == "__main__":
    unittest.main()
