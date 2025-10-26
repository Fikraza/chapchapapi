const relaxDirPath = require("./relaxDirPath");
const path = require("path");
const fs = require("fs/promises");

async function cleanFileRelaxDirAsync(fileName) {
  try {
    if (!fileName || typeof fileName !== "string") {
      return null;
    }

    const filePath = path.join(relaxDirPath(), fileName);

    await fs.access(filePath); // Check if file exists
    await fs.unlink(filePath); // Delete file

    return true;
  } catch (e) {
    // console.error(`Unexpected error: ${e}`);
    return null;
  }
}

module.exports = cleanFileRelaxDirAsync;
