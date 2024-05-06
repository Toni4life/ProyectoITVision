const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'itvdb',
  password: 'Calasparra',
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.get('/vehiculos', async (req, res) => {
  try {
    const result = await pool.query('SELECT vehiculoid, numerobastidor, marca, modelo, tara, medidaneumaticos, dimensiones, combustible, normativaeuro, aniofabricacion FROM vehiculos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los vehículos');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

