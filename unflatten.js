#!/usr/bin/env node
const fs = require('fs');

function unflattenNodeData(dataArray) {
  const base = {};
  if (dataArray.length < 2 || typeof dataArray[1] !== 'object' || Array.isArray(dataArray[1])) return base;
  if (typeof dataArray[0] === 'object' && !Array.isArray(dataArray[0])) Object.assign(base, dataArray[0]);
  const mapping = dataArray[1], pool = dataArray, memo = {}, inProgress = new Set();
  function resolve(idx) {
    if (typeof idx !== 'number' || idx < 0 || idx >= pool.length) return null;
    if (memo.hasOwnProperty(idx)) return memo[idx];
    if (inProgress.has(idx)) return pool[idx];
    inProgress.add(idx);
    const val = pool[idx];
    let result;
    if (val && typeof val === 'object' && !Array.isArray(val) &&
        Object.values(val).every(v => typeof v === 'number')) {
      result = {};
      for (const [k, subIdx] of Object.entries(val)) result[k] = resolve(subIdx);
    } else if (Array.isArray(val)) {
      result = val.map(x => typeof x === 'number' ? resolve(x) : x);
    } else result = val;
    memo[idx] = result;
    inProgress.delete(idx);
    return result;
  }
  for (const [key, idx] of Object.entries(mapping)) base[key] = resolve(idx);
  return base;
}

function unflattenNodes(nodes) {
  return (nodes || [])
    .filter(raw => raw && raw.type === 'data')
    .map(raw => unflattenNodeData(raw.data));
}

const inputPath = process.argv[2];
const root = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
const records = unflattenNodes(root.nodes);
const main = records.find(r => r && r.uuid);
const final = main || (records.length ? records[0] : {});
fs.writeFileSync(inputPath, JSON.stringify(final, null, 2));
