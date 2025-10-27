// copyDirContents.js
const fs = require("fs").promises;
const path = require("path");

async function copyDirContents(fromDir, toDir) {
  try {
    await fs.mkdir(toDir, { recursive: true });
    const entries = await fs.readdir(fromDir, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(fromDir, entry.name);
      const destPath = path.join(toDir, entry.name);

      if (entry.isDirectory()) {
        await copyDirContents(srcPath, destPath); // recursive call
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }

    return true;
  } catch (e) {
    return null;
  }
}

module.exports = { copyDirContents };
