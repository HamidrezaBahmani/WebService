// app.js
const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const database = require("./database");
const api = require("./api");
const { getConfig, getaxiosConfig } = require("./config");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const config = getConfig();
const axiosConfig = getaxiosConfig();

// Default values for environment variables
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 0;

// Your existing MySQL pool configuration...
const mysqlConfig = {
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
};
const pool = mysql.createPool(mysqlConfig);

// Define different table structures
const tableDefinitions = {
  your_table: {
    structure: `
      CREATE TABLE IF NOT EXISTS your_table (
        matnr VARCHAR(255),
        werks VARCHAR(255),
        lgort VARCHAR(255),
        lfgja VARCHAR(4),
        lfmon VARCHAR(2),
        labst VARCHAR(10),
        umlme VARCHAR(10),
        insme VARCHAR(10),
        einme VARCHAR(10),
        speme VARCHAR(10),
        retme VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (matnr, werks, lgort, lfgja)
      );
    `,
    apiUrl: process.env.API_URL,
  },
  // Add more table structures and API URLs as needed
};

Object.keys(tableDefinitions).forEach((tableName) => {
  cron.schedule("*/2 * * * *", async () => {
    try {
      let connection;
      connection = await new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
          if (err) {
            reject(err);
          } else {
            resolve(conn);
          }
        });
      });

      const tableDefinition = tableDefinitions[tableName];

      await database.createTable(connection, tableDefinition.structure);
      const data = await api.fetchData(tableDefinition.apiUrl, axiosConfig);
      await database.insertData(connection, tableName, data);
    } catch (error) {
      console.error(`Error in cron job for ${tableName}:`, error.message);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  });
});

// Other routes and configurations...

app.listen(port, () => {
  console.log(`App is running on http://${host}:${port}`);
});
