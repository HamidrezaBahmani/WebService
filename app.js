// app.js
const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
const database = require("./database");
const api = require("./api");
const { getaxiosConfig } = require("./config");
const mssql = require("mssql");
var tableDef = require("./tabledefs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

  // Search for nodejs Cron job
  // 1-Minutes (0 - 59):
  // Denoted by the first field in the cron job syntax.
  // Example: 15 * * * * would execute the job at the 15th minute of every hour.

  // 2-Hours (0 - 23):
  // Denoted by the second field in the cron job syntax.
  // Example: 0 2 * * * would execute the job at 2:00 AM every day.

  // 3-Days of the month (1 - 31):
  // Denoted by the third field in the cron job syntax.
  // Example: 0 0 1 * * would execute the job at midnight on the 1st day of every month.

  // 4-Months (1 - 12 or names):
  // Denoted by the fourth field in the cron job syntax.
  // Example: 0 0 * 3 * would execute the job at midnight every day in March.

  // 5-Days of the week (0 - 6 or names, 0 or 7 is Sunday):
  // Denoted by the fifth field in the cron job syntax.
  // Example: 0 0 * * 5 would execute the job at midnight every Friday.

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
