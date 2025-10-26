const nano = require("./../Utils/nano");

async function readDocument(id) {
  try {
    const db = await nano.use("documents");

    const record = await db.get(id);

    if (!record) return false;

    const doc = await db.attachment.get(record._id, record._id);

    const content_type = record._attachments[id].content_type;

    return { doc, content_type };
  } catch (e) {
    return false;
  }
}

module.exports = readDocument;
