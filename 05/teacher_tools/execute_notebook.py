"""Execute a notebook with the project's Jupyter kernel and preserve outputs."""

from __future__ import annotations

import argparse
import base64
import json
from pathlib import Path

from jupyter_client import KernelManager


def execute(notebook_path: Path, working_dir: Path) -> None:
    notebook = json.loads(notebook_path.read_text(encoding="utf-8"))
    manager = KernelManager()
    manager.start_kernel(cwd=str(working_dir))
    client = manager.client()
    client.start_channels()
    client.wait_for_ready(timeout=60)
    execution_count = 0

    try:
        for cell in notebook.get("cells", []):
            if cell.get("cell_type") != "code":
                continue
            execution_count += 1
            source = "".join(cell.get("source", []))
            message_id = client.execute(source, stop_on_error=True)
            outputs: list[dict] = []

            while True:
                message = client.get_iopub_msg(timeout=120)
                if message.get("parent_header", {}).get("msg_id") != message_id:
                    continue
                message_type = message["msg_type"]
                content = message["content"]
                if message_type == "stream":
                    outputs.append({
                        "name": content["name"],
                        "output_type": "stream",
                        "text": content["text"].splitlines(keepends=True),
                    })
                elif message_type in {"display_data", "execute_result"}:
                    data = dict(content.get("data", {}))
                    if isinstance(data.get("image/png"), bytes):
                        data["image/png"] = base64.b64encode(data["image/png"]).decode("ascii")
                    for key, value in list(data.items()):
                        if isinstance(value, str) and key.startswith("text/"):
                            data[key] = value.splitlines(keepends=True)
                    output = {
                        "data": data,
                        "metadata": content.get("metadata", {}),
                        "output_type": message_type,
                    }
                    if message_type == "execute_result":
                        output["execution_count"] = execution_count
                    outputs.append(output)
                elif message_type == "error":
                    outputs.append({
                        "ename": content["ename"],
                        "evalue": content["evalue"],
                        "output_type": "error",
                        "traceback": content.get("traceback", []),
                    })
                    raise RuntimeError(f"Notebook cell {execution_count} failed: {content['ename']}: {content['evalue']}")
                elif message_type == "status" and content.get("execution_state") == "idle":
                    break

            cell["execution_count"] = execution_count
            cell["outputs"] = outputs

        notebook["metadata"].setdefault("language_info", {})["version"] = "3.14"
        notebook_path.write_text(
            json.dumps(notebook, ensure_ascii=False, indent=1) + "\n",
            encoding="utf-8",
        )
    finally:
        client.stop_channels()
        manager.shutdown_kernel(now=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("notebook", type=Path)
    parser.add_argument("--working-dir", type=Path, required=True)
    args = parser.parse_args()
    execute(args.notebook.resolve(), args.working_dir.resolve())


if __name__ == "__main__":
    main()
