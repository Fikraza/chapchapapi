async function beforeGenerate({ req, tx }) {
  console.log("Before csv generate");
}
async function afterGenerate({ req, tx }) {
  console.log("After csv generate");
}

function singleRecordCallback({
  tx,
  record,
  escapeCsvValue,
  index,
  pageNumber,
}) {
  // console.log("record ", record);
  // console.log("index ", index);
  // console.log("page Number ", pageNumber);

  return ["abcd", "testing", 123];
}

const csv = {
  head: [],
  data: [], //can be function or singleRecordCallback or
  beforeGenerate,
  afterGenerate,
};

module.exports = csv;
