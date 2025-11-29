async function beforeCsvUpload({ req }) {}

async function upsertRecord({ record, req, index, tx }) {
  return null;
}

async function afterCsvUpload(params) {}

module.exports = { upsertRecord, beforeCsvUpload, afterCsvUpload };
