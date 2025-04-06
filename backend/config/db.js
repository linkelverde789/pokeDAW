const db = require('pg-promise')()({
  host: 'database',
  port: 5432,
  database: 'pokemon',
  user: 'alumno',
  password: 'alumno',
});


module.exports = db;
