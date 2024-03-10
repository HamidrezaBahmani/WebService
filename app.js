// app.js
const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const database = require("./database");
const api = require("./api");
const { getConfig, getaxiosConfig } = require("./config");
const mssql = require("mssql");
var tableDef = require("./tabledefs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const config = getConfig();
const axiosConfig = getaxiosConfig();

// Default values for environment variables
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 0;

// Your existing SQL Server pool configuration...

// Define different table structures
const tableDefinitions = tableDef;
Object.keys(tableDefinitions).forEach(async (tableName) => {
  const pool = new mssql.ConnectionPool(
    tableDefinitions[tableName].sqlServerConfig
  );
  const cronSchedule =
    tableDefinitions[tableName].cronSchedule || "*/2 * * * *";

  cron.schedule(cronSchedule, async () => {
    let poolConnect;
    let tableDefinition;
    let data;

    try {
      poolConnect = await pool.connect();
      tableDefinition = tableDefinitions[tableName];

      await database.createTable(poolConnect, tableDefinition);

      data = await api.fetchData(tableDefinition.apiUrl, axiosConfig);
      await database.insertData(
        poolConnect,
        tableName,
        data,
        tableDefinition.Primarykeys
      );
    } catch (error) {
      console.error(`Error in cron job for ${tableName}:`, error.message);
      console.error("SQL Statement:", tableDefinition.columns);
      console.error("Data:", data);
      console.error(`Error in cron job for ${tableName}:`, error.message);
    } finally {
      poolConnect.release(); // Release the connection in the finally block
    }
  });
});

// Other routes and configurations...

app.listen(port, () => {
  console.log(
    `App is running on http://${host}:${port} in ${new Date().toLocaleString()}`
  );
});
