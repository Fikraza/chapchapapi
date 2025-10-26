const getConfig = require("./getConfig");
const structureArray = require("./structureArray");

const path = require("path");

const fs = require("fs");
const process = require("process");

function getAllModels() {
  try {
    const rootDir = process.cwd();

    let config = getConfig();

    let base = config.base;

    const models = {};

    if (!base) {
      throw {};
    }

    if (!config.structure) {
      throw {};
    }

    const arrSt = structureArray(config?.structure);

    for (let el of arrSt) {
      let lastEl = el[el?.length - 1];

      let folderPath = path.join(...el);

      let fullPath = path.join(
        rootDir,
        config.base,
        "Controller/Scheme/Models",
        folderPath
      );
      models[lastEl] = {
        folderPath,
        fullPath,
      };

      let fieldPath = path.join(fullPath, "field.json");
      let includePath = path.join(fullPath, "include.json");
      let permission = path.join(fullPath, "permission.js");
      let csv = path.join(fullPath, "csv.js");
      let search = path?.join(fullPath, "search.json");
      let pdf = path?.join(fullPath, "pdf.js");

      if (fs.existsSync(fieldPath)) {
        const jsonContent = fs.readFileSync(fieldPath, "utf-8");
        models[lastEl].field = JSON.parse(jsonContent);
      }

      if (fs.existsSync(includePath)) {
        const jsonContent = fs.readFileSync(includePath, "utf-8");
        models[lastEl].include = JSON.parse(jsonContent);
      }

      if (fs.existsSync(permission)) {
        const mod = require(permission);
        models[lastEl].permission = mod;
      }

      if (fs.existsSync(csv)) {
        const mod = require(csv);
        models[lastEl].csv = mod;
      }

      if (fs.existsSync(search)) {
        const jsonContent = fs.readFileSync(search, "utf-8");
        models[lastEl].search = JSON.parse(jsonContent);
      }
      if (fs.existsSync(pdf)) {
        const mod = require(pdf);
        models[lastEl].pdf = mod;
      }
    }

    return models;
  } catch (e) {
    //console.log(e);
    return {};
  }
}

module.exports = getAllModels;
