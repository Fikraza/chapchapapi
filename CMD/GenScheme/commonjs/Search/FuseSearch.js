const prisma = require("./../../Prisma");

const getModel = require("./../Utils/CLI/getModel");

const { rangeFilter, modelFilter } = require("./../Utils/Scheme/Filter");

const Fuzzy = require("./../Utils/Scheme/Fuzzy");

async function FuseSearch(req, res, next) {
  try {
    // code here

    const { model } = req.params;

    const modelDoc = getModel(model);

    const { include, permission, search } = modelDoc;

    const query = req.query;

    const allowedMethods = Array.isArray(permission?.allowedMethods)
      ? permission?.allowedMethods
      : [];

    if (!allowedMethods?.includes("GET")) {
      throw {
        custom: true,
        message: "You dont have the correct permissions ",
        status: 403,
      };
    }

    const searchKeys = search?.fuzzy;

    if (!Array.isArray(searchKeys)) {
      throw {
        custom: true,
        message: "Fuzzy search on model is forbiden",
        status: 403,
      };
    }

    const searchTerm = req?.query?.search;
    const limit = parseInt(req?.query?.limit) || 9000;

    if (
      !searchTerm ||
      typeof searchTerm !== "string" ||
      searchTerm?.length < 3
    ) {
      return res.status(200).json({ docs: [], query: {} });
    }

    let pageNumber = 1;

    let docs = [];

    const where = {};

    const exclude = ["page", "limit", "order", "search"];

    rangeFilter({ where, exclude, query });
    modelFilter({ where, exclude, query });

    await prisma.$transaction(
      async (tx) => {
        while (true) {
          const pageLimit = parseInt(limit);
          const offset =
            pageNumber > 1 ? pageNumber * pageLimit - pageLimit : 0;

          const items = await tx[model].findMany({
            where: where,
            include,
            skip: offset,
            take: pageLimit,
          });

          if (items.length == 0) {
            break;
          }

          const searchResult = Fuzzy({
            search: searchTerm,
            items: items,
            keys: searchKeys,
          });

          if (searchResult.length > 0) {
            docs = [...docs, ...searchResult];
          }

          pageNumber++;
        }
      },
      { timeout: 6000000000000 }
    );

    const searchResult = Fuzzy({
      search: searchTerm,
      items: docs,
      keys: searchKeys,
    });

    return res.status(200).json({
      docs: searchResult,
      length: searchResult.length,
      pageNumber,
      query: { where },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = FuseSearch;
