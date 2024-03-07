// config.js
const dotenv = require("dotenv");
const https = require("https");

dotenv.config();

const getConfig = () => {
  return {
    apiUrl: process.env.API_URL,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  };
};

const getaxiosConfig = () => {
  const axiosConfig = {
    auth: {
      username: process.env.API_USERNAME,
      password: process.env.API_PASSWORD,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  };
  return axiosConfig;
};

module.exports = { getConfig, getaxiosConfig };
