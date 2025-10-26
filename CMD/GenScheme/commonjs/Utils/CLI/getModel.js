const getConfig = require("./getConfig");
const structureArray = require("./structureArray");

const path = require("path");

const fs = require("fs");
const process = require("process");

function getModel(model) {
  try {
    const rootDir = process.cwd();

    if (!model || typeof model !== "string") {
      return null;
    }

    let config = getConfig();

    let base = config.base;

    if (!base) {
      throw {};
    }

    let modeDoc = {};
    let finalPath = "member";

    if (config?.structure) {
      const arrSt = structureArray(config?.structure);

      for (let el of arrSt) {
        let lastEl = el[el?.length - 1];

        if (lastEl === model?.toLowerCase()) {
          finalPath = path.join(...el);
          break;
        }
      }
    }

    let fullPath = path.join(
      rootDir,
      config.base,
      "Controller/Scheme/Models",
      finalPath
    );

    let fieldPath = path.join(fullPath, "field.json");
    let includePath = path.join(fullPath, "include.json");
    let permission = path.join(fullPath, "permission.js");
    let csv = path.join(fullPath, "csv.js");
    let search = path?.join(fullPath, "search.json");
    let pdf = path?.join(fullPath, "pdf.js");

    if (fs.existsSync(fieldPath)) {
      const jsonContent = fs.readFileSync(fieldPath, "utf-8");
      modeDoc.field = JSON.parse(jsonContent);
    }

    if (fs.existsSync(includePath)) {
      const jsonContent = fs.readFileSync(includePath, "utf-8");
      modeDoc.include = JSON.parse(jsonContent);
    }

    if (fs.existsSync(permission)) {
      const mod = require(permission);
      modeDoc.permission = mod;
    }

    if (fs.existsSync(csv)) {
      const mod = require(csv);
      modeDoc.csv = mod;
    }

    if (fs.existsSync(search)) {
      const jsonContent = fs.readFileSync(search, "utf-8");
      modeDoc.search = JSON.parse(jsonContent);
    }

    if (fs.existsSync(pdf)) {
      const mod = require(pdf);
      modeDoc.pdf = mod;
    }

    return modeDoc;
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = getModel;
