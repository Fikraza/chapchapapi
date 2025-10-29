const path = require("path");

const {
  getConfigObject,
  projectIsModuleBased,
  updateConfigFile,
  getStructureObject,
  updateStructureObject,
} = require("./../../UTILS/config");

const { getPrismaModels } = require("./../../UTILS/prisma");

const { select, input, confirm } = require("@inquirer/prompts");

const cliMessage = require("./../../UTILS/cliMessage");

async function GenCrudModel() {
  const structureObj = getStructureObject();
  const currentDir = __dirname;
  const cwd = process.cwd();

  if (!structureObj) {
    cliMessage.printError(["Folder structure object not found"]);
    return;
  }

  if (!config) {
    cliMessage.printError(["Failed to get config object", "Run initializer"]);
    return;
  }

  if (!config?.baseFolder) {
    cliMessage.printError(["Base folder not found", "Run initializer"]);
    return;
  }

  const moduleBase = projectIsModuleBased();
  if (moduleBase !== "commonjs") {
    cliMessage.printError(
      "chapchapapi only supports module-based JS at this point"
    );
    return;
  }

  const structureObjKeys = Object.keys(structureObj);

  const baseModelFolder = path.join(
    cwd,
    config.baseFolder,
    "Controller/Scheme"
  );

  for (let i = 0; i < structureObjKeys.length; i++) {
    const structureObjKey = structureObjKeys[i];
  }
}

module.exports = GenCrudModel;
