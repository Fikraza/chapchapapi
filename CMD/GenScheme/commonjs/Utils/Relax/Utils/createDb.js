const path = require("path");

const fs = require("fs");

const nano = require("./nano");

const dbExists = require("./dbExists");

async function createDb({ dbName }) {
  try {
    let exists = await dbExists({ dbName });
    if (exists) {
      return true;
    }
    await nano.db.create(dbName);
    return true;
  } catch (e) {
    console.error("Failed to create db");
    console.log(e);
    return false;
  }
}

module.exports = createDb;
