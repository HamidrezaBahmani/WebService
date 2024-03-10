// database.js
const mssql = require("mssql");

async function createTable(connection, tableDefinition) {
  try {
    const request = new mssql.Request(connection);
    const query = `IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${tableDefinition.name}')
                   CREATE TABLE [${tableDefinition.name}] (${tableDefinition.columns})`;

    await request.query(query);

    console.log(`Table ${tableDefinition.name} is exist now.`);
  } catch (error) {
    console.error("Error creating table:", error.message);
  }
}

async function insertData(
  connection,
  tableName,
  data,
  PriKeyCol,
  batchSize = 100
) {
  // Split data into batches
  const batches = [];
  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize));
  }

  // Process batches
  for (const batch of batches) {
    await insertBatch(connection, tableName, batch, PriKeyCol);
  }
}

async function insertBatch(connection, tableName, data, PriKeyCol) {
  const columns = Object.keys(data[0]);

  const primaryKeyColumns = PriKeyCol;

  const insertValues = data.map((item) =>
    Object.values(item).map((value) =>
      typeof value === "string" ? `'${value}'` : value
    )
  );
  const insertQuery = `
    MERGE INTO ${tableName} AS target
    USING (VALUES ${insertValues
      .map((values) => `(${values.join(", ")})`)
      .join(", ")})
        AS source (${columns.join(", ")})
    ON ${primaryKeyColumns
      .map((column) => `target.${column} = source.${column}`)
      .join(" AND ")}
    WHEN MATCHED THEN
        UPDATE SET ${columns
          .filter((column) => !primaryKeyColumns.includes(column))
          .map((column) => `target.${column} = source.${column}`)
          .join(", ")}
    WHEN NOT MATCHED THEN
        INSERT (${columns.join(", ")})
        VALUES (${columns.map((column) => `source.${column}`).join(", ")});`;

  try {
    const request = new mssql.Request(connection);
    await request.query(insertQuery);

    console.log(
      `[${new Date().toLocaleString()}] Data chunk inserted or updated successfully to ${tableName}.`
    );
  } catch (error) {
    console.error(
      `Error inserting data chunk. Duplicate key values: ${primaryKeyColumns
        .map((column) => `${column}=${data[0][column]}`)
        .join(", ")}`,
      error.message
    );
  }
}

module.exports = {
  createTable,
  insertData,
  insertBatch,
  // Add other database-related functions as needed
};
