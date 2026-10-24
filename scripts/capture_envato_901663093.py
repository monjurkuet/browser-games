import hashlib
import json
import pathlib
import shutil
import sys
import tempfile
import urllib.parse
import urllib.request

BASE = "https://previews.customer.envatousercontent.com/files/901663093/"
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "magic-lady-slot-port"
RESOURCES = OUT / "original-resources.json"
PRESERVED = {
    "capture-manifest.json", "original-resources.json", "README.md", "NOTES.md",
    "server.js", "original-browser-audit.json", "local-browser-audit.json",
}


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read(), dict(response.headers)


def safe_target(root, relative):
    if not relative or pathlib.PurePosixPath(relative).is_absolute():
        raise ValueError(f"Unsafe path: {relative!r}")
    target = (root / pathlib.PurePosixPath(relative)).resolve()
    try:
        target.relative_to(root)
    except ValueError as exc:
        raise ValueError(f"Unsafe path: {relative!r}") from exc
    return target


def main():
    resources = json.loads(RESOURCES.read_text(encoding="utf-8"))
    paths = {"index.html"}
    for resource in resources:
        parsed = urllib.parse.urlparse(resource.strip())
        if parsed.netloc == "previews.customer.envatousercontent.com" and parsed.path.startswith("/files/901663093/"):
            paths.add(parsed.path[len("/files/901663093/"):])
    manifest = {}
    with tempfile.TemporaryDirectory(prefix="magic-lady-slot-capture-") as temporary:
        staging = pathlib.Path(temporary).resolve()
        for relative in sorted(paths):
            target = safe_target(staging, relative)
            target.parent.mkdir(parents=True, exist_ok=True)
            body, headers = fetch(BASE + relative)
            target.write_bytes(body)
            manifest[relative] = {
                "bytes": len(body),
                "sha256": hashlib.sha256(body).hexdigest(),
                "content_type": headers.get("Content-Type", ""),
            }
            print(relative, len(body))
        (staging / "capture-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        for existing in OUT.iterdir():
            if existing.name in PRESERVED:
                continue
            shutil.rmtree(existing) if existing.is_dir() else existing.unlink()
        for staged in staging.iterdir():
            destination = OUT / staged.name
            shutil.copytree(staged, destination) if staged.is_dir() else shutil.copy2(staged, destination)
    print(f"captured={len(manifest)} bytes={sum(item['bytes'] for item in manifest.values())}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"capture failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
