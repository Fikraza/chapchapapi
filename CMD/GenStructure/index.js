const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const {
  getConfigObject,
  projectIsModuleBased,
  updateConfigFile,
  getStructureObject,
} = require("./../../UTILS/config");



const { select, input, confirm } = require("@inquirer/prompts");

const cliMessage = require("./../../UTILS/cliMessage");

const getBaseFilePaths = require("./getBaseFilePaths");

async function GenFolderStructure() {
  const configObj = getConfigObject();

  if (!configObj) {
    cliMessage.error("Config object not found run init to initialize");
    return;
  }

  if (!configObj?.prisma) {
    cliMessage.error(
      "Config object missing prisma file location run initalize <init>"
    );
    return;
  }

  const structureObj = getStructureObject();

  cliMessage.info("Generating folder structure by reading schema.prisma file");

  if (structureObj) {
    const proceed = await confirm({
      message: cliMessage.warning(
        `Existing Structure File Found. If you contine it will be overiten. use cmd sync structure if you need to make an update`
      ),
      default: false,
    });

    if (!proceed) {
      return;
    }
  }
  const folderType = await select({
    message: "Choose folder structure type:",
    choices: [
      { name: "Smart (recommended)", value: "smart" },
      { name: "General", value: "General" },
    ],
  });




}

module.exports = GenFolderStructure;
