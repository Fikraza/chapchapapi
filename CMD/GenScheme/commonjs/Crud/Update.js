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

async function Update(req, res, next) {
  try {
    const { model } = req.params;
    const body = req.body;

    const id = body?.id;

    if (id) {
      delete body.id;
    }

    const modelObj = getModel({ model });

    if (!modelObj) {
      throw { custom: true, message: "Model not supported for update" };
    }

    const field = modelObj?.field;

    const permission = modelObj?.permission;

    const permisionConfig = permission?.Config;

    ifmethodNotAllowedThrowError({ permisionConfig, method: "PUT" });
    pruneBodyByFields({ body, field, pruneSkipUpdate: id ? true : false });

    let responseObject = { _message: id ? "Record updated" : "Record created" };

    // console.log(permission?.Create?.beforeTransForge);

    const transaction = await prisma.$transaction(
      async (tx) => {
        await beforeTransforgeCheck({
          req,
          body,
          beforeTransForgeFunction: permission?.Update?.beforeTransForge,
          responseObject,
          tx,
        });
        await transForge({
          fields: field,
          req,
          body,
          skipUndefined: id ? true : false,
          model,
          tx,
        });

        await beforeRequestPermissionCheck({
          req,
          body,
          beforeReqFunction: permission?.Update?.beforeUpdate,
          responseObject,
          tx,
        });

        let record = null;

        if (!id) {
          record = await tx[model].create({
            data: body,
          });
        } else {
          const recordExist = await tx[model].findUnique({
            where: { id },
          });

          if (!recordExist) {
            throw {
              custom: true,
              message: `Record with id ${id} not found in model ${model}`,
            };
          }

          record = await tx[model].update({
            where: {
              id,
            },
            data: body,
          });
        }

        responseObject = { ...responseObject, ...record };
        await afterRequestPermissionCheck({
          req,
          tx,
          record,
          afterReqFunction: permission?.Update?.afterUpdate,
          responseObject,
        });
      },
      { timeout: 40000 },
    );

    return res.status(200).json(responseObject);
  } catch (e) {
    next(e);
  }
}

module.exports = Update;
