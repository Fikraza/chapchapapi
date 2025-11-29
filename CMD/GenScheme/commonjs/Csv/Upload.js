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

const {
  getNestedValueFromObj,
  escapeCsvValue,
  csvToJson,
} = require("./../Utils/General");

const { pruneBodyByFields } = require("./../Crud/utils/helpers");

const transForge = require("./../Crud/utils/transForge");

async function Upload(req, res, next) {
  const rootDir = process.cwd();

  const filename = req.fileName;

  const filePath = path.join(rootDir, "/Temp/Multer", filename);
  try {
    // code here
    if (!filename || !fs.existsSync(filePath)) {
      throw { custom: true, message: "file Not found" };
    }
    const extension = path.extname(filePath);

    if (extension !== ".csv") {
      throw {
        custom: true,
        message: "Csv files are the only files supported for data upload",
      };
    }
    const { model } = req.params;

    const modelObj = getModel({ model });

    if (!modelObj) {
      throw { custom: true, message: "Model not supported for get" };
    }

    const field = modelObj?.field;

    if (!field) {
      throw {
        custom: true,
        message: `Field information missing for model ${model}`,
        status: 500,
      };
    }

    const permission = modelObj?.permission;
    const permisionConfig = permission?.Config;

    const csvUpload = modelObj?.csv?.Upload;

    ifmethodNotAllowedThrowError({ permisionConfig, method: "PUT" });

    if (!csvUpload) {
      throw {
        custom: true,
        _message: `Csv upload not supported for this model ${model}`,
      };
    }

    let csvItems = await csvToJson(filePath);

    if (!csvItems) {
      throw {
        custom: true,
        message: "Failed to convert csv file into json format",
        status: 500,
      };
    }

    await beforeRequestPermissionCheck({
      req,
      csvItems,
      beforeReqFunction: csvUpload?.beforeCsvUpload,
    });

    const upsertRecordFunction = csvUpload?.upsertRecord;

    if (typeof upsertRecordFunction !== "function") {
      throw {
        custom: true,
        message: `Callback function for single record upsert upsertRecord`,
        status: 500,
      };
    }

    let created = 0;
    let updated = 0;

    for (let i = 0; i < csvItems.length; i++) {
      const csvRecord = csvItems[i];
      const id = csvRecord.id;

      // console.log("id is", id);

      delete csvRecord.id;
      // console.log(csvRecord);

      pruneBodyByFields({
        body: csvRecord,
        field,
        pruneSkipUpdate: id ? true : false,
      });
      await transForge({
        fields: field,
        req,
        body: csvRecord,
        skipUndefined: id ? true : false,
        model,
      });

      await upsertRecordFunction({ record: csvRecord, index: i, req });

      if (id) {
        // console.log("doing an update");
        const recordExist = await prisma[model].findUnique({
          where: { id },
        });
        if (!recordExist) {
          throw {
            custom: true,
            message: `Record with id ${id} not found in model ${model}`,
          };
        }
        await prisma[model].update({
          where: {
            id,
          },
          data: csvRecord,
        });
        updated++;
        continue;
      }

      await prisma[model].create({
        data: csvRecord,
      });
      created++;
      continue;
    }

    await afterRequestPermissionCheck({
      req,
      csvItems,
      created,
      updated,
      afterReqFunction: csvUpload?.afterCsvUpload,
    });

    return res
      .status(200)
      .json({ _message: `Updated records ${updated} Created ${created}` });
  } catch (e) {
    //console.log(e);
    next(e);
  }
}

module.exports = Upload;
