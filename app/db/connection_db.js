const Pool = require("pg").Pool;

const pool = new Pool({
    user: "errxgbbv",
    password: "AseUuPEH1qZEbyOSqg968wvwaVXbsrMf",
    database: "errxgbbv",
    host: "suleiman.db.elephantsql.com",
    port: 5432
});

module.exports = pool;