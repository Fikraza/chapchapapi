const getModel = require("./../Utils/CLI/getModel");
const {
  rangeFilter,
  modelFilter,
  formatOrder,
} = require("./../Utils/Scheme/Filter");
const prisma = require("../../Prisma");
const fs = require("fs");
const path = require("path");
const process = require("process");
const getNestedValueFromObj = require("./../Utils/General/getNestedValueFromObj");

const {
  handleAfterPermission,
  handleBeforePermission,
} = require("./../Utils/Scheme/Permission");

function escapeCsvValue(value) {
  if (value == null) return ""; // handle null/undefined
  let str = String(value);

  // Escape double quotes by doubling them
  if (/[",\n]/.test(str)) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

async function Generate(req, res, next) {
  const rootDir = process.cwd();
  const fileName = `gen-${req?.params?.model || "-"}${Date.now()}.csv`;
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
    const { permission, csv, include = {} } = modelDoc;

    const { order = "id-desc" } = req.query;
    const query = req.query;

    const allowedMethods = Array.isArray(permission?.allowedMethods)
      ? permission?.allowedMethods
      : [""];

    if (!allowedMethods.includes("GET")) {
      throw { custom: true, message: "Model permission denied", status: 403 };
    }

    const head = csv?.head;
    const data = csv?.data;

    if (!head || !data) {
      throw { custom: true, message: "CSV generation not supported on model" };
    }

    let headString = Array.isArray(head)
      ? head.map((str) => str?.toString()?.replace(/[\r\n,]+/g, "")).join(",")
      : head?.toString()?.replace(/[\r\n,]+/g, "");

    await handleBeforePermission({ req, permission });

    const where = {};
    const exclude = ["page", "limit", "order"];
    rangeFilter({ where, exclude, query });
    modelFilter({ where, exclude, query });

    const orderBy = formatOrder(order);
    const limit = 9000;
    let pageNumber = 1;
    const fileStream = fs.createWriteStream(filePlusPath);

    await new Promise((resolve, reject) => {
      fileStream.write(headString + "\n", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await prisma.$transaction(
      async (tx) => {
        while (true) {
          const pageLimit = parseInt(limit);
          const offset =
            pageNumber > 1 ? pageNumber * pageLimit - pageLimit : 0;

          const items = await tx[model].findMany({
            where,
            include,
            orderBy,
            skip: offset,
            take: pageLimit,
          });

          if (items.length === 0) break;

          let lines = "";

          if (Array.isArray(data)) {
            lines = items
              .map((item) =>
                data
                  .map((fieldPath) => {
                    let val = getNestedValueFromObj({
                      obj: item,
                      fieldPath,
                    });
                    if (typeof val === "undefined") return "-";
                    if (val === null) return "null";
                    return escapeCsvValue(val.toString());
                  })
                  .join(",")
              )
              .join("\n");
          } else if (typeof data === "function") {
            lines = items
              .map((item) => (data(item) || "").toString())
              .join("\n");
          }

          await new Promise((resolve, reject) => {
            fileStream.write(lines + "\n", (err) => {
              if (err) reject(err);
              else resolve();
            });
          });

          pageNumber += 1;
        }
      },
      { timeout: 60000000 }
    );

    await handleAfterPermission({ req, permission, data: {} });

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
    // Cleanup: delete file after sending completes
    setTimeout(() => {
      if (fileWasSent && fs.existsSync(filePlusPath)) {
        fs.unlink(filePlusPath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    }, 500);
  }
}

module.exports = Generate;
