#!/usr/bin/env node

const args = process.argv.slice(2);

console.log(args);

const init = require("./CMD/Init");
const GenStructure = require("./CMD/GenStructure");
const GenScheme = require("./CMD/GenScheme");

if (args[0]?.toLowerCase() === "init") {
  init();
}

if (args[0]?.toLocaleLowerCase() === "test") {
  GenScheme();
}
