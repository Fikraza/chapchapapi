const prisma = require("./../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
} = require("./utils/permissionChecker");

async function Delete(req, res, next) {
  try {
    const { model } = req.params;
    const { id } = req.query;

    if (!id) {
      throw { custom: true, message: "Id required for delete operation" };
    }

    if (!model) {
      throw { custom: true, message: "Model required for delete", status: 500 };
    }

    const modelObj = getModel({ model });

    if (!modelObj) {
      throw {
        custom: true,
        message: "Model not supported for delete operation",
      };
    }

    const permission = modelObj?.permission;

    const permisionConfig = permission?.Config;

    ifmethodNotAllowedThrowError({ permisionConfig, method: "DELETE" });

    let responseObject = { _message: "Record deleted" };

    await beforeRequestPermissionCheck({
      req,
      beforeReqFunction: permisionConfig?.Delete?.beforeDelete,
      responseObject,
    });

    let record = null;

    const transaction = await prisma.$transaction(
      async (tx) => {
        const recordExists = await tx[model].findUnique({
          where: {
            id,
          },
        });

        if (!recordExists) {
          throw { custom: true, message: "Record to delete does not exist" };
        }

        record = await tx[model].delete({
          where: {
            id,
          },
        });
      },
      { timeout: 60000 }
    );

    responseObject = { ...responseObject, ...record };

    await afterRequestPermissionCheck({
      req,
      record,
      afterReqFunction: permission?.Delete?.afterDelete,
      responseObject,
    });

    return res.status(200).json(responseObject);
  } catch (e) {
    console.log("error", e);
    next(e);
  }
}

module.exports = Delete;
