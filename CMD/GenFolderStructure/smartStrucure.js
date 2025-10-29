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

    let sortedKeys = modelKeys.sort();
    let sortedStructure = sortedKeys.reduce((accumulator, currentValue) => {
      accumulator[currentValue] = structure[currentValue];

      return accumulator;
    }, {});

    // nested path are better
    for (let i = 0; i < sortedKeys.length; i++) {
      let key1 = sortedKeys[i];
      let path1 = structure[key1];
      let pathArray1 = path1.split("/");
      if (pathArray1?.length === 1) {
        for (let k = 0; k < sortedKeys.length; k++) {
          let key2 = sortedKeys[k];
          let path2 = structure[key2];
          let pathArray2 = path2.split("/");
          if (pathArray2?.length === 1) {
            continue;
          }
          if (pathArray1[0] === pathArray2[0]) {
            sortedStructure[key1] = `${pathArray1[0]}/${pathArray1[0]}`;
            break;
          }
        }
      }
    }

    return sortedStructure;
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = SmartStructure;
