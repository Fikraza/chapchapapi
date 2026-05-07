const prisma = require("../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
  beforeTransforgeCheck,
} = require("../Crud/utils/permissionChecker");

const fs = require("fs");
const path = require("path");
const process = require("process");

const { csvToJson } = require("./../Utils/General");

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
      throw { custom: true, message: "Model not supported for upsert" };
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

    const csvUpload = modelObj?.csv?.UploadTx;

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

    let created = 0;
    let updated = 0;

    const transaction = await prisma.$transaction(
      async (tx) => {
        await beforeRequestPermissionCheck({
          tx,
          req,
          csvItems,
          beforeReqFunction: csvUpload?.beforeCsvUpload,
        });

        const upsertRecordFunction = csvUpload?.upsertRecord;
        const beforeTransForge = csvUpload?.beforeTransForge;

        if (typeof upsertRecordFunction !== "function") {
          throw {
            custom: true,
            message: `Callback function for single record upsert upsertRecord`,
            status: 500,
          };
        }

        for (let i = 0; i < csvItems.length; i++) {
          const csvRecord = csvItems[i];
          const originalCsvRecord = csvItems[i];
          const id = csvRecord.id;

          // console.log("id is", id);

          delete csvRecord.id;
          // console.log(csvRecord);

          pruneBodyByFields({
            body: csvRecord,
            field,
            pruneSkipUpdate: id ? true : false,
          });

          if (typeof beforeTransForge === "function") {
            await beforeTransForge({
              csvRecord,
              originalCsvRecord,
              tx,
              req,
              index: i,
              id,
            });
          }

          await transForge({
            fields: field,
            req,
            body: csvRecord,
            skipUndefined: id ? true : false,
            model,
          });

          let shouldUpsertRecord = await upsertRecordFunction({
            record: csvRecord,
            originalCsvRecord,
            index: i,
            req,
            tx,
          });

          if (shouldUpsertRecord === false) {
            continue;
          }

          if (id) {
            // console.log("doing an update");
            const recordExist = await tx[model].findUnique({
              where: { id },
            });
            if (!recordExist) {
              throw {
                custom: true,
                message: `Record with id ${id} not found in model ${model}`,
              };
            }
            await tx[model].update({
              where: {
                id,
              },
              data: csvRecord,
            });
            updated++;
            continue;
          }

          await tx[model].create({
            data: csvRecord,
          });
          created++;
          continue;
        }

        await afterRequestPermissionCheck({
          tx,
          req,
          csvItems,
          created,
          updated,
          afterReqFunction: csvUpload?.afterCsvUpload,
        });
      },
      { timeout: 40000 },
    );

    return res
      .status(200)
      .json({ _message: `Updated records ${updated} Created ${created}` });
  } catch (e) {
    //console.log(e);
    next(e);
  }
}

module.exports = Upload;
