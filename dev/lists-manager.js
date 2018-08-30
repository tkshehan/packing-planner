const {listsData} = require('./mock-data');

function loadManager() {
  $('main').empty();
  getAndDisplayLists();
}

function getAndDisplayLists() {
  getLists().then(displayLists);
}

function getLists() {
  return new Promise((resolve, reject) => {
    resolve(listsData);
  });
}

function displayLists(lists) {
  let table = $('<table>').addClass('js-table');
  table.append(`
    <tr>
      <th> Name </td>
      <th> Items </td>
    </tr>
  `);
  lists.forEach((list) => {
    let newRow = `
    <tr>
      <td> ${list.name} </td>
      <td> ${list.packedAmount} / ${list.amount} </td>
    </tr>`;
    table.append(newRow);
    console.log('new row added');
  });
  $('main').append(table);
};

module.exports = {loadManager}