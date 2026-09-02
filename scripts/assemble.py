from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PARTS = ROOT / "src" / "parts"


def join(prefix: str, dest: Path) -> None:
    chunks = sorted(PARTS.glob(f"{prefix}-*.txt"))
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text("".join(p.read_text() for p in chunks), encoding="utf-8")
    print(f"assembled {dest} from {len(chunks)} parts")


if __name__ == "__main__":
    join("App", ROOT / "src" / "App.tsx")
    join("styles", ROOT / "src" / "styles.css")
    join("data", ROOT / "src" / "data.ts")
    join("guide", ROOT / "public" / "data" / "festival-guide-2025.json")
    join("load", ROOT / "public" / "data" / "access-load-model.json")
    join("kma", ROOT / "public" / "data" / "weather-kma-snapshot.json")
    join("prog", ROOT / "public" / "data" / "programs-2026.json")
