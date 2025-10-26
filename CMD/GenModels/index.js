const {
  getConfigObject,
  projectIsModuleBased,
  updateConfigFile,
  getStructureObject,
  updateStructureObject,
} = require("./../../UTILS/config");

const cliMessage = require("./../../UTILS/cliMessage");

async function GenCrudFiles(req, res, next) {
  try {
    // code here

    const config = await getConfigObject();

    const cwd = process.cwd();

    if (!config) {
      cliMessage.error(["Failed to get config object", "Run initializer"]);
      return;
    }

    const structure = await getStructureObject();

    if (!structure) {
      cliMessage.error(["Faild to get stucture object", "Run initalizer"]);
      return;
    }

    let modelKeys = Object.keys(structure);
  } catch (e) {
    next(e);
  }
}

module.exports = GenCrudFiles;
