const process = require("process");
const path = require("path");
const miniO = require("./../../../../Utils/MiniO");
const fs = require("fs");

function sanitizeBucketName(name) {
  return name
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9.-]/g, "");
}

async function file(obj) {
  const { body, field, tweakObj, model } = obj;
  const cwd = process.cwd();

  if (!model) {
    throw {
      custom: true,
      message: "Model name required for saving files",
      status: 500,
    };
  }

  let filename = body[field];

  if (!filename) {
    //best fix
    return;
    throw { custom: true, message: `File required` };
  }

  let multerFilePath = path.join(cwd, "Temp/Multer", filename);

  if (!fs.existsSync(multerFilePath)) {
    console.log("File exists");
  }

  const bucketName = sanitizeBucketName(model);

  const ext = path.extname(filename);

  if (tweakObj?.mime) {
    if (ext !== tweakObj?.mime) {
      let mimeMessage =
        typeof tweakObj?._message === "string"
          ? tweakObj?._message
          : `Invalid file type`;
      throw {
        custom: true,
        _message: mimeMessage,
      };
    }
  }
  if (Array.isArray(tweakObj.mime)) {
    if (!tweakObj.mimes.includes(ext)) {
      let mimeMessage =
        typeof tweakObj?._message === "string"
          ? tweakObj?._message
          : `Invalid file type`;
      throw {
        custom: true,
        _message: mimeMessage,
      };
    }
  }

  let fileSavedAs = `[${model}]${filename}`;

  let miniObject = await miniO.upload({
    filePath: multerFilePath,
    bucketName,
    saveAsName: fileSavedAs,
  });
  console.log(miniObject);
  if (!miniObject) {
    throw {
      custom: true,
      _message: `File upload failed for ${filename}`,
    };
  }

  body[field] = fileSavedAs;
}

module.exports = file;
