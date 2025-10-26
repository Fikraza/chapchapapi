const prisma = require("./../../Prisma");

const getModel = require("./../Utils/CLI/getModel");

const {
  rangeFilter,
  modelFilter,
  formatOrder,
} = require("./../Utils/Scheme/Filter");

async function List(req, res, next) {
  try {
    // code here

    const { model } = req.params;

    const query = req.query;

    const { page = 1, limit = 10, order = "id-desc" } = req.query;

    const modelDoc = getModel(model);

    const { include, permission } = modelDoc;

    const allowedMethods = Array.isArray(permission?.allowedMethods)
      ? permission?.allowedMethods
      : [];

    if (!allowedMethods?.includes("GET")) {
      throw { custom: true, message: "Model Get Forbiden ", status: 403 };
    }

    const where = {};

    const exclude = ["page", "limit", "order"];

    rangeFilter({ where, exclude, query });
    modelFilter({ where, exclude, query });

    const orderBy = formatOrder(order);
    const total = await prisma[model].count({ where });
    const pageNumber = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10;

    const pageCount = Math.ceil(total / pageLimit);

    const offset = pageNumber > 1 ? pageNumber * pageLimit - pageLimit : 0;

    const items = await prisma[model].findMany({
      where,
      include,
      orderBy,
      skip: offset,
      take: pageLimit,
    });

    return res.status(200).json({
      pagination: {
        total,
        limit,
        total_docs: items?.length,
        pages: pageCount,
        page: page,
        hasNextPage: pageCount > pageNumber,
        hasPrevPage: pageCount >= pageNumber && pageNumber > 1,
      },
      docs: items,
      query: { where, orderBy },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = List;
