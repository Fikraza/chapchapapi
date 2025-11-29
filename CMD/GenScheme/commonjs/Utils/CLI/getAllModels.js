const getModel = require("./getModel");
const getStructure = require("./getStructure");

function getAllModels() {
  try {
    const models = {};

    const structure = getStructure();

    if (typeof structure !== "object" || structure == null) {
      throw "Failed to get structure";
    }

    const structureKeys = Object.keys(structure);
    for (let i = 0; i < structureKeys.length; i++) {
      let modelName = structureKeys[i];
      let model = getModel({ model: modelName });

      models[modelName] = model;
    }

    return models;
  } catch (e) {
    //console.log(e);
    return {};
  }
}

module.exports = getAllModels;
