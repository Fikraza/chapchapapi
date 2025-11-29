const multer = require("multer");
const process = require("process");
const path = require("path");
const fs = require("fs");

const multerDirPath = () => {
  const rootDir = process.cwd();
  let multerPath = path.join(rootDir, "Temp/Multer");
  return multerPath;
};

// Define Multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const relax_path = multerDirPath();
      cb(null, relax_path);
    } catch (error) {
      cb(error);
    }
  },

  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname); // .pdf, .jpg etc
    const baseName = path.basename(file.originalname, fileExt); // filename without extension

    // Clean filename: replace spaces, remove unsafe characters
    const safeBaseName = baseName
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-.]/g, "");

    const fileName = `${safeBaseName}_${Date.now()}${fileExt}`;
    cb(null, fileName);
  },
});

// Initialize Multer (accepts any field but only processes files)
const upload = multer({ storage }).any();

async function MulterMultiFiles(req, res, next) {
  try {
    upload(req, res, function (err) {
      if (err) {
        return next(err);
      }

      // If no files uploaded
      if (!req.files || req.files.length === 0) {
        req.allfiles = null;
      } else {
        req.allfiles = req.files.reduce((acc, file) => {
          acc[file.fieldname] = file.filename;
          return acc;
        }, {});
      }

      next();
    });
  } catch (e) {
    next(e);
  }
}

module.exports = MulterMultiFiles;
