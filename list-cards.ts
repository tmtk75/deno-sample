#!/usr/bin/env deno run --allow-net --allow-env
import { headers } from "./headers.ts";

interface Card {
  url: string;
  content_url: string;
  creator: {
    login: string;
  };
}

const [column_id] = Deno.args;

async function list_done(): Promise<Card[]> {
  // 1st page
  const apiurl = `https://api.github.com/projects/columns/${column_id}/cards`;
  const res = await fetch(apiurl, { method: "GET", headers });
  const link = res.headers.get("link");
  const res1page = await res.json();

  // Last page number
  // const link = `<https://api.github.com/repositories/123456789/pulls?state=all&page=2>; rel="next", <https://api.github.com/repositories/123456789/pulls?state=all&page=50>; rel="last"`;
  let all = null;
  if (link) {
    const m = link.match(/<([^>]+)>; rel="last"/);
    if (!m || !m[1]) {
      throw new Error(`no last`);
    }
    const last = new URL(m[1]);
    const params = new URLSearchParams(last.search);
    const p = params.get("page") ?? "1";
    if (!p) {
      throw new Error(`no page`);
    }
    const page = Number.parseInt(p);
    const state = params.get("state");

    // All responses
    const pages = [...Array(page + 1).keys()].slice(2);
    const urls = pages
      .map(
        (p) =>
          `${last.protocol}//${last.host}${last.pathname}?state=${state}&page=${p}`
      )
      .map((e) => fetch(e, { headers }).then((r) => r.json()));
    const allres = await Promise.all(urls);
    all = [res1page].concat(allres);
  } else {
    all = [res1page];
  }

  // Print
  const r = [].concat.apply([], all); // flatten
  const a = JSON.stringify(r);
  return r;
}

const cards = await list_done();
const r = cards.map((e) => ({
  url: e.url,
  content_url: e.content_url,
  creator: { login: e.creator.login },
}));
console.log(JSON.stringify(r));
