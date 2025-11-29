const prisma = require("./../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
} = require("./utils/permissionChecker");

const { pruneBodyByFields } = require("./utils/helpers");

const transForge = require("./utils/transForge");

async function Create(req, res, next) {
  try {
    const { model } = req.params;

    const body = req.body;

    if (!model) {
      throw { custom: true, message: "Model required for create", status: 500 };
    }

    const modelObj = getModel({ model });

    if (!modelObj) {
      throw { custom: true, message: "Model not supported for create" };
    }

    const field = modelObj?.field;

    const permission = modelObj?.permission;

    const permisionConfig = permission?.Config;

    if (typeof field !== "object") {
      throw { custom: true, message: "Field for model not found" };
    }

    if (body?.id) {
      delete body.id;
    }
    ifmethodNotAllowedThrowError({ permisionConfig, method: "GET" });
    pruneBodyByFields({ body, field });

    //return res.status(200).json({ body });

    let responseObject = { _message: "Record created" };

    await transForge({ fields: field, req, body, model });

    await beforeRequestPermissionCheck({
      req,
      body,
      beforeReqFunction: permission?.Create?.beforeCreate,
      responseObject,
    });

    const record = await prisma[model].create({
      data: body,
    });

    responseObject = { ...responseObject, ...record };

    await afterRequestPermissionCheck({
      req,
      record,
      afterReqFunction: permission?.Create?.afterCreate,
      responseObject,
    });

    return res.status(200).json(responseObject);
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = Create;
