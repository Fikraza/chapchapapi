async function beforeList({ req, where, query }) {
  console.log("Checking before list");
}

async function afterList({ req, where, query }) {}

module.exports = { beforeList, afterList };
