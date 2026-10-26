import hashlib
import json
import pathlib
import shutil
import sys
import tempfile
import urllib.parse
import urllib.request

BASE = "https://previews.customer.envatousercontent.com/files/659692993/"
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "western-slot-port"
RESOURCES = OUT / "original-resources.json"
PRESERVED_FILES = {
    "capture-manifest.json",
    "original-resources.json",
    "original-browser-audit.json",
    "local-browser-audit.json",
    "README.md",
    "NOTES.md",
    "server.js",
}


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read(), dict(response.headers)


def safe_target(staging_root, relative):
    if not relative or pathlib.PurePosixPath(relative).is_absolute():
        raise ValueError(f"Unsafe capture path: {relative!r}")
    target = (staging_root / pathlib.PurePosixPath(relative)).resolve()
    try:
        target.relative_to(staging_root)
    except ValueError as exc:
        raise ValueError(f"Unsafe capture path: {relative!r}") from exc
    return target


def main():
    resources = json.loads(RESOURCES.read_text(encoding="utf-8"))
    paths = set()
    for resource in resources:
        parsed = urllib.parse.urlparse(resource)
        if parsed.netloc == "previews.customer.envatousercontent.com":
            if parsed.path.startswith("/files/659692993/"):
                paths.add(parsed.path[len("/files/659692993/"):])
    paths.add("index.html")

    manifest = {}
    failures = []
    with tempfile.TemporaryDirectory(prefix="western-slot-capture-") as temporary:
        staging_root = pathlib.Path(temporary).resolve()
        for relative in sorted(paths):
            try:
                target = safe_target(staging_root, relative)
                target.parent.mkdir(parents=True, exist_ok=True)
                body, headers = fetch(BASE + relative)
            except Exception as exc:
                failures.append((relative, str(exc)))
                print(f"FAILED {relative}: {exc}", file=sys.stderr)
                continue
            target.write_bytes(body)
            manifest[relative] = {
                "bytes": len(body),
                "sha256": hashlib.sha256(body).hexdigest(),
                "content_type": headers.get("Content-Type", ""),
            }
            print(f"{relative} {len(body)}")

        if failures:
            raise SystemExit(1)

        (staging_root / "capture-manifest.json").write_text(
            json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
        )

        for existing in OUT.iterdir():
            if existing.name in PRESERVED_FILES:
                continue
            if existing.is_dir():
                shutil.rmtree(existing)
            else:
                existing.unlink()

        for staged in staging_root.iterdir():
            destination = OUT / staged.name
            if staged.is_dir():
                shutil.copytree(staged, destination)
            else:
                shutil.copy2(staged, destination)

    total_bytes = sum(item["bytes"] for item in manifest.values())
    print(f"captured={len(manifest)} bytes={total_bytes} failures={len(failures)}")


if __name__ == "__main__":
    main()