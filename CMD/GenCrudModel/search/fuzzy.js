// add filter search

const filters = ({ where, req }) => {};

// specify search keys for your model
// you can also do nested using string".""
const searchKeys = [];

async function beforeSearch({ req, where, searchString, include }) {}

async function afterSearch({ records, req, where, searchString, include }) {}

module.exports = {
  filters,
  searchKeys,
  beforeSearch,
  afterSearch,
};
