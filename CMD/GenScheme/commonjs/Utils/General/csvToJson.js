const fs = require("fs");
const csv = require("csv-parser");

function csvToJson(path) {
  return new Promise((resolve) => {
    // Check if file exists
    if (!fs.existsSync(path)) {
      return resolve(null);
    }

    const results = [];

    try {
      fs.createReadStream(path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", () => resolve(null)); // return null on parser error
    } catch (e) {
      resolve(null); // return null on unexpected error
    }
  });
}

module.exports = csvToJson;
