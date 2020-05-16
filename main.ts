import { sprintf } from "https://deno.land/std@0.50.0/fmt/sprintf.ts"
const a = sprintf("hello, world %v", 123)
console.debug(a);
