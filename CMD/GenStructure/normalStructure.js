const { getPrismaModels } = require("./../../UTILS/prisma");
const path = require("path");

async function normalStructure() {
  try {
    // code here
    const models = await getPrismaModels();

    if (!models) {
      return null;
    }

    const modelKeys = Object.keys(models).sort();

    let structure = modelKeys.reduce((accumulator, currentValue) => {
      accumulator[currentValue] = currentValue;
      return accumulator;
    }, {});

    return structure;
  } catch (e) {
    return null;
  }
}

module.exports = normalStructure;
