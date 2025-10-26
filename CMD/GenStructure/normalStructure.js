const { getPrismaModels } = require("./../../UTILS/prisma");
const path = require("path");

async function normalStructure() {
  try {
    // code here
    const models = await getPrismaModels();

    if (!models) {
      return null;
    }
  } catch (e) {
    return null;
  }
}

module.exports = normalStructure;
