// api.js
const axios = require("axios");

function fetchData(apiUrl, axiosConfig) {
  return axios.get(apiUrl, axiosConfig)
    .then((response) => {
      const validJsonString = response.data.replace(
        /([{,])(\s*)([a-zA-Z0-9_\-]+?)\s*:/g,
        '$1"$3":'
      );
      return JSON.parse(validJsonString);
    });
}

module.exports = {
  fetchData,
  // Add other API-related functions as needed
};
