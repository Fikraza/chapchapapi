const readDocument = require("./../Utils/Relax/Document/Read");

async function Read(req, res, next) {
  try {
    // code here
    const { id } = req.query;

    if (!id) {
      throw { custom: true, message: "Document id required" };
    }

    const { doc, content_type } = await readDocument(id);

    res.set("Content-Type", content_type);
    res.set("Content-Disposition", `attachment; filename="${id}"`);

    return res.send(doc);
  } catch (e) {
    next(e);
  }
}

module.exports = Read;
