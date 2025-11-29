const prisma = require("./../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
} = require("./../Crud/utils/permissionChecker");

const { pruneBodyByFields } = require("./../Crud/utils/helpers");

const transForge = require("./../Crud/utils/transForge");

async function Upsert(req, res, next) {
  try {
    //bucket-
    const { model } = req.params;
    let allfiles = req?.allfiles;

    let originalBody = req?.body;

    const id = originalBody?.id;

    if (typeof allfiles !== "object" || allfiles == null) {
      throw { custom: true, message: "Files missing" };
    }

    const body = { ...allfiles, ...originalBody };
    if (id) {
      delete body.id;
    }

    const modelObj = getModel({ model });

    if (!modelObj) {
      throw { custom: true, message: "Model not supported for create" };
    }

    const field = modelObj?.field;

    if (!field) {
      throw {
        custom: true,
        message: `For model ${model} fields not found`,
        status: 500,
      };
    }

    const permission = modelObj?.permission;

    const permisionConfig = permission?.Config;

    ifmethodNotAllowedThrowError({ permisionConfig, method: "PUT" });
    pruneBodyByFields({ body, field, pruneSkipUpdate: id ? true : false });
    let responseObject = { _message: id ? "Record updated" : "Record created" };

    await transForge({
      fields: field,
      req,
      body,
      skipUndefined: id ? true : false,
    });

    await beforeRequestPermissionCheck({
      req,
      body,
      beforeReqFunction: permission?.Update?.beforeUpdate,
      responseObject,
    });

    let record = null;

    if (!id) {
      record = await prisma[model].create({
        data: body,
      });
    } else {
      const recordExist = await prisma[model].findUnique({
        where: { id },
      });

      if (!recordExist) {
        throw {
          custom: true,
          message: `Record with id ${id} not found in model ${model}`,
        };
      }

      record = await prisma[model].update({
        where: {
          id,
        },
        data: body,
      });
    }

    await afterRequestPermissionCheck({
      req,
      record,
      afterReqFunction: permission?.Update?.afterUpdate,
      responseObject,
    });

    responseObject = { ...responseObject, ...record };

    // code here
    return res.status(200).json(responseObject);
  } catch (e) {
    console.log(e);
    console.log("error in upser");
    next(e);
  }
}

module.exports = Upsert;
