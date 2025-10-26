const header = [
  {
    key: "Authorization",
    value: "Bearer {{token}}",
    type: "text",
  },
  {
    key: "Content-Type",
    value: "application/json",
    type: "text",
  },
];

module.exports = header;
