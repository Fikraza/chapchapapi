async function beforeList({ req, where, query, tx }) {
  console.log("Checking before list");
}

async function afterList({ req, where, query, tx }) {}

module.exports = { beforeList, afterList };
