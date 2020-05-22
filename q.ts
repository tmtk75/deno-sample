const u = new URL("https://example.com?q=1&p=2#foobar");
console.log(u);

const q = u.search.substring(1);
console.log(q);

const sp = new URLSearchParams(q);
const r = sp.getAll("q");
console.log(r);

console.log(Array.from(sp.entries()));
