const prisma = require("../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
} = require("../Crud/utils/permissionChecker");

const QueryFilter = require("../Utils/QueryFilter");

const Fuzzy = require("./Fuzzy");
async function FuseSearch(req, res, next) {
  try {
    // code here
    const { model } = req.params;

    const query = req.query;
    const { search, limit = 10 } = query;
    const pageSearchLimit = 1000;

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

    const fuzzySearch = modelObj?.search?.Fuzzy;
    const searchKeys = fuzzySearch?.searchKeys;

    if (!fuzzySearch) {
      throw {
        custom: true,
        message: `Fuzzy search not supported for model ${model}`,
      };
    }

    if (!Array.isArray(searchKeys)) {
      throw {
        custom: true,
        message: `searchKeys should be an array`,
        status: 500,
      };
    }

    const ignoreInFilters = ["page", "limit", "order", "_meta_info", "search"];
    let where = {};

    QueryFilter({ where, query, ignoreInFilters });

    await beforeRequestPermissionCheck({
      req,
      beforeReqFunction: fuzzySearch?.beforeSearch,
      search,
      where,
      include,
    });

    let pageNumber = 1;
    let docs = [];

    while (true) {
      const pageLimit = parseInt(pageSearchLimit);
      const offset = pageNumber > 1 ? pageNumber * pageLimit - pageLimit : 0;

      const items = await prisma[model].findMany({
        where,
        include,
        skip: offset,
        take: pageLimit,
      });
      if (items.length == 0) {
        break;
      }

      const searchResults = Fuzzy({
        search,
        items,
        keys: searchKeys,
      });

      if (searchResults.length > 0) {
        docs = [...docs, ...searchResults];
      }
      pageNumber++;
    }
    const searchResults = Fuzzy({
      search,
      items: docs,
      keys: searchKeys,
    });

    let finalDocs = searchResults.slice(0, limit + 1);

    await afterRequestPermissionCheck({
      req,
      beforeReqFunction: fuzzySearch?.afterSearch,
      search,
      where,
      include,
      docs: finalDocs,
      searchResults,
    });

    return res.status(200).json({
      docs: searchResults.slice(0, limit + 1),
      where,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = FuseSearch;
