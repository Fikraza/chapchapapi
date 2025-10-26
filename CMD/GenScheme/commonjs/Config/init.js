const prisma = require("./../../Prisma");

const conf = require("./config");

function generateUUID(index) {
  // Convert the index to a hex string and pad with zeros
  const hexIndex = index.toString(16).padStart(32, "0");

  // Format the hex string into a UUID (8-4-4-4-12)
  return `${hexIndex.substring(0, 8)}-${hexIndex.substring(
    8,
    12
  )}-${hexIndex.substring(12, 16)}-${hexIndex.substring(
    16,
    20
  )}-${hexIndex.substring(20, 32)}`;
}

async function init(req, res, next) {
  try {
    const keys = Object.keys(conf);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const documents = conf[key];

      for (let j = 0; j < documents.length; j++) {
        const doc = documents[j];
        const update_doc = { ...doc };

        delete update_doc.id;
        doc.id = generateUUID(j + 1);

        //console.log("DOC, ", doc);

        const result = await prisma[key].upsert({
          where: {
            id: doc.id,
          },
          update: update_doc,
          create: doc,
        });
        console.log(result);
      }
    }

    return res
      .status(200)
      .json({ message: "Completed initalization of Admin" });
  } catch (e) {
    next(e);
  }
}

module.exports = init;
