const { getPrismaModels } = require("./../../UTILS/prisma");
const path = require("path");

async function SmartStructure() {
  try {
    // code here

    const models = await getPrismaModels();

    if (!models) {
      return null;
    }

    const modelKeys = Object.keys(models).sort((a, b) => b.length - a.length);

    // console.log(modelKeys);

    let structure = {};
    //console.log(modelKeys);

    for (let i = 0; i < modelKeys.length; i++) {
      const modelName = modelKeys[i];

      const main_path = [modelName];
      for (let k = i + 1; k < modelKeys.length; k++) {
        let modelName2 = modelKeys[k];

        if (modelName === modelName2) {
          continue;
        }

        if (modelName.startsWith(modelName2)) {
          main_path.push(modelName2);
        }
      }
      let arrayPath = main_path.sort((a, b) => a.length - b.length);

      structure[modelName] = path.join(...arrayPath);
    }

    return structure;
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = SmartStructure;
