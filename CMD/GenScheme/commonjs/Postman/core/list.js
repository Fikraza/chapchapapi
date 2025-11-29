const { getUrlObj } = require("./../util");

function list({ collection, model }) {
  const item = [];
  const folder = {
    name: "list",
    item,
  };

  item.push({
    name: `List ${model}`,
    request: {
      method: "GET",
      url: getUrlObj({ url: `list/${model}` }),
    },
  });

  collection.push(folder);
}

module.exports = list;
