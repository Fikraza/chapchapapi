const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

const {
  getConfigObject,
  projectIsModuleBased,
  updateConfigFile,
} = require("./../../UTILS/config");

const { select, input, confirm } = require("@inquirer/prompts");

const cliMessage = require("./../../UTILS/cliMessage");

const getBaseFilePaths = require("./getBaseFilePaths");

const GenFolderStructure = require("./../GenFolderStructure");

const GenScheme = require("./../GenScheme");

const GenCrudModel = require("./../GenCrudModel");

async function Init() {
  const cwd = process.cwd();

  const baseFilePaths = getBaseFilePaths();

  if (!baseFilePaths) {
    return;
  }

  const config = getConfigObject();

  if (config) {
    const proceed = await confirm({
      message: cliMessage.warning(
        `Existing Configuration found.Do you want to continue initalization process?`
      ),
      default: false,
    });

    if (!proceed) {
      return;
    }
  }

  const baseFolder = await input({
    message: cliMessage.info("Enter base folder name"),
    default: "APP",
  });

  if (!baseFolder) {
    cliMessage.printError("Base Folder required");
    return;
  }

  const targetPath = path.resolve(baseFolder);

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
    cliMessage.printSuccess(`✅  Folder created at: ${targetPath}`);
  } else {
    cliMessage.printNote(`📂 Folder already exists: ${targetPath}`);
  }

  let moduleBase = projectIsModuleBased(cwd);

  let configObj = {
    prisma: "prisma/schema.prisma",
    type: moduleBase,
    baseFolder: baseFolder,
  };

  updateConfigFile(configObj);

  await GenFolderStructure();
  await GenScheme();
  await GenCrudModel();
}

module.exports = Init;
