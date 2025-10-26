const getModel = require("./../Utils/CLI/getModel");
const { rangeFilter, modelFilter } = require("./../Utils/Scheme/Filter");
const prisma = require("../../Prisma");

const fs = require("fs");
const path = require("path");
const process = require("process");

async function Template(req, res, next) {
  const rootDir = process.cwd();
  const fileName = `temp-${req?.params?.model || "-"}${Date.now()}.csv`;
  const filePath = path.join(rootDir, "Temp/Generated");

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  const filePlusPath = path.join(filePath, fileName);
  fs.writeFileSync(filePlusPath, "", "utf8");

  let fileWasSent = false;
  res.on("finish", () => {
    fileWasSent = true;
  });

  try {
    const { model } = req.params;
    const modelDoc = getModel(model);
    const { csv } = modelDoc;

    if (!csv) {
      throw { custom: true, message: "CSV not supported for this model" };
    }

    const head = csv?.head;

    if (!head) {
      throw {
        custom: true,
        message: "Missing head fields in model CSV config",
      };
    }

    let headString = Array.isArray(head)
      ? head.map((str) => str?.toString()?.replace(/[\r\n,]+/g, "")).join(",")
      : head?.toString()?.replace(/[\r\n,]+/g, "");

    // Prepend 'id' if not present
    const headers = headString.trim().startsWith("id")
      ? headString
      : `id,${headString}`;

    const fileStream = fs.createWriteStream(filePlusPath);
    await new Promise((resolve, reject) => {
      fileStream.write(headers + "\n", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      fileStream.end((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return res.sendFile(filePlusPath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error sending file");
      }
    });
  } catch (e) {
    next(e);
  } finally {
    setTimeout(() => {
      if (fileWasSent && fs.existsSync(filePlusPath)) {
        fs.unlink(filePlusPath, (err) => {
          if (err) console.error("Error deleting template file:", err);
        });
      }
    }, 500);
  }
}

module.exports = Template;
