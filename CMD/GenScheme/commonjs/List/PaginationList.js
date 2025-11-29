const prisma = require("../../Prisma");
const getModel = require("../Utils/CLI/getModel");

const {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
} = require("../Crud/utils/permissionChecker");

const QueryFilter = require("../Utils/QueryFilter");

const handleOrderQuery = require("./../Utils/General/handleOrderQuery");

async function List(req, res, next) {
  try {
    // code here

    const { model } = req.params;

    const query = req.query;

    const { page = 1, limit = 10, order = null } = req.query;

    const modelObj = getModel({ model });

    if (!modelObj) {
      throw { custom: true, message: "Model not supported for get" };
    }

    let responseObject = {};

    const include = modelObj?.include || {};

    const permission = modelObj?.permission;

    const permisionConfig = permission?.Config;
    const where = {};
    const ignoreInFilters = ["page", "limit", "order", "_meta_info"];

    ifmethodNotAllowedThrowError({ permisionConfig, method: "GET" });

    QueryFilter({ where, query, ignoreInFilters });

    const orderBy = {};

    handleOrderQuery({ orderBy, order });

    await beforeRequestPermissionCheck({
      req,
      beforeReqFunction: permission?.List?.beforeList,
      responseObject,
      query,
      where,
      ignoreInFilters,
      include,
      orderBy,
    });

    const pageNumber = parseInt(page) || 1;
    const pageLimit = parseInt(limit) || 10;
    const total = await prisma[model].count({ where });

    const pageCount = Math.ceil(total / pageLimit);
    const offset = pageNumber > 1 ? pageNumber * pageLimit - pageLimit : 0;

    const items = await prisma[model].findMany({
      where,
      include,
      orderBy,
      skip: offset,
      take: pageLimit,
    });
    const pagination = {
      total,
      limit,
      total_docs: items?.length,
      pages: pageCount,
      page: page,
      hasNextPage: pageCount > pageNumber,
      hasPrevPage: pageCount >= pageNumber && pageNumber > 1,
    };

    responseObject = {
      ...responseObject,
      pagination,
      docs: items,
      query: {
        where,
        orderBy,
      },
      include,
    };

    await afterRequestPermissionCheck({
      req,
      beforeReqFunction: permission?.List?.afterList,
      responseObject,
      query,
      where,
      ignoreInFilters,
      include,
      pagination,
      docs: items,
      orderBy,
    });

    //range filter,in filter and some filter and
    return res.status(200).json(responseObject);
  } catch (e) {
    console.log(e);
    next(e);
  }
}

module.exports = List;
