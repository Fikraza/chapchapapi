const Add = require("./Add");

const DeleteDocument = require("./Delete");
const nano = require("./../Utils/nano");

async function Edit({ filename = "", id }) {
  try {
    if (!filename) {
      return false;
    }

    const db = await nano.use("documents");

    const added = await Add({ filename });

    if (!added) return false;

    if (id) {
      await DeleteDocument(id);
    }

    return added;
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = Edit;
