const document = require("./document");
const crud = require("./crud");
const list = require("./list");
const csv = require("./csv");
const search = require("./search");

function general(generalItem) {
  crud(generalItem);
  csv(generalItem);
  document(generalItem);
  list(generalItem);
  search(generalItem);
}

module.exports = general;
