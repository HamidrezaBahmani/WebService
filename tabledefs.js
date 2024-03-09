const tableDef = {
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
    apiUrl:
      "https://172.18.112.17:8444/sap/bc/zweb_stocks?sap-client=200&&werks=2301",
    cronSchedule: "*/1 * * * *",
  },
  // Add more table structures and API URLs as needed
};

module.exports = tableDef;
