const header = require("../header");

const getUrl = require("./getUrl");

function getRequest({ modelName, item }) {
  let getById = {
    name: `ById ${modelName}`,
    request: {
      method: "GET",
      header,
      url: {
        raw: getUrl(modelName),
        host: `{{local}}`,
        path: ["scheme", modelName],
        params: {
          id: "",
        },
      },
    },
  };

  item.push(getById);
}

module.exports = getRequest;
