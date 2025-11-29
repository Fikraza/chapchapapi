const prisma = require("../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
} = require("../Crud/utils/permissionChecker");

const QueryFilter = require("../Utils/QueryFilter");

async function PgSearch(req, res, next) {
  try {
    // code here
    const { model } = req.params;
    const { search, limit = 10 } = req.query;

    const where = {};
    if (!parseInt(limit)) {
      throw { custom: true, message: "Limit must be number" };
    }

    if (!search) {
      throw { custom: true, message: "Search value required" };
    }
    if (search?.length < 3) {
      return res.status(200).json({ docs: [], where: {} });
    }
    const modelObj = getModel({ model });
    if (!modelObj) {
      throw { custom: true, message: "Model not supported for get" };
    }
    const include = modelObj?.include || {};
    const permission = modelObj?.permission;
    const permisionConfig = permission?.Config;
    ifmethodNotAllowedThrowError({ permisionConfig, method: "GET" });

    const pgSearch = modelObj?.search?.Pg;
    // console.log(pgSearch);

    if (!pgSearch) {
      throw {
        custom: true,
        message: `pgTrgm search not supported for model ${model}`,
      };
    }

    const pgTrgmFunction = pgSearch?.pgTrgm;

    if (typeof pgTrgmFunction !== "function") {
      throw {
        custom: true,
        message: `Pgtrgm function required for fuzzy search`,
      };
    }

    const { query, params } = await pgTrgmFunction({ search, limit });

    const searchResults = await prisma.$queryRawUnsafe(query, ...params);

    const ignoreInFilters = ["page", "limit", "order", "_meta_info", "search"];
    QueryFilter({ where, query, ignoreInFilters });

    await beforeRequestPermissionCheck({
      req,
      beforeReqFunction: searchResults?.beforeSearch,
      search,
      where,
      include,
      searchResults,
    });

    if (searchResults.length === 0) {
      return res.status(200).json({
        docs: [],
        where,
      });
    }

    let ids = searchResults.map((result) => result.id);

    let includedData = await prisma[model].findMany({
      where: {
        id: { in: ids },
      },
      include,
    });

    const orderdData = [];

    for (let id of ids) {
      for (let item of includedData) {
        if (id === item.id) {
          orderdData.push(item);
          break;
        }
      }
    }

    await afterRequestPermissionCheck({
      req,
      beforeReqFunction: pgSearch?.afterSearch,
      search,
      where,
      include,
      docs: orderdData,
      searchResults,
    });

    return res.status(200).json({
      docs: orderdData,
      where,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = PgSearch;

// Create A query Builder
// Use Nested
