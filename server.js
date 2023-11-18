const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tp46"
});

db.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log("Ya esta conectado");
  app.post('/data', (req, res) => {
    const { nombre, apellido, edad, estatura, codigo, movil, peso, email } = req.body;
    //insertando en la base de datos
    const sql = `INSERT INTO jugadores (nombre, apellido, edad, estatura, codigo, movil, peso, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [nombre, apellido, edad, estatura, codigo, movil, peso, email], (err, result) => {
      if (err) throw err;
    });

  });

  //borrando base de datos
  app.delete('/borrar', (req, res) => {

    const { id } = req.body;
    const sql = `DELETE FROM jugadores WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
    });
  });

  app.put('/modificar:id', (req, res) => {
    const { id } = req.params;
    // nombre, apellido, edad, estatura, codigo, movil, peso, email
    const { nuevoNombre, nuevoApellido, nuevaEdad, nuevaEstatura, nuevoCodigo, nuevoMovil, nuevoPeso, nuevoEmail } = req.body;

    console.log("Datos a actualizar:", { nuevoNombre, nuevoApellido, nuevaEdad, nuevaEstatura, nuevoCodigo, nuevoMovil, nuevoPeso, nuevoEmail });

    const sql = `UPDATE jugadores SET nombre = ?, apellido = ?, edad = ?, estatura = ?, codigo = ?, movil = ?, peso = ?, email = ? WHERE id = ?`;

    db.query(sql, [nuevoNombre, nuevoApellido, nuevaEdad, nuevaEstatura, nuevoCodigo, nuevoMovil, nuevoPeso, nuevoEmail, id], (err, result) => {

      if (err) throw err;

    });
  });

  app.get('/jugador:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM jugadores WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.json(result);
      }
    });
  });

  app.get('/todos', (req, res) => {
    const sql = `SELECT * FROM jugadores`;
    db.query(sql, (err, result) => {
      if (err) {
      } else {
        res.json(result);
      }
    });
  });

  app.get('/pesoyaltura', (req, res) => {
    const sql = `SELECT * FROM jugadores WHERE peso > 90 and estatura > 1.78`;
    db.query(sql, (err, result) => {
      if (err) {
      } else {
        res.json(result);
      }
    });
  });

  app.get('/marplatenses', (req, res) => {
    const sql = `SELECT * FROM jugadores WHERE codigo <> 7600 AND email LIKE '%gmail%';`;
    db.query(sql, (err, result) => {
      if (err) {
      } else {
        res.json(result);
      }
    });
  });

  app.get('/peso', (req, res) => {
    const sql = `SELECT * FROM jugadores ORDER BY peso DESC LIMIT 1;`;
    db.query(sql, (err, result) => {
      if (err) {
      } else {
        res.json(result);
      }
    });
  });

  app.get('/menores', (req, res) => {
    const sql = `SELECT * FROM jugadores WHERE edad = (SELECT MIN(edad) FROM jugadores);`;
    db.query(sql, (err, result) => {
      if (err) {
      } else {
        res.json(result);
      }
    });
  });

  app.get('/promedio', (req, res) => {
    const sql = `SELECT AVG(estatura) AS promedio_estatura FROM jugadores;`;
    db.query(sql, (err, result) => {
      if (err) {
      } else {
        res.json(result[0]);
      }
    });
  });


  app.get('/', (req, res) => {
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
      } else {
        res.send(data);
      }
    });
  });
});

app.listen(app.get('port'), () => {
  console.log('Servidor conectado');
})