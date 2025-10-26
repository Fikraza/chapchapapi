const fs = require("fs");

const path = require("path");

const process = require("process");

const prisma = require("../../Prisma");

const csv = require("csv-parser");

const getModel = require("./../Utils/CLI/getModel");

const TransForge = require("./../Utils/Scheme/TransForge");

const genBody = require("./../Utils/Scheme/genBody");

async function Upload(req, res, next) {
  const rootDir = process.cwd();

  const filename = req.fileName;

  const filePlusPath = path.join(rootDir, "/Temp/Multer", filename);

  try {
    // code here

    if (!filename || !fs.existsSync(filePlusPath)) {
      throw { custom: true, message: "file Not found" };
    }

    const extension = path.extname(filePlusPath);

    if (extension !== ".csv") {
      throw {
        custom: true,
        message: "Csv files are the only files supported for data upload",
      };
    }

    const { model } = req.params;

    const modelDoc = getModel(model);

    const { permission, field } = modelDoc;

    const allowedMethods = Array.isArray(permission?.allowedMethods)
      ? permission?.allowedMethods
      : [""];

    if (!allowedMethods?.includes("PUT")) {
      throw { custom: true, message: "Model permision ", status: 403 };
    }

    let docs = await readCSVToObject(filePlusPath);

    const date = new Date();
    const updated_at = date.toISOString();

    const transaction = await prisma.$transaction(
      async (tx) => {
        const createdRecords = [];
        const updatedRecords = [];

        for (let body of docs) {
          excludeInValidation = [];

          if (!body?.id) {
            const data = genBody({ body: body, field });
            await TransForge({
              field,
              model,
              body: data,
              req,
              excludeInValidation: ["id"],
            });

            const created = await tx[model].create({
              data: data,
            });
            createdRecords.push(created);
            continue;
          }

          let id = body?.id;

          const record = await tx[model].findUnique({
            where: {
              id,
            },
          });

          if (!record) {
            throw { custom: true, message: "Record with id doesn't  exist" };
          }

          let data = {};

          for (let key of Object.keys(body)) {
            if (key === "id") {
              continue;
            }
            let fieldVal = field[key];
            let bodyVal = body[key];
            let recordVal = record[key];
            if (fieldVal === undefined || bodyVal === undefined) {
              excludeInValidation.push(key);
              continue;
            }

            if (bodyVal === recordVal) {
              continue;
            }

            data[key] = bodyVal;
          }

          await TransForge({
            field,
            model,
            body: data,
            isPatch: true,
            excludeInValidation,
          });

          const updated = await prisma[model].update({
            where: {
              id,
            },
            data: { ...data, updated_at },
          });

          updatedRecords.push(updated);
        }

        return { updatedRecords, createdRecords };
      },
      { timeout: 6000000000 }
    );

    return res.status(200).json({ transaction });
  } catch (e) {
    next(e);
  } finally {
    fs.unlink(filePlusPath, (error) => {});
  }
}

// check in future to return what failed and how

function readCSVToObject(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => {
        resolve(results); // ✅ resolves with array of parsed objects
      })
      .on("error", (err) => {
        reject(err); // ✅ reject on read or parse error
      });
  });
}

module.exports = Upload;
