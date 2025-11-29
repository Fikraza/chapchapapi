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

async function Generate(req, res, next) {
  const { model } = req.params;

  const rootDir = process.cwd();
  const fileName = `gen-${model || "-"}-${Date.now()}.csv`;
  const fileDir = path.join(rootDir, "Temp/Generated");

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }

  const filePath = path.join(fileDir, fileName);

  try {
    const query = req.query;
    let { page = 1, limit = 1000, order = null } = req.query;

    const modelObj = getModel({ model });
    if (!modelObj) {
      throw { custom: true, message: "Model not supported for get" };
    }

    const include = modelObj?.include || {};
    const permission = modelObj?.permission;
    const csvGenerate = modelObj?.csv?.Generate;

    if (!csvGenerate) {
      throw { custom: true, _message: `CSV not supported for model ${model}` };
    }

    const headerRow = csvGenerate?.head;
    const headData = csvGenerate?.data;

    if (!Array.isArray(headerRow)) {
      throw {
        custom: true,
        _message: `CSV head array required for model ${model}`,
      };
    }

    const permisionConfig = permission?.Config;
    const where = {};
    const ignoreInFilters = ["page", "limit", "order", "_meta_info"];

    ifmethodNotAllowedThrowError({ permisionConfig, method: "GET" });

    QueryFilter({ where, query, ignoreInFilters });
    const orderBy = {};
    handleOrderQuery({ orderBy, order });

    limit = parseInt(limit) || 500;
    let pageNumber = parseInt(page) || 1;

    await beforeRequestPermissionCheck({
      req,
      body: req.body,
      beforeReqFunction: csvGenerate?.beforeGenerate,
      query,
      where,
      ignoreInFilters,
      include,
      orderBy,
    });

    const fileStream = fs.createWriteStream(filePath);

    // Write header row
    const headerLine = headerRow
      .map((h) => escapeCsvValue(String(h)))
      .join(",");
    await new Promise((resolve, reject) => {
      fileStream.write(headerLine + "\n", (err) =>
        err ? reject(err) : resolve()
      );
    });

    // Write data rows in pages
    while (true) {
      const offset = (pageNumber - 1) * limit;

      console.log(pageNumber);

      const records = await prisma[model].findMany({
        where,
        include,
        orderBy,
        skip: offset,
        take: limit,
      });

      if (records.length === 0) break;

      for (let i = 0; i < records.length; i++) {
        let record = records[i];
        let lineStr = "";

        if (typeof headData === "function") {
          const lineArray = await headData({
            record,
            escapeCsvValue,
            index: i,
            pageNumber,
            include,
          });
          if (!Array.isArray(lineArray)) {
            throw {
              custom: true,
              _message: `Head Data function must return an array of strings for each record`,
              status: 500,
            };
          }
          lineStr = lineArray
            ?.map((line) => escapeCsvValue(String(line)))
            ?.join(",");
        }

        if (Array.isArray(headData)) {
          const lineArray = headData.map((current) => {
            const col = getNestedValueFromObj({
              obj: record,
              fieldPath: current,
            });
            return escapeCsvValue(col);
          });
          lineStr = lineArray.join(",");
        }

        if (!lineStr) {
          continue;
        }

        await new Promise((resolve, reject) => {
          fileStream.write(lineStr + "\n", (err) =>
            err ? reject(err) : resolve()
          );
        });
      }

      pageNumber += 1;
    }

    await new Promise((resolve, reject) => {
      fileStream.end((err) => (err ? reject(err) : resolve()));
    });

    await afterRequestPermissionCheck({
      req,
      body: req.body,
      beforeReqFunction: csvGenerate?.beforeGenerate,
      query,
      where,
      ignoreInFilters,
      include,
      orderBy,
      filePath,
      pageNumber,
      limit,
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

module.exports = Generate;
