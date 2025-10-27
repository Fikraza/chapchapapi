async function pgSearch({ search, limit, req, where, include }) {
  return {
    query: `
        
        LIMIT ${limit}
        `,
    params: [search],
  };
}

module.exports = pgSearch;
