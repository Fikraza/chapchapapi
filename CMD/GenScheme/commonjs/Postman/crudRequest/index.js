const patchRequest = require("./PatchRequest");
const postRequest = require("./PostRequest");
const putRequest = require("./PutRequest");

const deleteRequest = require("./deleteRequest");
const getRequest = require("./getRequest");
const searchListRequest = require("./searchListRequest");

function crudRequest({ field, methods, modelName }) {
  let item = [];

  // searchListRequest({ modelName, item, methods });

  for (let method of methods) {
    let methodName = method?.toUpperCase();
    if (methodName === "PATCH") {
      patchRequest({ modelName, item, field });
      continue;
    }

    if (methodName === "POST") {
      postRequest({ modelName, item, field });
      continue;
    }

    if (methodName === "PUT") {
      putRequest({ modelName, item, field });
      continue;
    }

    if (methodName === "DELETE") {
      deleteRequest({ modelName, item });
      continue;
    }

    if (methodName === "GET") {
      getRequest({ modelName, item });
      continue;
    }
  }

  return item;
}

module.exports = crudRequest;
