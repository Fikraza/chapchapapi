const relaxDirPath = require("./relaxDirPath");

const path = require("path");

const fs = require("fs");

function cleanFileRelaxDirSync(fileName) {
  try {
    if (!fileName || typeof fileName !== "string") {
      return null;
    }

    const filePath = path.join(relaxDirPath(), fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      return true;
    }

    return null;

    // code here
  } catch (e) {
    return null;
  }
}

module.exports = cleanFileRelaxDirSync;
