/**
 * Módulo principal de Express.
 * @requires npm install express
 */
const express = require('express');

/**
 * Middleware para permitir solicitudes CORS.
 * @requires npm install cors
 */
const cors = require('cors');

/**
 * Middleware para parsear el cuerpo de las solicitudes.
 * @requires npm install body-parser
 */
const bodyParser = require('body-parser');

/**
 * Módulo de PostgreSQL para manejar la base de datos.
 * @requires npm install pg
 */
const { Pool } = require('pg');

/**
 * Módulo para la generación de documentos PDF.
 * @requires npm install pdfkit
 */
const PDFDocument = require('pdfkit');

/**
 * Módulo para el cifrado de contraseñas.
 * @requires npm install bcrypt
 */
const bcrypt = require('bcrypt');

/**
 * Módulo para interactuar con el sistema de archivos.
 * (No necesita instalación, es un módulo nativo de Node.js)
 */
const fs = require('fs');

/**
 * Inicializa la aplicación Express.
 */
const app = express();

/**
 * Puerto en el que se ejecuta la aplicación.
 */
const port = 3000;

/**
 * Módulo uuid para generar identificadores únicos.
 * @requires npm install uuid
 */
const { v4: uuidv4 } = require('uuid'); // Usar la librería uuid para generar identificadores únicos


/**
 * Configuración del pool de conexiones a la base de datos PostgreSQL.
 */
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'itvdb',
  password: 'Calasparra',
  port: 5432,
});

app.use(cors());
app.use(express.json());
/** 
 * Middleware para parsear el cuerpo de las solicitudes como JSON.
 */
app.use(bodyParser.json());

/**
 * Ruta para obtener todos los vehículos.
 * @name get/vehiculos
 * @function
 * @memberof module:app
 * @inner
 * @param {Request} req - Objeto de solicitud.
 * @param {Response} res - Objeto de respuesta.
 */
app.get('/vehiculos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehiculos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los vehículos');
  }
});

// Ruta para obtener vehículos listos para inspección
app.get('/vehiculos/listos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM vehiculos v
      WHERE NOT EXISTS (SELECT 1 FROM primerafase p WHERE p.numerobastidor = v.numerobastidor)
      OR NOT EXISTS (SELECT 1 FROM segundafase s WHERE s.numerobastidor = v.numerobastidor)
      OR NOT EXISTS (SELECT 1 FROM tercerafase t WHERE t.numerobastidor = v.numerobastidor)
      OR NOT EXISTS (SELECT 1 FROM cuartafase c WHERE c.numerobastidor = v.numerobastidor)
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener vehículos listos para inspección:', error);
    res.status(500).json({ error: 'Error al obtener vehículos listos para inspección' });
  }
});

// Ruta para obtener vehículos inspeccionados
app.get('/vehiculos/inspeccionados', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM vehiculos v
      WHERE EXISTS (SELECT 1 FROM primerafase p WHERE p.numerobastidor = v.numerobastidor)
      AND EXISTS (SELECT 1 FROM segundafase s WHERE s.numerobastidor = v.numerobastidor)
      AND EXISTS (SELECT 1 FROM tercerafase t WHERE t.numerobastidor = v.numerobastidor)
      AND EXISTS (SELECT 1 FROM cuartafase c WHERE c.numerobastidor = v.numerobastidor)
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener vehículos inspeccionados:', error);
    res.status(500).json({ error: 'Error al obtener vehículos inspeccionados' });
  }
});


/**
 * Ruta para obtener todos los datos de la tabla login.
 * @name get/login
 * @function
 * @memberof module:app
 * @inner
 * @param {Request} req - Objeto de solicitud.
 * @param {Response} res - Objeto de respuesta.
 */
