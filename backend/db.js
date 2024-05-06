const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',  // Reemplaza con tu usuario
    host: 'localhost',
    database: 'itvdb',
    password: 'Calasparra',  // Reemplaza con tu contraseña
    port: 5432
});

module.exports = pool;
