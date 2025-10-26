const { generatePdf } = require("html-pdf-node"); // ✅ correct import
const getModel = require("./../Utils/CLI/getModel");

const {
  rangeFilter,
  modelFilter,
  formatOrder,
} = require("./../Utils/Scheme/Filter");

const prisma = require("../../Prisma");

const styleEl = require("./style.html");
const pdfInfoEl = require("./pdfInfo.html");

const getNestedValueFromObj = require("./../Utils/General/getNestedValueFromObj");

async function GeneratePdf(req, res, next) {
  try {
    const { model } = req.params;
    const modelDoc = getModel(model);

    const { permission, csv, pdf, include = {} } = modelDoc;
    const query = req.query;
    const { order = "id-desc" } = req.query;

    const allowedMethods = Array.isArray(permission?.allowedMethods)
      ? permission?.allowedMethods
      : [""];

    if (!allowedMethods.includes("GET")) {
      throw { custom: true, message: "Model permission denied", status: 403 };
    }

    const head = pdf?.head || csv?.head || null;
    const data = pdf?.data || csv?.data || null;

    if (!head || !data) {
      throw {
        custom: true,
        message: "PDF generation not supported for this model",
      };
    }

    const headArray = Array.isArray(head) ? head : head?.split(",");

    const where = {};
    const exclude = ["page", "limit", "order"];
    rangeFilter({ where, exclude, query });
    modelFilter({ where, exclude, query });

    const orderBy = formatOrder(order);

    const headRowEl = headArray.reduce((acc, field) => {
      return acc + `<th>${field}</th>`;
    }, "");

    let bodyRowEl = "";
    let pageNumber = 1;
    const limit = 90000;

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

          // Array field paths (e.g., ["name", "nested.age"])
          if (Array.isArray(data)) {
            const rows = items.map((item) => {
              const tds = data.map((fieldPath) => {
                let val = getNestedValueFromObj({ obj: item, fieldPath });
                if (typeof val === "undefined" || val === null)
                  return `<td>null</td>`;
                return `<td>${val.toString()}</td>`;
              });

              return `<tr>${tds.join("")}</tr>`;
            });
            bodyRowEl += rows.join("");
          }

          // Functional formatting
          if (typeof data === "function") {
            const rows = items.map((item) => {
              const row = data(item)?.toString() || "";
              return `<tr>${row}</tr>`;
            });
            bodyRowEl += rows.join("");
          }

          pageNumber++;
        }
      },
      { timeout: 6000000 }
    );

    const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              ${styleEl(headArray)}
              <title>${model} PDF</title>
            </head>
            <body>
              ${pdfInfoEl({ model })}
              <table>
                <tr>${headRowEl}</tr>
                ${bodyRowEl}
              </table>
            </body>
            </html>
    `;

    const file = { content: html };
    const options = { format: "A4", printBackground: true };
    const pdfBuffer = await generatePdf(file, options);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${model}-report.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  } catch (e) {
    next(e);
  }
}

module.exports = GeneratePdf;
