import json
import unittest

from feedback import validate_result
from github_review import ReviewerError


class FeedbackValidationTests(unittest.TestCase):
    @staticmethod
    def rule(
        rule_id: str,
        origins: list[dict[str, str]],
        *,
        status: str = "active",
        retired_by: dict[str, str] | None = None,
    ) -> str:
        return json.dumps(
            {
                "schema_version": 1,
                "id": rule_id,
                "status": status,
                "kind": "invariant",
                "scope": "reviewer",
                "rule": "Keep the behavior traceable.",
                "rationale": "The rule should be auditable.",
                "origin": origins,
                "retired_by": retired_by,
            }
        )

    def test_rejects_executable_change_inside_reviewer_directory(self) -> None:
        result = {
            "status": "learned",
            "base_main_sha": "a" * 40,
            "reason": "Attempted executable mutation.",
            "changes": [
                {
                    "operation": "write",
                    "path": "wiki/reviewer/review.py",
                    "content": "pass\n",
                }
            ],
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

    def test_accepts_new_rule_with_a_known_comment_origin(self) -> None:
        url = "https://github.com/example/project/pull/1#discussion_r1"
        result = {
            "status": "learned",
            "base_main_sha": "a" * 40,
            "reason": "Durable learning.",
            "changes": [
                {
                    "operation": "write",
                    "path": "wiki/reviewer/rules/traceable-rule.json",
                    "content": self.rule(
                        "traceable-rule",
                        [{"url": url, "effect": "created", "note": "Created here."}],
                    ),
                }
            ],
        }
        self.assertEqual(
            len(
                validate_result(
                    result,
                    "a" * 40,
                    existing_knowledge={},
                    allowed_origin_urls={url},
                    owner_origin_urls=set(),
                )
            ),
            1,
        )

    def test_edit_must_preserve_history_and_append_a_known_origin(self) -> None:
        first = "https://github.com/example/project/pull/1#discussion_r1"
        second = "https://github.com/example/project/pull/2#discussion_r2"
        path = "wiki/reviewer/rules/traceable-rule.json"
        existing = self.rule(
            "traceable-rule",
            [{"url": first, "effect": "created", "note": "Created here."}],
        )
        edited = self.rule(
            "traceable-rule",
            [
                {"url": first, "effect": "created", "note": "Created here."},
                {"url": second, "effect": "edited", "note": "Clarified here."},
            ],
        )
        result = {
            "status": "learned",
            "base_main_sha": "a" * 40,
            "reason": "Clarified the rule.",
            "changes": [{"operation": "write", "path": path, "content": edited}],
        }
        validate_result(
            result,
            "a" * 40,
            existing_knowledge={path: existing},
            allowed_origin_urls={second},
            owner_origin_urls={second},
        )

    def test_edit_cannot_rewrite_origin_history(self) -> None:
        first = "https://github.com/example/project/pull/1#discussion_r1"
        second = "https://github.com/example/project/pull/2#discussion_r2"
        path = "wiki/reviewer/rules/traceable-rule.json"
        existing = self.rule(
            "traceable-rule",
            [{"url": first, "effect": "created", "note": "Created here."}],
        )
        rewritten = self.rule(
            "traceable-rule",
            [
                {"url": first, "effect": "created", "note": "Rewritten note."},
                {"url": second, "effect": "edited", "note": "Clarified here."},
            ],
        )
        result = {
            "status": "learned",
            "base_main_sha": "a" * 40,
            "reason": "Attempted rewrite.",
            "changes": [{"operation": "write", "path": path, "content": rewritten}],
        }
        with self.assertRaisesRegex(ReviewerError, "history was rewritten"):
            validate_result(
                result,
                "a" * 40,
                existing_knowledge={path: existing},
                allowed_origin_urls={second},
                owner_origin_urls={second},
            )

    def test_retirement_requires_owner_comment_and_preserves_rule(self) -> None:
        created = "https://github.com/example/project/pull/1#discussion_r1"
        retired = "https://github.com/example/project/pull/2#discussion_r2"
        active_path = "wiki/reviewer/rules/traceable-rule.json"
        retired_path = "wiki/reviewer/retired/traceable-rule.json"
        existing = self.rule(
            "traceable-rule",
            [{"url": created, "effect": "created", "note": "Created here."}],
        )
        result = {
            "status": "learned",
            "base_main_sha": "a" * 40,
            "reason": "Owner retired the rule.",
            "changes": [
                {"operation": "delete", "path": active_path, "content": None},
                {
                    "operation": "write",
                    "path": retired_path,
                    "content": self.rule(
                        "traceable-rule",
                        [
                            {
                                "url": created,
                                "effect": "created",
                                "note": "Created here.",
                            }
                        ],
                        status="retired",
                        retired_by={"url": retired, "reason": "No longer applies."},
                    ),
                },
            ],
        }
        validate_result(
            result,
            "a" * 40,
            existing_knowledge={active_path: existing},
            allowed_origin_urls={retired},
            owner_origin_urls={retired},
        )

        with self.assertRaisesRegex(ReviewerError, "owner comment"):
            validate_result(
                result,
                "a" * 40,
                existing_knowledge={active_path: existing},
                allowed_origin_urls={retired},
                owner_origin_urls=set(),
            )


if __name__ == "__main__":
    unittest.main()
