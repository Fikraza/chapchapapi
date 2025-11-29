const path = require("path");
const fs = require("fs");

const {
  getConfigObject,
  projectIsModuleBased,
  updateConfigFile,
  getStructureObject,
  updateStructureObject,
} = require("./../../UTILS/config");

const {
  copyFileRecursive,
  getFilenameAndParent,
  createDirsRecursively,
} = require("./../../UTILS/helpfull");

const { getPrismaModels } = require("./../../UTILS/prisma");

const { select, input, confirm } = require("@inquirer/prompts");

const cliMessage = require("./../../UTILS/cliMessage");

async function GenCrudModel() {
  const structureObj = getStructureObject();
  const currentDir = __dirname;
  const cwd = process.cwd();
  const config = getConfigObject();

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

  let models = await getPrismaModels();

  if (!models) {
    cliMessage.printError("models not found");
    return;
  }

  const structureObjKeys = Object.keys(structureObj);

  const baseModelFolder = path.join(
    cwd,
    config.baseFolder,
    "Controller/Scheme/Models"
  );

  //Comming soon
  // const pdfFiles = [
  //   path.join(currentDir, "pdf/generate.js"),
  //   path.join(currentDir, "pdf/index.js"),
  // ];

  const csvFiles = [
    path.join(currentDir, "csv/generate.js"),
    path.join(currentDir, "csv/template.js"),
    path.join(currentDir, "csv/upload.js"),
    path.join(currentDir, "csv/uploadTx.js"),
    path.join(currentDir, "csv/index.js"),
  ];

  const permissionFiles = [
    path.join(currentDir, "permission/config.json"),
    path.join(currentDir, "permission/create.js"),
    path.join(currentDir, "permission/delete.js"),
    path.join(currentDir, "permission/list.js"),
    path.join(currentDir, "permission/multiModel.js"),
    path.join(currentDir, "permission/patch.js"),
    path.join(currentDir, "permission/read.js"),
    path.join(currentDir, "permission/update.js"),
    path.join(currentDir, "permission/index.js"),
  ];
  const searchFiles = [
    path.join(currentDir, "search/fuzzy.js"),
    path.join(currentDir, "search/pg.js"),
    path.join(currentDir, "search/index.js"),
  ];

  let allFilesPaths = [...csvFiles, ...permissionFiles, ...searchFiles];

  for (let i = 0; i < structureObjKeys.length; i++) {
    let structureObjKey = structureObjKeys[i];
    let model = models[structureObjKey];
    let structurePath = structureObj[structureObjKey];

    cliMessage.printInfo(`Generating for model ${structureObjKey}`);

    if (!model) {
      cliMessage.printWarning(
        `Model ${structureObjKey} not found in prisma\n.Skipping`
      );
      continue;
    }

    let includePath = path.join(baseModelFolder, structurePath, "include.json");
    const include = model?.include || {};

    let fieldPath = path.join(baseModelFolder, structurePath, "field.json");
    let field = model?.field || {};
    await createDirsRecursively(fieldPath);
    await createDirsRecursively(includePath);

    if (!fs.existsSync(includePath)) {
      fs.writeFileSync(includePath, JSON.stringify(include, null, 2));
    } else {
      cliMessage.printWarning([
        `File exists include.json`,
        `path ${includePath}`,
        `Skipping`,
      ]);
    }

    if (!fs.existsSync(fieldPath)) {
      fs.writeFileSync(fieldPath, JSON.stringify(field, null, 2));
    } else {
      cliMessage.printWarning([
        `File exists field.json`,
        `path ${fieldPath}`,
        `Skipping`,
      ]);
    }

    for (let i = 0; i < allFilesPaths.length; i++) {
      let fromFilePath = allFilesPaths[i];
      let parsedPath = getFilenameAndParent(fromFilePath);

      let toFilePath = path.join(
        baseModelFolder,
        structurePath,
        parsedPath.parent,
        parsedPath.filename
      );

      if (!fs.existsSync(toFilePath)) {
        await createDirsRecursively(toFilePath);
        let cpyRes = await copyFileRecursive({ fromFilePath, toFilePath });

        if (!cpyRes) {
          cliMessage.printWarning([
            `Failed to create file ${parsedPath.filename}`,
            `Skipping`,
          ]);
        }
      } else {
        cliMessage.printWarning([
          `File exists ${parsedPath.filename}`,
          `path ${toFilePath}`,
          `Skipping`,
        ]);
      }
    }
  }
}

module.exports = GenCrudModel;
