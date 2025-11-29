const prisma = require("./../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
} = require("./utils/permissionChecker");

async function Read(req, res, next) {
  try {
    // code here
    const { model } = req.params;
    const { id } = req.query;

    if (!id) {
      throw { custom: true, message: "Id required for get by id" };
    }

    if (!model) {
      throw { custom: true, message: "Model required for create", status: 500 };
    }

    const modelObj = getModel({ model });
    if (!modelObj) {
      throw { custom: true, message: "Model not supported for create" };
    }

    const permission = modelObj?.permission;

    const permisionConfig = permission?.Config;

    ifmethodNotAllowedThrowError({ permisionConfig, method: "GET" });
    let responseObject = {};

    await beforeRequestPermissionCheck({
      req,
      beforeReqFunction: permission?.Read?.beforeRead,
      responseObject,
    });

    const record = await prisma[model].findUnique({
      where: {
        id,
      },
      include: modelObj?.include || {},
    });

    responseObject = { ...responseObject, ...record };

    await afterRequestPermissionCheck({
      req,
      record,
      afterReqFunction: permission?.Read?.afterRead,
      responseObject,
    });

    return res.status(200).json(responseObject);
  } catch (e) {
    next(e);
  }
}

module.exports = Read;
