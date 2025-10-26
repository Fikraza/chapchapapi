const prisma = require("../../Prisma");

const getModel = require("./../Utils/CLI/getModel");

const {
  checkPermission,
  buildResponse,
  handleAfterPermission,
  handleBeforePermission,
} = require("./utils");

async function Delete(req, res, next) {
  try {
    // code here

    const { model } = req.params;
    const { id } = req.query;

    if (!id) {
      throw { custom: true, message: "Id required" };
    }

    const modelDoc = getModel(model);

    const { permission } = modelDoc;

    await checkPermission(modelDoc, "DELETE");

    const beforePermissionResponse = await handleBeforePermission({
      req,
      permission,
    });

    const transaction = await prisma.$transaction(async (tx) => {
      const record = await prisma[model].findUnique({
        where: { id },
      });

      if (!record) {
        throw { custom: true, message: "Record to delete not found" };
      }

      const deleteRecord = await prisma[model].delete({
        where: { id },
      });

      return deleteRecord;
    });

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
    next(e);
  }
}

module.exports = Delete;
