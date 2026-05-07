const prisma = require("./../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  beforeTransforgeCheck,
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

    //update chap chap api
    if ("id" in body) {
      delete body.id;
    }
    //console.log("Body is", body);
    ifmethodNotAllowedThrowError({ permisionConfig, method: "GET" });
    pruneBodyByFields({ body, field });

    //return res.status(200).json({ body });
    let responseObject = { _message: "Record created" };
    const transaction = await prisma.$transaction(
      async (tx) => {
        await beforeTransforgeCheck({
          req,
          body,
          tx,
          beforeTransForgeFunction: permission?.Create?.beforeTransForge,
          responseObject,
        });
        await transForge({ fields: field, req, body, model });

        await beforeRequestPermissionCheck({
          req,
          body,
          tx,
          beforeReqFunction: permission?.Create?.beforeCreate,
          responseObject,
        });

        const record = await tx[model].create({
          data: body,
        });

        responseObject = { ...responseObject, ...record };

        await afterRequestPermissionCheck({
          req,
          record,
          tx,
          afterReqFunction: permission?.Create?.afterCreate,
          responseObject,
        });
      },
      { timeout: 40000 },
    );

    return res.status(200).json(responseObject);
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = Create;
