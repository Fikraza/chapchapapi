const dictionary = {
  string: {
    transform: ["str"],
    validation: {
      str: true,
    },
  },
  int: {
    transform: ["int"],
    validation: {
      number: true,
    },
  },
  bigint: {
    transform: ["int"],
    validation: {
      number: true,
    },
  },
  float: {
    transform: ["float"],
    validation: {
      number: true,
    },
  },
  decimal: {
    transform: [],
    validation: {
      number: true,
    },
  },
  boolean: {
    transform: [],
    validation: {
      bool: true,
    },
  },
  datetime: {
    transform: ["dateTime"],
    validation: {
      dateTime: true,
    },
  },
  bytes: {
    transform: [],
    validation: {},
  },
  json: {
    transform: [],
    validation: {},
  },
};

module.exports = dictionary;
