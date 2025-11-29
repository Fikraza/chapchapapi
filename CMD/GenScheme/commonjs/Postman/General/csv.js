const { getUrlObj } = require("./../util");

function csv(item) {
  const newItem = [];
  const folder = {
    name: "CSV",
    item: newItem,
  };

  newItem.push({
    name: "Generate",
    request: {
      method: "GET",
      url: getUrlObj({ url: `csv/generate/model_name` }),
    },
  });

  newItem.push({
    name: "Template",
    request: {
      method: "GET",
      url: getUrlObj({ url: `csv/template/model_name` }),
    },
  });

  newItem.push({
    name: "Upsert",
    request: {
      method: "PUT",
      url: getUrlObj({ url: `csv/update/model_name` }),
    },
    body: {
      mode: "raw",
      raw: {},
    },
  });

  item.push(folder);
}

module.exports = csv;
