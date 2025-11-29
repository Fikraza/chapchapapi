const process = require("process");
const path = require("path");
const miniO = require("./../../../../Utils/MiniO");
const fs = require("fs");

async function file(obj) {
  const { body, field, tweakObj } = obj;
  const cwd = process.cwd();
  console.log("body-->", body);
  console.log("field--->", field);
  console.log("tweakObject--->", tweakObj);

  let filename = body[field];
  console.log("filename is", filename);

  if (!filename) {
    throw { custom: true, message: `File required` };
  }

  let multerFilePath = path.join(cwd, "Temp/Multer", filename);

  if (!fs.existsSync(multerFilePath)) {
    console.log("File exists");
  }

  // throw { custom: true, message: "" };
  const fieldArray = field.split("_");

  const bucketName = fieldArray[0];

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

  let fileSavedAs = `${bucketName}_${filename}`;

  let miniObject = await miniO.upload({
    filePath: multerFilePath,
    bucketName,
    saveAsName: fileSavedAs,
  });
  if (!miniObject) {
    throw {
      custom: true,
      _message: `File upload failed for ${filename}`,
    };
  }

  body[field] = fileSavedAs;
}

module.exports = file;
