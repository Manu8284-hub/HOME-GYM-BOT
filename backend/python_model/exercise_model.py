"""Small standard-library exercise retrieval model for FitBot.

Reads the project CSV and returns the best matching exercise records as JSON.
It is intentionally retrieval-based: the CSV contains exercise facts, not labels
for supervised training.
"""

import csv
import json
import os
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CSV_PATH = Path(os.environ.get("EXERCISES_CSV_PATH", ROOT / "dataset" / "exercises.csv"))


def load_records():
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        records = []
        for row in csv.DictReader(handle):
            instructions = [
                value.strip()
                for key, value in row.items()
                if key.startswith("instructions/") and value and value.strip()
            ]
            secondary = [
                value.strip()
                for key, value in row.items()
                if key.startswith("secondaryMuscles/") and value and value.strip()
            ]
            records.append({
                "id": row.get("id", ""),
                "name": row.get("name", ""),
                "bodyPart": row.get("bodyPart", ""),
                "equipment": row.get("equipment", ""),
                "target": row.get("target", ""),
                "secondaryMuscles": secondary,
                "instructions": instructions,
                "gifUrl": row.get("gifUrl", "")
            })
        return [record for record in records if record["name"]]


def tokens(value):
    return [item for item in re.split(r"[^a-z0-9]+", value.lower()) if len(item) > 1]


def search(query, profile):
    query_terms = tokens(query)
    home_only = "home" in str(profile.get("exercisePreference", "")).lower()
    matches = []

    for record in load_records():
        searchable = " ".join([
            record["name"],
            record["bodyPart"],
            record["equipment"],
            record["target"],
            " ".join(record["secondaryMuscles"])
        ]).lower()
        if home_only and "body weight" not in record["equipment"].lower():
            continue

        score = sum(
            3 if term in record["name"].lower() else 1
            for term in query_terms
            if term in searchable
        )
        if score:
            matches.append((score, record))

    matches.sort(key=lambda item: item[0], reverse=True)
    return [record for _, record in matches[:6]]


def main():
    request = json.loads(sys.stdin.read() or "{}")
    print(json.dumps({"matches": search(request.get("query", ""), request.get("profile", {}))}))


if __name__ == "__main__":
    main()
