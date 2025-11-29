const { getUrlObj } = require("./../util");

function crud(item) {
  const newItem = [];
  const folder = {
    name: "abcd",
    item: newItem,
  };

  const url = "abcd/model_name";

  newItem.push({
    name: "Add",
    request: {
      method: "POST",
      url: getUrlObj({ url }),
    },
    body: {
      mode: "raw",
      raw: {},
    },
  });

  newItem.push({
    name: "Get By Id",
    request: {
      method: "GET",
      url: getUrlObj({ url, params: { id: "id" } }),
    },
  });

  newItem.push({
    name: "UPSERT",
    request: {
      method: "PUT",
      url: getUrlObj({ url }),
    },
    body: {
      mode: "raw",
      raw: {},
    },
  });

  newItem.push({
    name: "PATCH",
    request: {
      method: "PATCH",
      url: getUrlObj({ url }),
    },
    body: {
      mode: "raw",
      raw: {},
    },
  });

  newItem.push({
    name: "Delete",
    request: {
      method: "DELETE",
      url: getUrlObj({ url, params: { id: "id" } }),
    },
  });

  item.push(folder);
}

module.exports = crud;
