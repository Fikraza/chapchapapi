const prisma = require("../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
} = require("../Crud/utils/permissionChecker");

async function MultiModel(req, res, next) {
  try {
    // code here
    const { models } = req?.query;

    if (!models) {
      throw {
        custom: true,
        message: "for multi model lisiting models query parameter required",
      };
    }

    const modelArray = models
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s+/g, "")
      ?.split(",");

    let responseObject = {};
    const doc = {};

    const transaction = await prisma.$transaction(
      async (tx) => {
        for (let i = 0; i < modelArray.length; i++) {
          let modelName = modelArray[i];
          console.log("modelName is ", modelName);
          const modelObj = getModel({ model: modelName });

          if (!modelObj) {
            throw { custom: true, message: "Model not supported for get" };
          }
          const include = modelObj?.include || {};
          const permission = modelObj?.permission;
          const permisionConfig = permission?.Config;
          // console.log("permisionConfig --> ", permisionConfig);
          ifmethodNotAllowedThrowError({ permisionConfig, method: "GET" });
          await beforeRequestPermissionCheck({
            req,
            beforeReqFunction: permission?.MultiModel?.beforeMultiModel,
            include,
            responseObject,
            fromMultiModel: true,
          });

          const data = await tx[modelName].findMany({
            include,
          });

          doc[modelName] = data;
          await afterRequestPermissionCheck({
            req,
            beforeReqFunction: permission?.MultiModel?.afterMultiModel,
            include,
            responseObject,
            fromMultiModel: true,
            record: data,
          });
        }
      },
      {
        timeout: 15000,
      }
    );

    return res.status(200).json({ ...responseObject, doc });
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = MultiModel;
