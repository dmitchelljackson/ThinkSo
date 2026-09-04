"""Generate the committed, authoritative OpenAPI document."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1] / "src"))
from thinkso.app import app

output = Path(__file__).parents[1] / "openapi.json"
output.write_text(json.dumps(app.openapi(), indent=2, sort_keys=True) + "\n", encoding="utf-8")
