const getStructure = require("./../Utils/CLI/getStructure");

const GeneralFolder = require("./General");
const createScheme = require("./createScheme");
const { createItemFromPath } = require("./util");
const core = require("./core");

async function Postman(req, res, next) {
  try {
    // code here

    let generalItem = [];
    let coreItem = [];

    const collection = [
      {
        name: "General",
        item: generalItem,
      },
      { name: "Core", item: coreItem },
    ];

    const structure = getStructure();

    let structureKeys = Object.keys(structure);

    GeneralFolder(generalItem);

    for (let i = 0; i < structureKeys.length; i++) {
      const structureName = structureKeys[i];
      const structurePath = structure[structureName];
      let newPath = createItemFromPath({ item: coreItem, structurePath });
      core({ collection: newPath, model: structureName });
    }

    //return res.status(200).json(collection);
    await createScheme(collection);

    return res.status(200).json(collection);
  } catch (e) {
    console.log(e);
    console.log(e?.response?.data);
    next(e);
  }
}

module.exports = Postman;
