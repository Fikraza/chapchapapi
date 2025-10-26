const getAllModels = require("./../Utils/CLI/getAllModels");

const createCollectionSubFolders = require("./createCollectionSubFolders");

const crudRequest = require("./crudRequest");

const documentRequest = require("./documentRequest");

const createScheme = require("./CreateScheme");

const searchListRequest = require("./crudRequest/searchListRequest");

async function Postman(req, res, next) {
  try {
    // code here

    let models = getAllModels();

    let ModelKeys = Object.keys(models).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );

    const collection = [];

    for (let modelKey of ModelKeys) {
      const modelName = modelKey;
      const model = models[modelKey];

      let allowedMethods = model?.permission?.allowedMethods;
      const field = model?.field;
      if (
        !Array.isArray(allowedMethods) ||
        allowedMethods?.length == 0 ||
        !field
      ) {
        continue;
      }

      const requestObj = createCollectionSubFolders({
        field: model?.folderPath,
        collection,
      });

      let crudItem = crudRequest({ field, methods: allowedMethods, modelName });
      let documentItem = documentRequest({
        field,
        methods: allowedMethods,
        modelName,
        csv: model?.csv,
        pdf: model?.pdf,
      });

      let searchListItem = searchListRequest({
        modelName,
        methods: allowedMethods,
        search: model?.search,
      });

      if (searchListItem) {
        requestObj.push(...searchListItem);
      }

      requestObj.push(
        {
          name: "crud",
          item: crudItem,
        },
        { name: "document", item: documentItem }
      );
    }

    let schemeRes = await createScheme(collection);

    res.status(200).json({ schemeRes });
  } catch (e) {
    next(e);
  }
}

module.exports = Postman;
