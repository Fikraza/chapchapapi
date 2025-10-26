function generateStyle(headerArray) {
  const columnCount = headerArray.length;
  const columnWidth = (100 / columnCount).toFixed(2) + "%";
  return `  <style>
    @page {
      margin: 10mm;
    }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
      font-size: 8px;
      padding: 10mm;
      position: relative;
    }


    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      word-wrap: break-word;
      border: 1px solid #000;
    }

    th, td {
      border: 1px solid #000;
      padding: 4px;
      text-align: left;
      font-size: 7px;
      width: ${columnWidth};
      overflow-wrap: break-word;
      word-break: break-word;
      white-space: normal;
    }

  </style>`;
}

module.exports = generateStyle;
