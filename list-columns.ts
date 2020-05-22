#!/usr/bin/env deno run --allow-env --allow-net
import { headers } from "./headers.ts";
const col_id = Deno.args[0];
const endpoint = `https://api.github.com/projects/${col_id}/columns`;

const r = await fetch(endpoint, { headers });
if (r.status !== 200) {
  Deno.exit(0);
}

const p = await r.json();
if (!p) {
  Deno.exit(0);
}

interface Column {
  id: number;
  name: string;
}

const a = (p as Column[]).map((e) => ({
  id: e.id,
  name: e.name,
}));
console.log(JSON.stringify(a));
