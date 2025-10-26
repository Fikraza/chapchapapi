const getModel = require("./../Utils/CLI/getModel");

const genBody = require("./../Utils/Scheme/genBody");

const TransForge = require("./../Utils/Scheme/TransForge");

const prisma = require("../../Prisma");

const {
  checkPermission,
  buildResponse,
  handleAfterPermission,
  handleBeforePermission,
} = require("./utils");

async function Create(req, res, next) {
  try {
    const { model } = req.params;
    const body = req.body;

    const modelDoc = getModel(model);
    const { field, permission } = modelDoc;
    if (!field)
      throw {
        custom: true,
        message: "Model not supported for Scheme",
        status: 500,
      };

    await checkPermission(modelDoc, "POST");
    const beforePermissionResponse = await handleBeforePermission({
      req,
      permission,
    });
    const data = genBody({ body, field });
    await TransForge({
      field,
      model,
      body: data,
      req,
      excludeInValidation: ["id"],
    });

    const doc = await prisma[model].create({ data });

    const afterPermissionResponse = await handleAfterPermission({
      req,
      data,
      permission,
    });

    const response = buildResponse({
      _message: "Created successfully",
      data: doc,
      beforeRes: beforePermissionResponse,
      afterRes: afterPermissionResponse,
    });
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = Create;
