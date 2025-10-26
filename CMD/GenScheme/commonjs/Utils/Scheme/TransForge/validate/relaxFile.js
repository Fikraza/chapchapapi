const path = require("path");

function relaxFile({
  body = {},
  field = "",
  validationObj = {},
  capField = "",
}) {
  const val = body[field];

  if (typeof val !== "string" || !val.includes("relax-save")) {
    throw { custom: true, message: `${capField} must be a file` };
  }

  if (validationObj.mime) {
    let mime = validationObj.mime;
    if (typeof mime === "string") {
      mime = [mime];
    }

    if (!Array.isArray(mime)) {
      return;
    }

    const extension = path.extname(val)?.slice(1);

    if (!mime.includes(extension)) {
      const str = mime.join(",");
      throw {
        custom: true,
        message: `Invalid document type.Supported documents are ${str} for ${field}`,
      };
    }
  }

  return true; // Validation successful
}

module.exports = relaxFile;
