#!/usr/bin/env node

const args = process.argv.slice(2);

console.log(args);

const init = require("./CMD/Init");

if (args[0]?.toLowerCase() === "init") {
  init();
}
