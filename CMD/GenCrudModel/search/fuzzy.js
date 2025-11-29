// add filter search

// specify search keys for your model
// you can also do nested using string".""
const searchKeys = ["id_no"];

async function beforeSearch({ req, where, searchString, include }) {}

async function afterSearch({ records, req, where, searchString, include }) {}

module.exports = {
  searchKeys,
  beforeSearch,
  afterSearch,
};
