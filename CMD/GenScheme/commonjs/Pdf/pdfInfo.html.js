function PdfInfo({ model }) {
  return ` <div style="display:flex; justify-content:space-between; align-items:center;">
    <h2 style="text-align:center;">${
      model?.charAt(0)?.toUpperCase() || "-" + model?.slice(1) || "-"
    } Report</h2>
    <h4>Date: ${new Date().toLocaleString()}</h4>
  </div>`;
}

module.exports = PdfInfo;
