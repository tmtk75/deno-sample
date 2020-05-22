#!/usr/bin/env deno run --allow-env --allow-net
import { headers } from "./headers.ts";
const org = Deno.args[0];

const endpoint = `https://api.github.com/orgs/${org}/projects`;
const r = await fetch(endpoint, { headers });
if (r.status !== 200) {
  console.warn(r);
  Deno.exit(0);
}

const p = await r.json();
if (!p) {
  console.warn(r);
  Deno.exit(0);
}

interface Project {
  id: number;
  name: string;
  owner_url: string;
  columns_url: string;
}

const a = (p as Project[]).map((e) => ({
  id: e.id,
  name: e.name,
  columns_url: e.columns_url,
}));

console.log(JSON.stringify(a));
