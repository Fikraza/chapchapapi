require("dotenv").config();

const nano = require("nano")(process.env.COUCHDBURL);

// console.log(process.env.COUCHDBURL);

module.exports = nano;
