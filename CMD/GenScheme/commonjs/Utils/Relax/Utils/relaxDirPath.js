const process = require("process");

const path = require("path");

const fs = require("fs");

async function relaxDirPath() {
  try {
    const rootDir = process.cwd();

    let relaxPath = path.join(rootDir, "Temp/Relax");

    if (!fs.existsSync(relaxPath)) {
      fs.mkdirSync(relaxPath, { recursive: true });
    }

    return relaxPath;
  } catch (e) {
    console.warn("Failed to create a relaxDirPath");
    return null;
  }
}

module.exports = relaxDirPath;
