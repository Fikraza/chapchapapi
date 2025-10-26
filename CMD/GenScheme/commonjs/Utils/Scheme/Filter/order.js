function formatOrder(order_by) {
  try {
    const order = {};
    if (order_by.includes("-")) {
      let str = order_by.split("-");
      order[str[0]] = str[1];
      return order;
    }

    return { id: "desc" };
  } catch (e) {
    // console.log(e);
    return {};
  }
}

module.exports = formatOrder;
