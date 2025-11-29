async function beforeCsvUpload({ req }) {
  console.log("Before csv upload");
}

async function upsertRecord({ record, req, index }) {
  console.log("record", record);
  console.log("index", index);
  return null;
}

async function afterCsvUpload(params) {
  console.log("After csv upload");
}

module.exports = { upsertRecord, beforeCsvUpload, afterCsvUpload };
