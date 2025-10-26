const path = require("path");

const fs = require("fs");

const nano = require("./nano");

async function dbExists({ dbName }) {
  try {
    // code here

    if (typeof dbName !== "string") {
      // console.log("dbExists");
      throw { message: "dbName must be a string" };
    }

    await nano.db.get(dbName);

    return true;
  } catch (e) {
    console.error("Relax util error: Db exists");
    //console.error(e);
    return false;
  }
}

module.exports = dbExists;
