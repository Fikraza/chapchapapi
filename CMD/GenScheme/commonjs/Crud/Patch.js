const prisma = require("./../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
} = require("./utils/permissionChecker");

const { pruneBodyByFields } = require("./utils/helpers");

const transForge = require("./utils/transForge");

async function Patch(req, res, next) {
  try {
    const { model } = req.params;
    const body = req.body;

    const originalBody = { ...body };

    const id = body?.id;

    if (!id) {
      throw { custom: true, message: "Id required for patching" };
    }

    req.record_id = id;
    delete body.id;

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

    //skipUpdate
    //pruneSkipUpdate

    ifmethodNotAllowedThrowError({ permisionConfig, method: "PATCH" });
    pruneBodyByFields({ body, field, pruneSkipUpdate: true });

    let responseObject = { _message: "Record updated" };

    //return res.status(200).json({ body });

    let record = null;

    const transaction = await prisma.$transaction(
      async (tx) => {
        await transForge({
          fields: field,
          req,
          tx,
          body,
          skipUndefined: true,
          originalBody,
        });
        await beforeRequestPermissionCheck({
          req,
          body,
          originalBody,
          tx,
          beforeReqFunction: permission?.Patch?.beforePatch,
          responseObject,
        });

        const recordExists = await tx[model].findUnique({
          where: {
            id,
          },
        });

        if (!recordExists) {
          throw { custom: true, message: "Record to update does not exist" };
        }

        record = await prisma[model].update({
          where: {
            id,
          },
          data: body,
        });
        responseObject = { ...responseObject, ...record };
        await afterRequestPermissionCheck({
          tx,
          req,
          record,
          afterReqFunction: permission?.Patch?.afterPatch,
          responseObject,
          originalBody,
        });
      },
      { timeout: 40000 },
    );

    return res.status(200).json({ responseObject, body });
  } catch (e) {
    next(e);
  }
}

module.exports = Patch;
