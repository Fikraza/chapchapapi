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

async function Init(obj) {
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
  const relativePath = path.relative(cwd, targetPath);

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
    cliMessage.printSuccess(`✅  Folder created at: ${targetPath}`);
  } else {
    cliMessage.printNote(`📂 Folder already exists: ${targetPath}`);
  }

  const defaultFields = ["id", "created_at", "updated_at"];
  const fieldSkip = [];

  for (const field of defaultFields) {
    const shouldSkip = await confirm({
      message: cliMessage.info(
        `Skip the following fields for generation ${field} ?`
      ),
      default: true,
    });

    if (shouldSkip) {
      fieldSkip.push(field);
    }
  }

  let moduleBase = projectIsModuleBased(cwd);

  let configObj = {
    prisma: baseFilePaths.prisma_file_path,
    type: moduleBase,
    fieldSkip,
  };

  updateConfigFile(configObj);
}

module.exports = Init;
