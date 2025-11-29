const { getUrlObj } = require("./../util");

function crud({ collection, model, modelObj = {} }) {
  const item = [];
  const folder = {
    name: "abcd",
    item,
  };

  const url = `abcd/${model}`;

  const field = modelObj?.field || {};
  const fieldKeys = Object.keys(field);

  const newFieldObj = {};

  for (let i = 0; i < fieldKeys.length; i++) {
    let fieldName = fieldKeys[i];
    let fieldObj = field[fieldName];
    if (fieldName === "id") continue;
    newFieldObj[fieldName] =
      fieldObj?.required === false || fieldObj?.skip_check
        ? "optional"
        : "* required";
  }

  // -------------------------
  // POST
  // -------------------------
  item.push({
    name: `Add ${model}`,
    request: {
      method: "POST",
      url: getUrlObj({ url }),
      body: {
        mode: "raw",
        raw: JSON.stringify(newFieldObj, null, 2),
        options: { raw: { language: "json" } },
      },
    },
  });

  // -------------------------
  // GET BY ID
  // -------------------------
  item.push({
    name: `Get ${model} By Id`,
    request: {
      method: "GET",
      url: getUrlObj({ url, params: { id: "id" } }),
    },
  });

  // -------------------------
  // PUT (Upsert)
  // -------------------------
  item.push({
    name: `Upsert ${model}`,
    request: {
      method: "PUT",
      url: getUrlObj({ url }),
      body: {
        mode: "raw",
        raw: JSON.stringify({ id: "", ...newFieldObj }, null, 2),
        options: { raw: { language: "json" } },
      },
    },
  });

  // -------------------------
  // PATCH
  // -------------------------
  item.push({
    name: `Patch ${model}`,
    request: {
      method: "PATCH",
      url: getUrlObj({ url }),
      body: {
        mode: "raw",
        raw: JSON.stringify({ id: "", ...newFieldObj }, null, 2),
        options: { raw: { language: "json" } },
      },
    },
  });

  // -------------------------
  // DELETE
  // -------------------------
  item.push({
    name: `Delete ${model}`,
    request: {
      method: "DELETE",
      url: getUrlObj({ url, params: { id: "id" } }),
    },
  });

  collection.push(folder);
}

module.exports = crud;
