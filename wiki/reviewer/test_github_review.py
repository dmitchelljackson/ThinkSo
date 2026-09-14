import unittest

from github_review import (
    ExternalPRApprovalRequired,
    ReviewerError,
    commentable_lines,
    commentable_ranges,
    has_authenticated_marker,
    next_finding_number,
    parse_inline_comment,
    require_authorized_head,
    validate_coverage,
    validate_structured_review,
    validate_summary,
)


class ReviewerCliTests(unittest.TestCase):
    def test_owner_authored_pull_does_not_require_approval(self) -> None:
        pull = {"user": {"id": 42, "login": "owner"}, "head": {"sha": "a" * 40}}
        require_authorized_head(pull, 7, 42, None)

    def test_external_pull_requires_exact_head_approval(self) -> None:
        pull = {
            "user": {"id": 99, "login": "contributor"},
            "head": {"sha": "a" * 40},
        }
        with self.assertRaises(ExternalPRApprovalRequired) as raised:
            require_authorized_head(pull, 7, 42, None)
        self.assertEqual(raised.exception.head, "a" * 40)

    def test_external_pull_accepts_approved_exact_head(self) -> None:
        pull = {
            "user": {"id": 99, "login": "contributor"},
            "head": {"sha": "a" * 40},
        }
        require_authorized_head(pull, 7, 42, "a" * 40)

    def test_external_pull_rejects_stale_head_approval(self) -> None:
        pull = {
            "user": {"id": 99, "login": "contributor"},
            "head": {"sha": "b" * 40},
        }
        with self.assertRaises(ExternalPRApprovalRequired):
            require_authorized_head(pull, 7, 42, "a" * 40)

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

    def test_source_lines_starting_with_diff_markers_advance_lines(self) -> None:
        lines = commentable_lines("@@ -10,1 +10,3 @@\n-old\n+new\n+++counter\n+after")
        self.assertIn(("LEFT", 10), lines)
        self.assertIn(("RIGHT", 10), lines)
        self.assertIn(("RIGHT", 11), lines)
        self.assertIn(("RIGHT", 12), lines)

    def test_structured_review_requires_exact_rule_evidence(self) -> None:
        result = {
            "decision": "request-changes",
            "reviewed_head": "a" * 40,
            "summary": "One blocking issue remains.",
            "coverage": [
                {"path": "file.py", "diff": True, "full_file": True, "note": ""}
            ],
            "comments": [
                {
                    "id": "CR-001",
                    "severity": "P1",
                    "path": "file.py",
                    "line": 1,
                    "side": "RIGHT",
                    "title": "Unsafe retry",
                    "body": "The retry duplicates the write.",
                    "why": {"path": "wiki/reviewer/baseline.json", "text": "invented"},
                }
            ],
        }
        pull = {"head": {"sha": "a" * 40}}
        files = [{"filename": "file.py", "patch": "@@ -0,0 +1,1 @@\n+value"}]
        with self.assertRaisesRegex(ReviewerError, "not exact text"):
            validate_structured_review(
                result=result,
                pr=7,
                pull=pull,
                files=files,
                reviews=[],
                review_comments=[],
                app_user_id=42,
                finding_id_start=1,
                knowledge={"wiki/reviewer/baseline.json": "real rule"},
            )

    def test_commentable_ranges_collapse_adjacent_lines(self) -> None:
        ranges = commentable_ranges("@@ -10,2 +10,3 @@\n context\n-old\n+new\n+added")
        self.assertEqual(ranges, {"LEFT": [[10, 11]], "RIGHT": [[10, 12]]})

    def test_coverage_requires_every_changed_file(self) -> None:
        files = [
            {"filename": "a.py", "status": "modified"},
            {"filename": "b.py", "status": "added"},
        ]
        result = {
            "coverage": [{"path": "a.py", "diff": True, "full_file": True, "note": ""}]
        }
        with self.assertRaisesRegex(ReviewerError, "did not cover 1 .*b.py"):
            validate_coverage(result, files)

    def test_coverage_requires_full_file_or_a_stated_exception(self) -> None:
        files = [
            {"filename": "lock.yaml", "status": "modified"},
            {"filename": "gone.py", "status": "removed"},
            {"filename": "skimmed.py", "status": "modified"},
        ]
        result = {
            "coverage": [
                {"path": "lock.yaml", "diff": True, "full_file": False, "note": "lockfile diff"},
                {"path": "gone.py", "diff": True, "full_file": False, "note": ""},
                {"path": "skimmed.py", "diff": True, "full_file": False, "note": ""},
            ]
        }
        with self.assertRaisesRegex(ReviewerError, "did not cover 1 .*skimmed.py"):
            validate_coverage(result, files)

    def test_markers_and_finding_numbers_require_the_app_identity(self) -> None:
        marker = "<!-- thinkso-reviewer:run pr=7 head=abc -->"
        reviews = [
            {"user": {"id": 1}, "body": marker},
            {"user": {"id": 42}, "body": "different"},
        ]
        comments = [
            {"user": {"id": 1}, "body": "**CR-900 · P1 · spoofed**"},
            {"user": {"id": 42}, "body": "**CR-004 · P1 · trusted**"},
        ]
        self.assertFalse(has_authenticated_marker(reviews, marker, 42))
        self.assertEqual(next_finding_number(comments, 42), 5)


if __name__ == "__main__":
    unittest.main()
