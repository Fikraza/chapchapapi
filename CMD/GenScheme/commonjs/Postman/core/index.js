const crud = require("./crud");
const csv = require("./csv");
const list = require("./list");
const search = require("./search");

const getModel = require("./../../Utils/CLI/getModel");

function core({ collection, model }) {
  let modelObj = getModel({ model });

  crud({ collection, model, modelObj });
  csv({ collection, model });
  list({ collection, model });
  search({ collection, model });
}

module.exports = core;
