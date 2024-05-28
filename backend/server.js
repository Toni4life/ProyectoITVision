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

// PRIMERA FASE

app.get('/primerafase', async (req, res) => {
  try {
    const result = await pool.query('SELECT numerobastidor, km, subgrupos FROM primerafase');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos de la primera fase');
  }
});

app.post('/primerafase', async (req, res) => {
  const { numerobastidor, km, subgrupos } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO primerafase (numerobastidor, km, subgrupos) VALUES ($1, $2, $3) RETURNING *',
      [numerobastidor, km, subgrupos]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al añadir los datos de la primera fase');
  }
});

// SEGUNDA FASE

app.get('/segundafase', async (req, res) => {
  try {
    const result = await pool.query('SELECT numerobastidor, combustible, emisiones, subgrupos FROM segundafase');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos de la segunda fase');
  }
});

app.post('/segundafase', async (req, res) => {
  const { numerobastidor, combustible, emisiones, subgrupos } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO segundafase (numerobastidor, combustible, emisiones, subgrupos) VALUES ($1, $2, $3, $4) RETURNING *',
      [numerobastidor, combustible, emisiones, subgrupos]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al añadir los datos de la segunda fase');
  }
});

// TERCERA FASE

app.get('/tercerafase', async (req, res) => {
  try {
    const result = await pool.query('SELECT numerobastidor, frenos, frenado, subgrupos FROM tercerafase');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos de la tercera fase');
  }
});

app.post('/tercerafase', async (req, res) => {
  const { numerobastidor, frenos, frenado, subgrupos } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO tercerafase (numerobastidor, frenos, frenado, subgrupos) VALUES ($1, $2, $3, $4) RETURNING *',
      [numerobastidor, frenos, frenado, subgrupos]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al añadir los datos de la tercera fase');
  }
});

// CUARTA FASE

app.get('/cuartafase', async (req, res) => {
  try {
    const result = await pool.query('SELECT numerobastidor, subgrupos FROM cuartafase');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos de la cuarta fase');
  }
});

app.post('/cuartafase', async (req, res) => {
  const { numerobastidor, subgrupos } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO cuartafase (numerobastidor, subgrupos) VALUES ($1, $2) RETURNING *',
      [numerobastidor, subgrupos]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al añadir los datos de la cuarta fase');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

