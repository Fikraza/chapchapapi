const prisma = require("./../../Prisma");
const getModel = require("./../Utils/CLI/getModel");

async function ListMultiModel(req, res, next) {
  try {
    // code here
    const { models } = req.query;

    if (!models) {
      throw { custom: true, message: "Models required" };
    }

    let modelsArr = models?.toLowerCase()?.split(",");

    const data = {};

    const transaction = await prisma.$transaction(
      async (tx) => {
        for (let i = 0; i < modelsArr?.length; i++) {
          let singleModel = modelsArr[i];
          let arr = singleModel?.split("-");

          // member id as
          const term1 = arr[0];
          const term2 = arr[1];
          const term3 = arr[2];

          let orderBy = { id: "asc" };

          if ((term2 && term3 === "asc") || (term2 && term3 === "desc")) {
            delete orderBy.id;
            orderBy[term2] = term3;
          }

          const modelDoc = getModel(term1);

          if (!modelDoc) {
            continue;
          }

          const { include, permission } = modelDoc;

          const allowedMethods = Array.isArray(permission?.allowedMethods)
            ? permission?.allowedMethods
            : [];

          if (!allowedMethods?.includes("GET")) {
            continue;
          }

          let docs = await tx[term1].findMany({
            include: include || {},
            orderBy,
          });

          data[term1] = docs;
        }
      },
      { timeout: 6000000 }
    );

    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

module.exports = ListMultiModel;
