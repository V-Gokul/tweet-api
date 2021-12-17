const config = require("./knexfile")[process.env.NODE_EVN || "development"];
const knex = require("knex")(config);

module.exports = knex;
