const { getUrlObj } = require("./../util");

function document(item) {
  const newItem = [];
  const folder = {
    name: "Document",
    item: newItem,
  };

  const url = "document";

  newItem.push({
    name: "Upsert",
    request: {
      method: "PUT",
      url: getUrlObj({ url }),
    },
  });

  newItem.push({
    name: "Download",
    request: {
      method: "GET",
      url: getUrlObj({ url, params: { id: "pass_document_id" } }),
    },
  });

  item.push(folder);
}

module.exports = document;
