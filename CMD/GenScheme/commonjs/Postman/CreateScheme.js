require("dotenv").config();
const axios = require("axios");

const POSTMANAPIKEY = process.env.POSTMANAPIKEY;
const POSTMANWORKSPACE = process.env.POSTMANWORKSPACE;

async function CreateScheme(collection) {
  const baseURL = "https://api.getpostman.com";
  const headers = {
    "X-Api-Key": POSTMANAPIKEY,
    "Content-Type": "application/json",
  };

  const createScheme = await axios({
    method: "POST",
    url: `${baseURL}/collections`,
    params: {
      workspace: POSTMANWORKSPACE,
    },
    data: {
      collection: {
        info: {
          name: `Scheme-${new Date().toISOString().split(".")[0] + "Z"}`,
          schema:
            "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        item: collection,
      },
    },
    headers,
  });

  return createScheme?.data;
}

module.exports = CreateScheme;
