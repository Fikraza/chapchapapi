function structureArray(structure) {
  try {
    if (!structure || typeof structure !== "object") {
      return [];
    }

    const result = [];

    function process(key, items) {
      for (const item of items) {
        if (Array.isArray(item)) {
          process(key, item);
        } else {
          result.push([key, item]);
        }
      }
    }

    for (const [key, items] of Object.entries(structure)) {
      if (items.length === 1) {
        result.push([key]);
        continue;
      }
      process(key, items);
    }

    return result;
  } catch (e) {
    console.log(e);
    return [];
  }
}

module.exports = structureArray;
