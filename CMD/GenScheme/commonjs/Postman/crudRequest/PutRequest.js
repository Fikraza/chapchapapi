const header = require("../header");
const getUrl = require("./getUrl");

function PutRequest({ modelName, item, field }) {
  let fieldKeys = Object.keys(field);
  let rawBody = { id: "" };
  for (let fieldKey of fieldKeys) {
    rawBody[fieldKey] = "";
  }

  let request = {
    name: `Update ${modelName}`,
    request: {
      method: "PUT",
      header,
      url: {
        raw: getUrl(modelName),
        host: ["{{local}}"],
        path: ["scheme", modelName],
      },
      body: {
        mode: "raw",
        raw: JSON.stringify(rawBody, null, 2),
        options: {
          raw: {
            language: "json",
          },
        },
      },
    },
  };

  item.push(request);
}

module.exports = PutRequest;
