const express = require("express");
const sql = require("mssql");

const app = express();
const PORT = 3000;

const conexiones = {
  SanJose: {
    user: "sa",
    password: "Admin1234*",
    database: "master",
    server: "localhost",
    port: 1534,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      quotedIdentifiers: true
    }
  },

  Limon: {
    user: "sa",
    password: "Admin1234*",
    database: "master",
    server: "localhost",
    port: 1535,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      quotedIdentifiers: true
    }
  },

  Corp: {
    user: "sa",
    password: "Admin1234*",
    database: "master",
    server: "localhost",
    port: 1536,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      quotedIdentifiers: true
    }
  }
};

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});