app.get('/login', async (req, res) => {
  try {
    // Consulta para obtener todos los datos de la tabla login
    const result = await pool.query('SELECT * FROM login');
    // Enviar los datos como respuesta
    res.json(result.rows);
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

/**
 * Ruta para obtener los datos de un cliente por ID.
 * @name get/clientes/:id
 * @function
 * @memberof module:app
 * @inner
 * @param {Request} req - Objeto de solicitud.
 * @param {Response} res - Objeto de respuesta.
 */
app.get('/clientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Consulta SQL para obtener datos de usuario por nombre de usuario
    const query = await pool.query(`SELECT * FROM clientes WHERE clienteid = '${id}'`);
    // Verificar si se obtuvieron resultados de la consulta
    if (query && query.rows.length > 0) {
      res.json(query.rows[0]);// Devuelve el primer resultado
    } else {
      res.status(404).json({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: 'Error de servidor' });
  }
});

/**
 * Ruta para obtener los vehículos de un cliente por ID de cliente.
 * @name get/vehiculos/:id
 * @function
 * @memberof module:app
 * @inner
 * @param {Request} req - Objeto de solicitud.
 * @param {Response} res - Objeto de respuesta.
 */
app.get('/vehiculos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Consulta SQL para obtener datos de usuario por nombre de usuario
    const query = await pool.query(`SELECT * FROM vehiculos WHERE clienteid = '${id}'`);
    // Verificar si se obtuvieron resultados de la consulta
    if (query && query.rows.length > 0) {
      res.json(query.rows);// Devuelve todos los vehiculos con es id
    } else {
      res.status(404).json({ message: "Este cliente no tiene vehículos" });
    }
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: 'Error de servidor' });
  }
});


// Ruta para buscar usuarios por nombre de usuario
app.get('/login/:usuario', async (req, res) => {
  const { usuario } = req.params;

  try {
    // Consulta SQL para obtener datos de usuario por nombre de usuario
    const query = await pool.query(`SELECT clienteid,rol FROM login WHERE usuario = '${usuario}'`);

    // Verificar si se obtuvieron resultados de la consulta
    if (query && query.rows.length > 0) {
      res.json(query.rows[0]); // Devuelve el primer resultado
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: 'Error de servidor' });
  }
});



// Endpoint para la autenticación
app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    // Consulta para buscar el usuario en la base de datos
    const result = await pool.query('SELECT * FROM login WHERE usuario = $1', [usuario]);

    if (result.rowCount > 0) {
      const user = result.rows[0];
      
      // Comparar la contraseña proporcionada con la contraseña encriptada
      const match = await bcrypt.compare(contraseña, user.contraseña);

      if (match) {
        // Si las contraseñas coinciden, enviar respuesta exitosa
        res.json({ success: true });
      } else {
        // Si las contraseñas no coinciden, enviar mensaje de error
        res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        
      }
    } else {
      // Si no se encuentra el usuario, enviar mensaje de error
      res.status(401).json({ success: false, message: 'Usuario no existe en la base de datos' });
    }
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});


