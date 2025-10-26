const header = require("../header");

function documentRequest({ modelName, methods, csv, pdf }) {
  let item = [];

  let foundPUT = methods.find((method) => method?.toUpperCase() === "PUT");
  let foundGet = methods.find((method) => method?.toUpperCase() === "GET");

  if (foundGet && csv) {
    const csvGenerate = {
      name: `Csv Generate ${modelName}`,
      request: {
        method: "GET",
        header,
        url: {
          raw: `{{local}}/scheme/csv/generate${modelName}`,
          host: `{{local}}`,
          path: ["scheme", "csv", "generate", modelName],
        },
      },
      params: {},
    };

    const csvTemplate = {
      name: `Csv Template ${modelName}`,
      request: {
        method: "GET",
        header,
        url: {
          raw: `{{local}}/scheme/csv/template${modelName}`,
          host: `{{local}}`,
          path: ["scheme", "csv", "template", modelName],
        },
      },
    };

    item.push(csvGenerate, csvTemplate);
  }

  if (foundPUT && csv) {
    const csvUpload = {
      name: `Csv Upload ${modelName}`,
      request: {
        method: "PUT",
        header,
        url: {
          raw: `{{local}}/scheme/csv${modelName}`,
          host: `{{local}}`,
          path: ["scheme", "csv", modelName],
        },
      },
    };

    item.push(csvUpload);
  }

  if (foundGet && pdf) {
    const pdfGenerate = {
      name: `Pdf Generate ${modelName}`,
      request: {
        method: "GET",
        header,
        url: {
          raw: `{{local}}/scheme/pdf/generate${modelName}`,
          host: `{{local}}`,
          path: ["scheme", "pdf", "generate", modelName],
        },
        params: {},
      },
    };
    item.push(pdfGenerate);
  }

  return item;
}

module.exports = documentRequest;
