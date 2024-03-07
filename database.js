// database.js
const mysql = require("mysql");

function createTable(connection, tableDefinition) {
  connection.query(tableDefinition, (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
      connection.release();
    }
  });
}

function insertData(connection, tableName, data) {
  const columns = Object.keys(data[0]);
  const primaryKeyColumns = ["matnr", "werks", "lgort", "lfgja"];

  const insertValues = data.map((item) => Object.values(item));
  const insertQuery = `INSERT INTO your_table (${columns.join(
    ", "
  )}) VALUES ? ON DUPLICATE KEY UPDATE ${primaryKeyColumns
    .map((column) => `${column} = VALUES(${column})`)
    .join(", ")}`;

  const updateValues = data.map((item) => {
    return primaryKeyColumns.map((column) => item[column]).flat();
  });

  connection.query(insertQuery, [insertValues, updateValues], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err.message);
      connection.release();
    } else {
      console.log(
        `[${new Date().toLocaleString()}] Data inserted or updated successfully. `
      );

      connection.release();
    }
  });
}

module.exports = {
  createTable,
  insertData,
  // Add other database-related functions as needed
};
