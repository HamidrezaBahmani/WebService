// app.js
const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const database = require("./database");
const api = require("./api");
const { getConfig, getaxiosConfig } = require("./config");
const mssql = require("mssql");

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
const sqlServerConfig = {
  user: config.user,
  password: config.password,
  server: config.dbserver,
  database: config.database,
  options: {
    // encrypt: true, =>Use this option if connecting to Azure SQL Database
    trustServerCertificate: true,
  },
};
const pool = new mssql.ConnectionPool(sqlServerConfig);

// Define different table structures
const tableDefinitions = {
  //this recone as [tableName]
  Material_Stock_table: {
    name: "Material_Stock_table",
    columns: `
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
    created_at DATETIME DEFAULT GETDATE(),
  `,
    Primarykeys: ["matnr", "werks", "lgort", "lfgja"],
    apiUrl: process.env.API_URL,
    cronSchedule: "*/1 * * * *",
  },
  // Add more table structures and API URLs as needed
};
Object.keys(tableDefinitions).forEach(async (tableName) => {
  const cronSchedule =
    tableDefinitions[tableName].cronSchedule || "*/2 * * * *";

  cron.schedule(cronSchedule, async () => {
    let poolConnect;
    let tableDefinition;
    let data;

    try {
      poolConnect = await pool.connect();
      tableDefinition = tableDefinitions[tableName];

      console.log(typeof tableDefinition.columns, tableDefinition.columns);
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
