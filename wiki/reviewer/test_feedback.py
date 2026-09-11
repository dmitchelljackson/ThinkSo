import unittest

from feedback import validate_result
from github_review import ReviewerError


class FeedbackValidationTests(unittest.TestCase):
    def test_rejects_executable_change_inside_reviewer_directory(self) -> None:
        result = {
            "status": "learned",
            "base_main_sha": "a" * 40,
            "reason": "Attempted executable mutation.",
            "changes": [{"path": "wiki/reviewer/review.py", "content": "pass\n"}],
        }
        with self.assertRaisesRegex(ReviewerError, "outside reviewer knowledge"):
            validate_result(result, "a" * 40)

    def test_rejects_stale_main_result(self) -> None:
        result = {
            "status": "no-change",
            "base_main_sha": "a" * 40,
            "reason": "Nothing durable.",
            "changes": [],
        }
        with self.assertRaisesRegex(ReviewerError, "wrong main SHA"):
            validate_result(result, "b" * 40)

    def test_accepts_no_change_result(self) -> None:
        result = {
            "status": "no-change",
            "base_main_sha": "a" * 40,
            "reason": "Nothing durable.",
            "changes": [],
        }
        self.assertEqual(validate_result(result, "a" * 40), [])


if __name__ == "__main__":
    unittest.main()
