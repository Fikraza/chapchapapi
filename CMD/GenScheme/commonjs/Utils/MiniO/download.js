const minioClient = require("./client");
const fs = require("fs/promises");
const path = require("path");
const process = require("process");

async function downloadFile({ bucketName, fileName }) {
  try {
    const cwd = process.cwd();

    // Folder to save file
    const saveFolder = path.join(cwd, "Temp", "Minio");

    // Create folder if not exists
    await fs.mkdir(saveFolder, { recursive: true });

    // Extract name + extension
    const ext = path.extname(fileName); // .pdf
    const base = path.basename(fileName, ext); // sample

    // Add timestamp to avoid overwrite
    const timestamp = Date.now(); // 1732612345678
    const uniqueName = `${base}_${timestamp}${ext}`;

    // Full path to save the downloaded file
    const savePath = path.join(saveFolder, uniqueName);

    // Download file from MinIO
    const fileStream = await minioClient.getObject(bucketName, fileName);

    // Write to local file
    const writeStream = require("fs").createWriteStream(savePath);

    // Pipe MinIO stream into file
    await new Promise((resolve, reject) => {
      fileStream.pipe(writeStream).on("finish", resolve).on("error", reject);
    });

    return savePath; // return unique local file path
  } catch (e) {
    console.error("Download failed:", e.message);
    return false;
  }
}

module.exports = downloadFile;
