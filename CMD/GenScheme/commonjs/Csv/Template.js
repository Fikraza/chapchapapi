const prisma = require("../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
} = require("../Crud/utils/permissionChecker");

const QueryFilter = require("../Utils/QueryFilter");
const handleOrderQuery = require("./../Utils/General/handleOrderQuery");

const fs = require("fs");
const path = require("path");
const process = require("process");

const { getNestedValueFromObj, escapeCsvValue } = require("./../Utils/General");

async function CsvTemplate(req, res, next) {
  const { model } = req.params;

  const rootDir = process.cwd();
  const fileName = `gen-${model || "-"}-${Date.now()}.csv`;
  const fileDir = path.join(rootDir, "Temp/Generated");

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }

  const filePath = path.join(fileDir, fileName);

  try {
    // code here
    const modelObj = getModel({ model });
    if (!modelObj) {
      throw { custom: true, message: "Model not supported for get" };
    }

    const permission = modelObj?.permission;

    const csvTemplate = modelObj?.csv?.Template;

    if (!csvTemplate) {
      throw {
        custom: true,
        message: `Csv template not supported for ${model}`,
      };
    }

    let csvTemplateHeader = csvTemplate?.templateHeadArray;

    if (!Array.isArray(csvTemplateHeader)) {
      throw {
        custom: true,
        _message: "Csv template header must be an array",
        status: 500,
      };
    }

    const headString = csvTemplateHeader
      .map((head) => escapeCsvValue(head))
      ?.join(",");

    const fileStream = fs.createWriteStream(filePath);
    await new Promise((resolve, reject) => {
      fileStream.write(headString + "\n", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      fileStream.end((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Send file and delete after sending
    return res.sendFile(filePath, (err) => {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting temporary CSV file:", unlinkErr);
      });
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error sending file");
      }
    });
  } catch (e) {
    next(e);
  }
}

module.exports = CsvTemplate;
