const fs = require("fs");
const process = require("process");
const path = require("path");

function getStructure() {
  try {
    const rootDir = process.cwd();
    // console.log(rootDir);
    const structurePath = path.join(rootDir, "chapchapapi/structure.json");
    if (!fs.existsSync(structurePath)) {
      throw { custom: true, message: "Failed to get structyre", status: 500 };
    }
    const jsonContent = fs.readFileSync(structurePath, "utf-8");

    let config = JSON.parse(jsonContent);

    return config;
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = getStructure;
