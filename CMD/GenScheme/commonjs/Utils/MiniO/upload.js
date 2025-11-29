const fs = require("fs");
const minioClient = require("./client");

async function uploadFile({ filePath, bucketName, saveAsName }) {
  try {
    console.log(filePath);

    // Check file exists
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return null;
    }

    /** ------------------------------
     *  CREATE BUCKET IF NOT EXISTS
     * ------------------------------ */
    const bucketExists = await minioClient.bucketExists(bucketName);

    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' does not exist. Creating...`);
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`Bucket '${bucketName}' created successfully.`);
    }

    // Upload file
    const fileStream = fs.createReadStream(filePath);
    const fileStat = fs.statSync(filePath);

    await minioClient.putObject(
      bucketName,
      saveAsName,
      fileStream,
      fileStat.size
    );

    return {
      bucket: bucketName,
      name: saveAsName,
      size: fileStat.size,
      path: filePath,
    };
  } catch (error) {
    console.error("Upload failed:", error.message);
    return false;
  }
}

module.exports = uploadFile;
