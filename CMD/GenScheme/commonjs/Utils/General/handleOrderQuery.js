function handleOrderQuery({ orderBy, order = null }) {
  try {
    const orderArray = order
      ?.trim()
      ?.toLowerCase()
      ?.replace(/\s+/g, "")
      ?.split("-");
    let orderkey = orderArray[0];
    let orderDirection = orderArray[1];
    if (orderkey !== undefined && orderkey !== null) {
      if (orderDirection === "asc") {
        orderBy[orderkey] = "asc";
      }
      if (orderDirection === "Desc") {
        orderBy[orderkey] = "desc";
      }
    }
  } catch (e) {
    console.log("error in handle order query");
    console.log(e);
  }
}

module.exports = handleOrderQuery;
