const tableDef = {
  MaterialStock_table: {
    name: "MaterialStock_table",
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
      PRIMARY KEY (matnr,werks,lgort,lfgja)
    `,
    Primarykeys: ["matnr", "werks", "lgort", "lfgja"],
    apiUrl:
      "https://172.18.112.17:8444/sap/bc/zweb_stocks?sap-client=200&&werks=2301",
    cronSchedule: "*/1 * * * *",
  },
  BOM_table: {
    name: "BOM_table",
    columns: `
      crmatnr VARCHAR(255),
      crmaktx VARCHAR(255),
      matnr VARCHAR(255),
      mmein VARCHAR(255),
      objek VARCHAR(255),
      maktx VARCHAR(255),
      ewahr VARCHAR(255),
      altmatnr VARCHAR(255),
      mngko VARCHAR(255),
      idnlf VARCHAR(255),
      name1 VARCHAR(255),
      atwrt VARCHAR(255),
      prvbe VARCHAR(255),
      created_at DATETIME DEFAULT GETDATE(),
      PRIMARY KEY (matnr,crmatnr,crmaktx)
    `,

    Primarykeys: ["matnr", "crmatnr", "crmaktx"],
    apiUrl: "https://172.18.112.17:8444/sap/bc/zikk_bom?sap-client=200", // Add your API URL here
    cronSchedule: "*/2 * * * *",
  },
  MaterialServiceList_table: {
    name: "MaterialServiceList_table",
    columns: `
      matnr VARCHAR(255) PRIMARY KEY,
      maktx VARCHAR(255),
      type VARCHAR(1),
      created_at DATETIME DEFAULT GETDATE(),
      PRIMARY KEY (matnr)
    `,
    Primarykeys: ["matnr"],
    apiUrl: "https://172.18.112.17:8444/sap/bc/zikk_mat_list?sap-client=200", // Add your API URL here
    cronSchedule: "*/3 * * * *",
  },
  UserAsset_table: {
    name: "UserAsset_table",
    columns: `
      anln1 VARCHAR(255),
      bukrs VARCHAR(255),
      anlkl VARCHAR(255),
      aenam VARCHAR(255),
      erdat VARCHAR(8),
      aedat VARCHAR(8),
      xspeb VARCHAR(255),
      zujhr VARCHAR(4),
      aktiv VARCHAR(8),
      abgdt VARCHAR(8),
      deakt VARCHAR(8),
      ord41 VARCHAR(255),
      ord42 VARCHAR(255),
      ord43 VARCHAR(255),
      ord44 VARCHAR(255),
      herst VARCHAR(255),
      aibn1 VARCHAR(255),
      eaufn VARCHAR(255),
      typbz VARCHAR(255),
      invzu VARCHAR(255),
      invnr VARCHAR(255),
      txt50 VARCHAR(255),
      gdlgrp VARCHAR(255),
      sernr VARCHAR(255),
      anlhtxt VARCHAR(255),
      bdatu VARCHAR(8),
      raumn VARCHAR(255),
      kfzkz VARCHAR(255),
      pernr VARCHAR(255),
      anln2 VARCHAR(4),
      spras VARCHAR(1),
      ltext VARCHAR(255),
      datbi VARCHAR(8),
      kostl VARCHAR(255),
      created_at DATETIME DEFAULT GETDATE(),
      PRIMARY KEY (anln1,anln2)
  
    `,
    Primarykeys: ["anln1", "anln2"],
    apiUrl:
      "https://172.18.112.17:8444/sap/bc/zikk_asset_list?sap-client=200&pernr=@pernr", // Add your API URL here
    cronSchedule: "*/4 * * * *",
  },
  Asset_Table: {
    name: "Asset_Table",
    columns: `
      anln1 VARCHAR(255),
      txt50 VARCHAR(255),
      deakt VARCHAR(8),
      bukrs VARCHAR(255),
      anln2 VARCHAR(4),
      anlhtxt VARCHAR(255),
      funtn VARCHAR(4),
      kostl VARCHAR(255),
      ltext VARCHAR(255),
      invnr VARCHAR(255),
      sernr VARCHAR(255),
      created_at DATETIME DEFAULT GETDATE(),
      PRIMARY KEY (anln1)
    `,
    Primarykeys: ["anln1"],
    apiUrl:
      "https://172.18.112.17:8444/sap/bc/zweb_asset_info?sap-client=200&COMPCO=2300", // Add your API URL here
    cronSchedule: "*/5 * * * *",
  },
  CstCntr_table: {
    name: "CstCntr_table",
    columns: `
      kostl VARCHAR(255),
      datbi VARCHAR(8),
      ktext VARCHAR(255),
      ltext VARCHAR(255),
      created_at DATETIME DEFAULT GETDATE(),
      PRIMARY KEY (kostl)
    `,
    Primarykeys: ["kostl"],
    apiUrl: "https://172.18.112.17:8444/sap/bc/zikk_costcenter?sap-client=200", // Add your API URL here
    cronSchedule: "*/6 * * * *",
  },

  // Add more table structures and API URLs as needed
};

module.exports = tableDef;
