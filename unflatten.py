#!/usr/bin/env python3
import json, sys

def unflatten_node_data(data_array):
    base = {}
    if len(data_array) < 2 or not isinstance(data_array[1], dict):
        return base

    if isinstance(data_array[0], dict):
        base.update(data_array[0])

    mapping = data_array[1]
    pool = data_array
    memo = {}
    in_progress = set()

    def resolve(idx):
        if not isinstance(idx, int) or idx < 0 or idx >= len(pool):
            return None
        if idx in memo:
            return memo[idx]
        if idx in in_progress:
            return pool[idx]
        in_progress.add(idx)
        val = pool[idx]
        if isinstance(val, dict) and val and all(isinstance(v, int) for v in val.values()):
            result = {k: resolve(v) for k, v in val.items()}
        elif isinstance(val, list):
            result = [resolve(x) if isinstance(x, int) else x for x in val]
        else:
            result = val
        memo[idx] = result
        in_progress.remove(idx)
        return result

    for key, idx in mapping.items():
        base[key] = resolve(idx)
    return base


def unflatten_nodes(nodes):
    out = []
    for raw in nodes or []:
        if isinstance(raw, dict) and raw.get("type") == "data":
            arr = raw.get("data")
            if isinstance(arr, list):
                out.append(unflatten_node_data(arr))
    return out

if __name__ == "__main__":
    input_path = sys.argv[1]
    root = json.load(open(input_path))
    records = unflatten_nodes(root.get("nodes"))
    main = next((r for r in records if isinstance(r, dict) and 'uuid' in r), None)
    final = main if main is not None else (records[0] if records else {})
    open(input_path, "w").write(json.dumps(final, indent=2))
