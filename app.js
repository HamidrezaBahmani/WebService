const express = require("express");
const mysql = require("mysql");
const axios = require("axios");
const https = require("https");
const cron = require("node-cron");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Default values for environment variables
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 0;

const axiosConfig = {
  auth: {
    username: process.env.API_USERNAME,
    password: process.env.API_PASSWORD,
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
};

const mysqlConfig = {
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const pool = mysql.createPool(mysqlConfig);

const tableDefinition = `
    CREATE TABLE IF NOT EXISTS your_table (
        matnr VARCHAR(255) PRIMARY KEY,
        werks VARCHAR(255),
        lgort VARCHAR(255),
        lfgja VARCHAR(4),
        lfmon VARCHAR(2),
        labst VARCHAR(10),
        umlme VARCHAR(10),
        insme VARCHAR(10),
        einme VARCHAR(10),
        speme VARCHAR(10),
        retme VARCHAR(10)
    );
`;

const apiUrl = process.env.API_URL;

function createTable(connection) {
  connection.query(tableDefinition, (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
      connection.release();
    }
  });
}

function insertData(connection, data) {
  const columns = Object.keys(data[0]);
  const placeholders = columns.map(() => "?").join(", ");

  const insertQuery = `INSERT INTO your_table (${columns.join(
    ", "
  )}) VALUES ${data
    .map(() => `(${placeholders})`)
    .join(", ")} ON DUPLICATE KEY UPDATE ${columns
    .slice(1)
    .map((column) => `${column} = VALUES(${column})`)
    .join(", ")}`;

  const insertValues = data.map((item) => Object.values(item)).flat();

  connection.query(insertQuery, insertValues, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err.message);
    } else {
      console.log(
        `[${new Date().toISOString()}] Data inserted or updated successfully. ${
          result.affectedRows
        } rows affected.`
      );
    }

    connection.release();
  });
}

function fetchDataAndInsert(connection) {
  axios
    .get(apiUrl, axiosConfig)
    .then((response) => {
      const validJsonString = response.data.replace(
        /([{,])(\s*)([a-zA-Z0-9_\-]+?)\s*:/g,
        '$1"$3":'
      );
      const data = JSON.parse(validJsonString);

      createTable(connection);
      insertData(connection, data);
    })
    .catch((error) => {
      console.error(
        `[${new Date().toISOString()}] Error fetching data from API:`,
        error.message
      );
      connection.release();
    });
}

function reciveAllData() {
  console.log(`[${new Date().toISOString()}] Job start`);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(
        `[${new Date().toISOString()}] Error acquiring connection from pool:`,
        err.message
      );
      return;
    }

    fetchDataAndInsert(connection);
  });
}

cron.schedule("*/5 * * * *", reciveAllData);

app.listen(port, () =>
  console.log(
    `[${new Date().toISOString()}] App is running on http://${host}:${port}`
  )
);
