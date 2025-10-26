const prisma = require("../../Prisma");

const RelaxUpsert = require("./../Utils/Relax/Document/Edit");

const getModel = require("./../Utils/CLI/getModel");

const UpdateModel = require("./../Crud/Update");

const path = require("path");

const fs = require("fs");

const process = require("process");
const { setTimeout } = require("timers/promises");

async function Upsert(req, res, next) {
  try {
    // code here
    const allfiles = req?.allfiles;

    const { model } = req.params;
    const id = req?.body?.id;

    if (!allfiles) {
      throw { custom: true, message: "Files not found" };
    }
    const modelDoc = getModel(model);

    const { field, permission } = modelDoc;

    if (!field) {
      throw {
        custom: true,
        message: "Model not supported for Scheme",
        status: 500,
      };
    }

    const allowedMethods = Array.isArray(permission?.allowedMethods)
      ? permission?.allowedMethods
      : [];

    if (!allowedMethods?.includes("PUT")) {
      throw { custom: true, message: "Model Update Forbiden ", status: 403 };
    }

    const data = {};

    let record = null;

    if (id) {
      record = await prisma[model].findUnique({
        where: {
          id,
        },
      });

      if (!record) {
        throw { custom: true, message: `${model} wikth id not found` };
      }
    }

    for (let key of Object.keys(allfiles)) {
      let toDelete = null;
      if (record && record[key]) {
        toDelete = record[key];
      }

      const relaxFile = await RelaxUpsert({
        filename: allfiles[key],
        id: toDelete,
      });

      if (!relaxFile.id) {
        throw {
          custom: true,
          message: `Failed to upload file ${key} try again`,
        };
      }

      data[key?.toString()?.toLowerCase()] = relaxFile.id;
    }

    const body = { ...req.body, ...data };

    req.body = body;
    UpdateModel(req, res);
  } catch (e) {
    next(e);
  } finally {
    const allfiles = req?.allfiles;

    if (typeof allfiles !== "object") {
      return;
    }

    for (let key of Object.keys(allfiles)) {
      const filename = allfiles[key];

      const rootDir = process.cwd();

      const filePath = path.join(rootDir, "Temp/Multer", filename);
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    }
  }
}

module.exports = Upsert;
