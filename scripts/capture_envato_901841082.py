import hashlib
import json
import pathlib
import sys
import urllib.parse
import urllib.request

BASE = "https://previews.customer.envatousercontent.com/files/901841082/"
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "horse-slot-port"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read(), dict(response.headers)

def main():
    resources = json.loads((ROOT / "envato-901841082-resources.json").read_text(encoding="utf-8"))
    paths = set()
    for resource in resources:
        parsed = urllib.parse.urlparse(resource)
        if parsed.netloc == "previews.customer.envatousercontent.com":
            if parsed.path.startswith("/files/901841082/"):
                paths.add(parsed.path[len("/files/901841082/"):])
            elif parsed.path == "/favicon.ico":
                paths.add("favicon.ico")
    paths.add("index.html")
    manifest = {}
    for rel in sorted(paths):
        target = OUT / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            body, headers = fetch(BASE + rel)
        except Exception as exc:
            print(f"FAILED {rel}: {exc}", file=sys.stderr)
            continue
        target.write_bytes(body)
        manifest[rel] = {
            "bytes": len(body),
            "sha256": hashlib.sha256(body).hexdigest(),
            "content_type": headers.get("Content-Type", "")
        }
        print(rel, len(body))
    (OUT / "capture-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"captured={len(manifest)} bytes={sum(v['bytes'] for v in manifest.values())}")

if __name__ == "__main__":
    main()
