const {packingData} = require('./mock-data');

function loadPlanner(id) {
  getAndDisplayData(id);
}

function getAndDisplayData(id) {
  getData(id).then(displayData);
}

function getData(id) {
  return new Promise((resolve, reject) => {
    resolve(packingData);
  });
}

function displayData(data) {
  console.log(data);
}

module.exports = {loadPlanner};