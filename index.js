#!/usr/bin/env node

const args = process.argv.slice(2);

const init = require("./CMD/Init");
const GenCrudModel = require("./CMD/GenCrudModel");
const GenFolderStructure = require("./CMD/GenFolderStructure");
const GenScheme = require("./CMD/GenScheme");

const getPrismaModels = require("./UTILS/prisma/getPrismaModels");

if (args[0]?.toLowerCase() === "init") {
  init();
}

// if (args[0]?.toLocaleLowerCase() === "test") {
//   GenCrudModel();
// }
