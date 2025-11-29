const { getUrlObj } = require("./../util");

function csv({ collection, model }) {
  const item = [];
  const folder = {
    name: "csv",
    item,
  };

  item.push({
    name: "Generate",
    request: {
      method: "GET",
      url: getUrlObj({ url: `csv/generate/${model}` }),
    },
  });

  item.push({
    name: "Template",
    request: {
      method: "GET",
      url: getUrlObj({ url: `csv/template/${model}` }),
    },
  });

  item.push({
    name: "Upsert",
    request: {
      method: "PUT",
      url: getUrlObj({ url: `csv/update/${model}` }),
    },
    body: {
      mode: "raw",
      raw: {},
    },
  });

  collection.push(folder);
}

module.exports = csv;
