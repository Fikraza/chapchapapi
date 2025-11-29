async function beforeSearch({ req, where, searchString, include }) {}

async function afterSearch({ records, req, where, searchString, include }) {}

/*

To use pg trim search write your query and order 
as sql ensure its safe so that you dont have sql injection
*/

/*
async function pgTrgm({ search, limit = 10 }) {
  return {
    query: `
 SELECT a.id,
             a.id_no,
             a.full_names,
             a.phone_no,
             a.email
      FROM applicant a
      WHERE a.id_no % $1
         OR a.full_names % $1
         OR a.phone_no % $1
         OR a.email % $1
      ORDER BY GREATEST(
        similarity(a.id_no, $1),
        similarity(a.full_names, $1),
        similarity(a.phone_no, $1),
        similarity(a.email, $1)
      ) DESC
      LIMIT ${limit}
        `,
    params: [search],
  };
}
*/

async function pgTrgm({ search, limit = 10 }) {
  return {
    query: `
        `,
    params: [search],
  };
}

module.exports = { pgTrgm, afterSearch, beforeSearch };
