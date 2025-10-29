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

async function createDirsRecursively(targetPath) {
  try {
    // Get only the directory part (strip the file name)
    const dirPath = path.extname(targetPath)
      ? path.dirname(targetPath)
      : targetPath;

    await fs.mkdir(dirPath, { recursive: true });
    return dirPath;
  } catch (err) {
    console.error("Error creating directories:", err);
    return null;
  }
}

function getFilenameAndParent(filePath) {
  const filename = path.basename(filePath);
  const dir = path.dirname(filePath);
  const parent = path.basename(dir);
  return { filename, parent };
}

async function copyFileRecursive({ fromFilePath, toFilePath }) {
  try {
    // Ensure destination directory exists
    const dir = path.dirname(toFilePath);
    await fs.mkdir(dir, { recursive: true });

    // Copy the file
    await fs.copyFile(fromFilePath, toFilePath);

    return true;
  } catch (err) {
    // console.error(`❌ Failed to copy file: ${err.message}`);
    return null;
  }
}

module.exports = {
  copyDirContents,
  createDirsRecursively,
  getFilenameAndParent,
  copyFileRecursive,
};
