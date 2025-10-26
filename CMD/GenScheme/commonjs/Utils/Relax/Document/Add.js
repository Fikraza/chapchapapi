const mime = require("mime-types");

const path = require("path");

const fs = require("fs");

const process = require("process");

const createDB = require("./../Utils/createDb");

const nano = require("./../Utils/nano");

async function AddDocument({ filename }) {
  try {
    // code here

    if (!filename || typeof filename !== "string") {
      throw { message: `Filename required should be  a string` };
    }

    const rootDir = process.cwd();

    const filePath = path.join(rootDir, "Temp/Multer", filename);

    if (!fs.existsSync(filePath)) {
      throw { message: `File not saved in path ${filePath}` };
    }

    const dbCreated = await createDB({ dbName: "documents" });

    const documents = await nano.use("documents");

    const data = fs.readFileSync(filePath);

    const content_type =
      mime.contentType(filename) || "application/octet-stream";

    const insertedAttachement = await documents.attachment.insert(
      filename,
      filename,
      data,
      content_type
    );

    return insertedAttachement;
  } catch (e) {
    console.error("Failed to add File");
    console.log(e);
    return null;
  }
}

module.exports = AddDocument;
