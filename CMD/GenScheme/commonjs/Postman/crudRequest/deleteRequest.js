const header = require("../header");

const getUrl = require("./getUrl");

function DeleteRequest({ modelName, item, field }) {
  let request = {
    name: `DELETE ${modelName}`,
    request: {
      method: "DELETE",
      header,
      url: {
        raw: getUrl(modelName),
        host: `{{local}}`,
        path: ["scheme", modelName],
        params: {
          id: "id",
        },
      },
    },
  };

  item.push(request);
}

module.exports = DeleteRequest;
