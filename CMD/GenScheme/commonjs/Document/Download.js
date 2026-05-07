const miniO = require("./../Utils/MiniO");

function sanitizeBucketName(name = "") {
  return String(name)
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9.-]/g, "");
}

function extractBucketName(id = "") {
  if (typeof id !== "string") return "";

  // Must start with [bucket]
  const match = id.match(/^\[([^\]]+)\]/);

  if (!match || !match[1]) return "";

  return match[1];
}

async function Download(req, res, next) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      throw { custom: true, message: "Invalid or missing id" };
    }

    const rawBucketName = extractBucketName(id);

    if (!rawBucketName) {
      throw { custom: true, message: "Invalid file format" };
    }

    const bucketName = sanitizeBucketName(rawBucketName);

    const filePath = await miniO.download({
      bucketName,
      fileName: id,
    });

    return res.sendFile(filePath);
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = Download;
