const header = require("../header");

const getUrl = require("./getUrl");

function PostRequest({ modelName, item, field }) {
  let fieldKeys = Object.keys(field);
  let rawBody = {};
  for (let fieldKey of fieldKeys) {
    if (fieldKey === "id") {
      continue;
    }
    rawBody[fieldKey] = "";
  }

  let request = {
    name: `Create ${modelName}`,
    request: {
      method: "POST",
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

module.exports = PostRequest;
