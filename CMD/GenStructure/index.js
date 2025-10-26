const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const {
  getConfigObject,
  projectIsModuleBased,
  updateConfigFile,
  getStructureObject,
  updateStructureObject,
} = require("./../../UTILS/config");

const { select, input, confirm } = require("@inquirer/prompts");

const cliMessage = require("./../../UTILS/cliMessage");

const smartFolderStructure = require("./smartStrucure");
const normalFolderStructure = require("./normalStructure");

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
  } else {
    cliMessage.info(
      "Generating folder structure by reading schema.prisma file"
    );
  }
  const folderType = await select({
    message: "Choose folder structure type:",
    choices: [
      { name: "Smart (recommended)", value: "smart" },
      { name: "General", value: "general" },
    ],
  });

  const folderStructureFunc =
    folderType === "smart" ? smartFolderStructure : normalFolderStructure;

  let folderStructure = await folderStructureFunc();

  if (!folderStructure) {
    cliMessage.error(`Failed to generate folder structure`);
    return;
  }

  updateStructureObject(folderStructure);
}

module.exports = GenFolderStructure;