// Comprueba si el usuario ya existe en mi base de datos para el registro
app.post('/login1', async (req, res) => {
  const { usuario } = req.body;

  try {
    // Consulta para buscar el usuario en la base de datos
    const result = await pool.query('SELECT * FROM login WHERE usuario = $1', [usuario]);

    // Si se encuentra el usuario, enviar respuesta con false (ya que existe)
    if (result.rowCount > 0) {
      res.json({ success: false });
    } else {
      // Si no se encuentra el usuario, enviar respuesta con true (no existe)
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

//comprueba que los datos dni,corre y numero no existan en la base para el registro
app.post('/clientes', async (req, res) => {
  const { numero_telefono, dni, correo_electronico } = req.body;

  try {
    // Consulta para buscar si el DNI ya está en la base de datos
    const dniResult = await pool.query('SELECT * FROM clientes WHERE dni = $1', [dni]);
    if (dniResult.rowCount > 0) {
      return res.json({ success: false, message: 'El DNI ya ha sido registrado' });
    }

    // Consulta para buscar si el correo electrónico ya está en la base de datos
    const correoResult = await pool.query('SELECT * FROM clientes WHERE correo_electronico = $1', [correo_electronico]);
    if (correoResult.rowCount > 0) {
      return res.json({ success: false, message: 'El correo electrónico ya está registrado' });
    }

    // Consulta para buscar si el número de teléfono ya está en la base de datos
    const telefonoResult = await pool.query('SELECT * FROM clientes WHERE numero_telefono = $1', [numero_telefono]);
    if (telefonoResult.rowCount > 0) {
      return res.json({ success: false, message: 'El número de teléfono ya ha sido usado en otra cuenta' });
    }

    // Si ninguno de los datos está en la base de datos, enviar respuesta exitosa
    res.json({ success: true });
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});
//para insertar clientes en el registro
app.post('/clientes2', async (req, res) => {
  try {
    const { nombre, apellidos, fechaNacimiento, telefono, dni, direccion, email } = req.body;

    const sql = 'INSERT INTO clientes (nombre, apellidos, fecha_nacimiento, numero_telefono, dni, direccion, correo_electronico) VALUES ($1,$2,$3, $4, $5, $6, $7) RETURNING clienteid';
    const result = await pool.query(sql, [nombre, apellidos, fechaNacimiento, telefono, dni, direccion, email]);

    // Obtener el clienteid generado
    const clienteid = result.rows[0].clienteid;

    // Enviar respuesta de éxito con el clienteid
    res.json({ success: true, message: 'Cliente insertado correctamente', clienteid });
  } catch (error) {
    console.error('Error al insertar cliente:', error);
    res.status(500).json({ success: false, message: 'Error al insertar cliente' });
  }
});


// Endpoint para la inserción de usuarios en la tabla de login
app.post('/login2', async (req, res) => {
  try {
    const { usuario, contraseña, clienteid } = req.body;

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contraseña, 10);
  

    const sql = 'INSERT INTO login (usuario, contraseña, clienteid) VALUES ($1,$2,$3)';
    await pool.query(sql, [usuario, hashedPassword, clienteid]);

    // Enviar respuesta de éxito
    res.json({ success: true, message: 'Usuario insertado correctamente en la tabla de login' });
  } catch (error) {
    console.error('Error al insertar usuario en la tabla de login:', error);
    res.status(500).json({ success: false, message: 'Error al insertar usuario en la tabla de login' });
  }
});


// PRIMERA FASE

app.get('/primerafase/:numerobastidor', async (req, res) => {
  const { numerobastidor } = req.params;
  try {
    const result = await pool.query('SELECT * FROM primerafase WHERE numerobastidor = $1', [numerobastidor]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Datos no encontrados' });
    }
  } catch (error) {
    console.error('Error al obtener datos de primerafase:', error);
    res.status(500).json({ error: 'Error al obtener datos de primerafase' });
  }
});

app.get('/primerafase', async (req, res) => {
  try {
    const result = await pool.query('SELECT numerobastidor, km, fecha, subgrupos,vehiculoid FROM primerafase');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos de la primera fase');
  }
});

app.post('/primerafase', async (req, res) => {
  const { numerobastidor, km, fecha, subgrupos } = req.body;
  
  try {
 // Buscar el vehiculoid en la tabla vehiculos
 const vehiculoResult = await pool.query(
  'SELECT vehiculoid FROM vehiculos WHERE numerobastidor = $1',
  [numerobastidor]
);

if (vehiculoResult.rows.length === 0) {
  // Si no se encuentra el numerobastidor, devolver un error
  res.status(404).send('No se encontró el vehículo con el número de bastidor proporcionado');
  return;
}
const vehiculoid = vehiculoResult.rows[0].vehiculoid;
    const result = await pool.query(
      'INSERT INTO primerafase (numerobastidor, km, fecha, subgrupos,vehiculoid) VALUES ($1, $2, $3, $4,$5) RETURNING *',
      [numerobastidor, km, fecha, subgrupos,vehiculoid]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al añadir los datos de la primera fase');
  }
});

// SEGUNDA FASE

app.get('/segundafase/:numerobastidor', async (req, res) => {
  const { numerobastidor } = req.params;
  try {
    const result = await pool.query('SELECT * FROM segundafase WHERE numerobastidor = $1', [numerobastidor]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Datos no encontrados' });
    }
  } catch (error) {
    console.error('Error al obtener datos de primerafase:', error);
    res.status(500).json({ error: 'Error al obtener datos de segundafase' });
  }
});

app.get('/segundafase', async (req, res) => {
  try {
    const result = await pool.query('SELECT numerobastidor, combustible, emisiones, subgrupos ,vehiculoid FROM segundafase');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos de la segunda fase');
  }
});

app.post('/segundafase', async (req, res) => {
  const { numerobastidor, combustible, emisiones, subgrupos } = req.body;

  try {
// Buscar el vehiculoid en la tabla vehiculos
const vehiculoResult = await pool.query(
  'SELECT vehiculoid FROM vehiculos WHERE numerobastidor = $1',
  [numerobastidor]
);

if (vehiculoResult.rows.length === 0) {
  // Si no se encuentra el numerobastidor, devolver un error
  res.status(404).send('No se encontró el vehículo con el número de bastidor proporcionado');
  return;
}
const vehiculoid = vehiculoResult.rows[0].vehiculoid;

    const result = await pool.query(
      'INSERT INTO segundafase (numerobastidor, combustible, emisiones, subgrupos,vehiculoid) VALUES ($1, $2, $3, $4,$5) RETURNING *',
      [numerobastidor, combustible, emisiones, subgrupos,vehiculoid]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al añadir los datos de la segunda fase');
  }
});

// TERCERA FASE

app.get('/tercerafase/:numerobastidor', async (req, res) => {
  const { numerobastidor } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tercerafase WHERE numerobastidor = $1', [numerobastidor]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Datos no encontrados' });
    }
  } catch (error) {
    console.error('Error al obtener datos de primerafase:', error);
    res.status(500).json({ error: 'Error al obtener datos de primerafase' });
  }
});

app.get('/tercerafase', async (req, res) => {
  try {
    const result = await pool.query('SELECT numerobastidor, freno_delantero, freno_trasero, subgrupos,vehiculoid FROM tercerafase');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos de la tercera fase');
  }
});

app.post('/tercerafase', async (req, res) => {
  const { numerobastidor, freno_delantero, freno_trasero, subgrupos } = req.body;

  try {
 // Buscar el vehiculoid en la tabla vehiculos
 const vehiculoResult = await pool.query(
  'SELECT vehiculoid FROM vehiculos WHERE numerobastidor = $1',
  [numerobastidor]
);

if (vehiculoResult.rows.length === 0) {
  // Si no se encuentra el numerobastidor, devolver un error
  res.status(404).send('No se encontró el vehículo con el número de bastidor proporcionado');
  return;
}
const vehiculoid = vehiculoResult.rows[0].vehiculoid;

    const result = await pool.query(
      'INSERT INTO tercerafase (numerobastidor, freno_delantero, freno_trasero, subgrupos,vehiculoid) VALUES ($1, $2, $3, $4,$5) RETURNING *',
      [numerobastidor, freno_delantero, freno_trasero, subgrupos,vehiculoid]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al añadir los datos de la tercera fase');
  }
});

// CUARTA FASE

app.get('/tercerafase/:numerobastidor', async (req, res) => {
  const { numerobastidor } = req.params;
  try {
    const result = await pool.query('SELECT * FROM cuartafase WHERE numerobastidor = $1', [numerobastidor]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Datos no encontrados' });
    }
  } catch (error) {
    console.error('Error al obtener datos de primerafase:', error);
    res.status(500).json({ error: 'Error al obtener datos de primerafase' });
  }
});

app.get('/cuartafase', async (req, res) => {
  try {
    const result = await pool.query('SELECT numerobastidor, subgrupos,vehiculoid FROM cuartafase');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos de la cuarta fase');
  }
});

app.post('/cuartafase', async (req, res) => {
  const { numerobastidor, subgrupos } = req.body;

  try {
 // Buscar el vehiculoid en la tabla vehiculos
 const vehiculoResult = await pool.query(
  'SELECT vehiculoid FROM vehiculos WHERE numerobastidor = $1',
  [numerobastidor]
);

if (vehiculoResult.rows.length === 0) {
  // Si no se encuentra el numerobastidor, devolver un error
  res.status(404).send('No se encontró el vehículo con el número de bastidor proporcionado');
  return;
}
const vehiculoid = vehiculoResult.rows[0].vehiculoid;

    const result = await pool.query(
      'INSERT INTO cuartafase (numerobastidor, subgrupos,vehiculoid) VALUES ($1, $2,$3) RETURNING *',
      [numerobastidor, subgrupos,vehiculoid]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al añadir los datos de la cuarta fase');
  }
});

//GENERAR PDF
app.post('/generatepdf/:numerobastidor', async (req, res) => {
  const { numerobastidor } = req.params;

  try {
    // Obtener datos de la tabla vehiculos
    console.log('Obteniendo datos de la tabla vehiculos...');
    const vehiculosResult = await pool.query('SELECT numerobastidor, marca, modelo, tara, medidaneumaticos, dimensiones, combustible, normativaeuro, aniofabricacion FROM vehiculos WHERE numerobastidor = $1', [numerobastidor]);
    const vehiculosData = vehiculosResult.rows[0];

    if (!vehiculosData) {
      return res.status(404).json({ message: "Datos de vehículo no encontrados" });
    }

    // Obtener datos de las fases de inspección
    console.log('Obteniendo datos de la base de datos...');
    const resultPrimerafase = await pool.query('SELECT numerobastidor, km, subgrupos::jsonb FROM primerafase WHERE numerobastidor = $1 ', [numerobastidor]);
    const resultSegundafase = await pool.query('SELECT emisiones, subgrupos::jsonb FROM segundafase WHERE numerobastidor = $1', [numerobastidor]);
    const resultTercerafase = await pool.query('SELECT freno_delantero, freno_trasero, subgrupos::jsonb FROM tercerafase WHERE numerobastidor = $1', [numerobastidor]);
    const resultCuartafase = await pool.query('SELECT subgrupos::jsonb FROM cuartafase WHERE numerobastidor = $1', [numerobastidor]);

    const dataPrimerafase = resultPrimerafase.rows[0];
    const dataSegundafase = resultSegundafase.rows[0];
    const dataTercerafase = resultTercerafase.rows[0];
    const dataCuartafase = resultCuartafase.rows[0];

    if (!dataPrimerafase || !dataSegundafase || !dataTercerafase || !dataCuartafase) {
      return res.status(404).json({ message: "Datos no encontrados" });
    }

    const subgruposPrimerafase = dataPrimerafase.subgrupos.subgrupos;
    const subgruposSegundafase = dataSegundafase.subgrupos.subgrupos;
    const subgruposTercerafase = dataTercerafase.subgrupos.subgrupos;
    const subgruposCuartafase = dataCuartafase.subgrupos.subgrupos;

    // Crear el PDF
    console.log('Generando PDF...');
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const uniqueFileName = `inspeccion_${numerobastidor}_${uuidv4()}.pdf`; // Generar nombre de archivo único
    const filePath = `./${uniqueFileName}`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Encabezado del informe
    doc.fontSize(14).text('INFORME DE INSPECCIÓN TÉCNICA DE VEHÍCULOS', { align: 'center', underline: true });
    doc.moveDown();

    // Datos del vehículo en recuadros
    doc.fontSize(10);
    const vehicleData = [
      { label: 'Número de Bastidor', value: vehiculosData.numerobastidor },
      { label: 'Marca', value: vehiculosData.marca },
      { label: 'Modelo', value: vehiculosData.modelo },
      { label: 'Tara', value: vehiculosData.tara },
      { label: 'Medida de Neumáticos', value: vehiculosData.medidaneumaticos },
      { label: 'Dimensiones', value: vehiculosData.dimensiones },
      { label: 'Combustible', value: vehiculosData.combustible },
      { label: 'Normativa Euro', value: vehiculosData.normativaeuro },
      { label: 'Año de Fabricación', value: vehiculosData.aniofabricacion },
      { label: 'Kilometraje', value: dataPrimerafase.km }
    ];

    const tableTop = doc.y;
    const itemHeight = 15;
    const col1Width = 200;
    const col2Width = 250;

    vehicleData.forEach((data, index) => {
      const y = tableTop + index * itemHeight;
      doc.rect(50, y, col1Width, itemHeight).stroke();
      doc.text(data.label, 55, y + 5);

      doc.rect(50 + col1Width, y, col2Width, itemHeight).stroke();
      doc.text(data.value, 55 + col1Width, y + 5);
    });

    doc.moveDown(2);

    // Función para dibujar una tabla
    const drawTable = (subgrupos, isFirstTable = false) => {
      const startX = 75; // Ajuste para centrar las tablas
      const col1Width = 300;
      const col2Width = 100;
      const itemHeight = 12;

      if (isFirstTable) {
        // Títulos de columnas
        const headerHeight = 18;  // Incrementar altura del encabezado
        const headerTop = doc.y;

        doc.fontSize(12).text('Grupo de Inspección', startX, headerTop + 5, { width: col1Width, align: 'center' });
        doc.rect(startX, headerTop, col1Width, headerHeight).stroke();

        doc.text('Defecto', startX + col1Width, headerTop + 5, { width: col2Width, align: 'center' });
        doc.rect(startX + col1Width, headerTop, col2Width, headerHeight).stroke();

        doc.moveDown(1.5); // Mueve el cursor del texto después del encabezado
      }

      doc.fontSize(10);

      // Rows
      let y = doc.y;
      subgrupos.forEach((subgrupo, index) => {
        // Agregar una nueva página si se necesita más espacio
        if (y + itemHeight > doc.page.height - 50) {
          doc.addPage({ size: 'A4', margin: 50 });
          y = 50;
        }

        doc.rect(startX, y, col1Width, itemHeight).stroke();
        doc.text(subgrupo.nombre, startX + 5, y + 2, { width: col1Width - 10 });

        doc.rect(startX + col1Width, y, col2Width, itemHeight).stroke();
        doc.text(subgrupo.defecto, startX + col1Width + 5, y + 2, { width: col2Width - 10 });

        y += itemHeight;
      });

      // Mover hacia abajo para evitar encabezado muerto
      doc.moveDown(2);
    };

    // Dibujar las tablas de las diferentes fases
    drawTable(subgruposPrimerafase, true);
    drawTable(subgruposSegundafase);
    drawTable(subgruposTercerafase);
    drawTable(subgruposCuartafase);

    // Evaluar resultado de la inspección
    const todasInspecciones = [
      ...subgruposPrimerafase,
      ...subgruposSegundafase,
      ...subgruposTercerafase,
      ...subgruposCuartafase
    ];

    let resultadoInspeccion = 'Favorable';

    todasInspecciones.forEach(subgrupo => {
      if (subgrupo.defecto === 'muy grave') {
        resultadoInspeccion = 'Negativa';
      } else if (subgrupo.defecto === 'grave' && resultadoInspeccion !== 'Negativa') {
        resultadoInspeccion = 'Desfavorable';
      }
    });

    // Resultados de la inspección
    doc.fontSize(12).text('Resultados de la Inspección', { underline: true });
    doc.text(`Emisiones: ${dataSegundafase.emisiones}`);
    doc.text(`Freno Delantero: ${dataTercerafase.freno_delantero}`);
    doc.text(`Freno Trasero: ${dataTercerafase.freno_trasero}`);
    doc.moveDown();
    doc.text(`Resultado: ${resultadoInspeccion}`, { align: 'center' });
    doc.end();

    stream.on('finish', () => {
      res.download(filePath, (err) => {
        if (err) {
          console.error('Error al descargar el archivo:', err);
          res.status(500).send('Error al descargar el archivo');
        }
      });
    });

  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).json({ error: 'Error de servidor' });
  }
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
