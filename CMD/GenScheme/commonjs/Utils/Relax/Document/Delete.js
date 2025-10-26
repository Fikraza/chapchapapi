const nano = require("./../Utils/nano");

async function deleteRecord(id) {
  try {
    if (!id) {
      throw { custom: true, message: "Id required" };
    }

    const db = await nano.use("documents");

    const record = await db.get(id);

    if (!record) return false;

    await db.destroy(record._id, record._rev);

    return true;
  } catch (e) {
    console.error("Relax:Failed to delet record");
    console.error(e);
    return false; // At least one operation failed
  }
}

module.exports = deleteRecord;
