import argparse
import hashlib
import json
import pathlib
import subprocess
import sys
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
PORT_ROOT = ROOT / "gladiator-slot-port"
ORIGINAL_PREFIX = "/files/730070676/"
LOCAL_HOST = "127.0.0.1:18792"


class VerificationError(RuntimeError):
    pass


def require(condition, message):
    if not condition:
        raise VerificationError(message)


def normalized_game_paths(resources, source):
    paths = set()
    for resource in resources:
        parsed = urllib.parse.urlparse(resource)
        if source == "original":
            if parsed.netloc == "previews.customer.envatousercontent.com" and parsed.path.startswith(ORIGINAL_PREFIX):
                paths.add(parsed.path[len(ORIGINAL_PREFIX):])
        elif source == "local":
            if parsed.netloc == LOCAL_HOST:
                relative = parsed.path.lstrip("/")
                if relative and relative != "favicon.ico":
                    paths.add(relative)
    return paths


def main():
    parser = argparse.ArgumentParser(description="Verify the Gladiator Slot direct port")
    parser.add_argument(
        "--skip-browser",
        action="store_true",
        help="Validate retained audit artifacts without regenerating them in Chrome",
    )
    arguments = parser.parse_args()

    if not arguments.skip_browser:
        subprocess.run(
            ["node", str(ROOT / "scripts" / "audit_gladiator_slot.mjs")],
            check=True,
        )

    manifest = json.loads((PORT_ROOT / "capture-manifest.json").read_text(encoding="utf-8"))
    original_audit = json.loads((PORT_ROOT / "original-browser-audit.json").read_text(encoding="utf-8"))
    local_audit = json.loads((PORT_ROOT / "local-browser-audit.json").read_text(encoding="utf-8"))

    for relative, metadata in manifest.items():
        target = (PORT_ROOT / relative).resolve()
        try:
            target.relative_to(PORT_ROOT.resolve())
        except ValueError as exc:
            raise VerificationError(f"Manifest path escapes port root: {relative}") from exc
        body = target.read_bytes()
        require(len(body) == metadata["bytes"], f"Size mismatch: {relative}")
        require(hashlib.sha256(body).hexdigest() == metadata["sha256"], f"SHA-256 mismatch: {relative}")

    original_paths = normalized_game_paths(original_audit["resources"], "original")
    local_paths = normalized_game_paths(local_audit["resources"], "local")
    manifest_paths = set(manifest) - {"index.html"}
    require(original_paths == local_paths == manifest_paths, "Original, local, and manifest inventories differ")
    require(original_audit["title"] == local_audit["title"], "Original and local document titles differ")

    for name, audit in (("original", original_audit), ("local", local_audit)):
        require(audit["audit"]["errors"] == [], f"{name} uncaught errors: {audit['audit']['errors']}")
        require(audit["audit"]["rejections"] == [], f"{name} unhandled rejections: {audit['audit']['rejections']}")
        require(audit["audit"]["consoleErrors"] == [], f"{name} console errors: {audit['audit']['consoleErrors']}")
        require(audit["canvas"]["width"] == 784 and audit["canvas"]["height"] == 469, f"{name} canvas dimensions differ")
        require(audit["before"]["state"] == "IddleState", f"{name} did not start in IddleState")
        require(audit["before"]["balance"] == "100000", f"{name} initial balance differs")
        require(audit["before"]["bet"] == "20", f"{name} initial bet differs")
        require(any("SpinState" in sample["state"] for sample in audit["samples"]), f"{name} never entered a spin state")
        require(
            any(sample["balance"] == "99980" for sample in audit["samples"]),
            f"{name} did not debit the 20-credit bet",
        )
        require(
            any(sample["state"] in {"WinState", "LooseState", "FreeInputWinState"} for sample in audit["samples"]),
            f"{name} spin never resolved",
        )

    print(f"manifest_files={len(manifest)} manifest_bytes={sum(item['bytes'] for item in manifest.values())}")
    print(f"original_paths={len(original_paths)} local_paths={len(local_paths)} inventories_match=true")
    print("console_errors=0 original_errors=0 original_rejections=0")
    print("gameplay_transitions=verified")


if __name__ == "__main__":
    try:
        main()
    except (VerificationError, subprocess.CalledProcessError) as error:
        print(f"verification failed: {error}", file=sys.stderr)
        raise SystemExit(1)
