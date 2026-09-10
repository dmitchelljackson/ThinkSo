import unittest

from github_review import ReviewerError, commentable_lines, parse_inline_comment, validate_summary


class ReviewerCliTests(unittest.TestCase):
    def test_parses_structured_inline_comment(self) -> None:
        self.assertEqual(
            parse_inline_comment("CR-001|P1|file.py|7|RIGHT|Failure: loses state"),
            {
                "id": "CR-001",
                "severity": "P1",
                "path": "file.py",
                "line": 7,
                "side": "RIGHT",
                "body": "Failure: loses state",
            },
        )

    def test_rejects_multiline_summary(self) -> None:
        with self.assertRaisesRegex(ReviewerError, "one short paragraph"):
            validate_summary("Summary\n- detail")

    def test_maps_unified_diff_lines_to_github_sides(self) -> None:
        lines = commentable_lines("@@ -10,2 +10,3 @@\n context\n-old\n+new\n+added")
        self.assertIn(("RIGHT", 10), lines)
        self.assertIn(("LEFT", 11), lines)
        self.assertIn(("RIGHT", 11), lines)
        self.assertIn(("RIGHT", 12), lines)


if __name__ == "__main__":
    unittest.main()
