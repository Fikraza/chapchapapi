const getConfig = require("./getConfig");
const getStructure = require("./getStructure");
const path = require("path");
const process = require("process");
const fs = require("fs");

function getModel({ model }) {
  try {
    const cwd = process.cwd();
    if (!model) {
      throw { custom: true, message: "Model is required" };
    }
    const config = getConfig();
    const structure = getStructure();

    if (!config?.baseFolder) {
      throw { custom: true, message: "", status: 504 };
    }

    const modelPath = structure[model?.toLowerCase()];

    if (!modelPath) {
      throw {
        custom: true,
        message: "Model path not found,Try sync models with prisma",
      };
    }

    //console.log("MODEL PATH", modelPath);
    const modelDir = path.join(
      cwd,
      config.baseFolder,
      "Controller/Scheme/Models",
      modelPath
    );

    const modelObj = {};

    const fieldPath = path.join(modelDir, "field.json");
    const includePath = path.join(modelDir, "include.json");
    const csvPath = path.join(modelDir, "csv/index.js");
    const permissionPath = path.join(modelDir, "permission/index.js");
    const pdfPath = path.join(modelDir, "pdf/index.js");
    const searchPath = path.join(modelDir, "search/index.js");

    if (fs.existsSync(fieldPath)) {
      const field = JSON.parse(fs.readFileSync(fieldPath, "utf-8"));

      modelObj.field = field;
    }

    if (fs.existsSync(includePath)) {
      const include = JSON.parse(fs.readFileSync(includePath, "utf-8"));
      modelObj.include = include;
    }

    if (fs.existsSync(csvPath)) {
      modelObj.csv = require(csvPath);
    }

    if (fs.existsSync(permissionPath)) {
      modelObj.permission = require(permissionPath);
    }

    if (fs.existsSync(pdfPath)) {
      modelObj.pdf = require(pdfPath);
    }

    if (fs.existsSync(searchPath)) {
      modelObj.search = require(searchPath);
    }

    return modelObj;
  } catch (e) {
    console.log(e);
    return {};
  }
}

module.exports = getModel;
