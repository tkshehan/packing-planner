const {packingData} = require('./mock-data');


function loadPlanner(id) {
  buildPage();
  buildListeners();
  getAndDisplayData(id);
}

function buildPage() {
  $('main').empty();

  let $optionBar = buildOptionBar();
  let $tableSection = $('<section>').addClass('table-section');

  $('main').append($optionBar, $tableSection);

  function buildOptionBar() {
    let $optionBar = $('<section>').addClass('option-bar flex-grid');
    let $newEntryButton = $('<div>')
      .addClass('col js-new-entry-button')
      .append('<button> New Entry');

    let $emptyCol = $('<div>').addClass('col');
    let $mainListButton = $('<div>').addClass('col js-back');
    $mainListButton.append('<button> Back');

    $optionBar.append($newEntryButton, $emptyCol, $mainListButton);
    return $optionBar;
  }
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
  let $table = $('<table>')
    .addClass('js-table items-table')
    .append(
      $('<tr>').append(
        $('<th>').text('Item'),
        $('<th>').text('To Pack')
      )
    );

  data.items.forEach((item) => {
    $table.append(
      $('<tr>').append(
        $('<td>').text(item.name),
        $('<td>').text(`${item.packed} / ${item.toPack}`)
      )
    );
  });

  $('.table-section').append($table);
}

function buildListeners() {
  $('main').off();

  $('main').on('click', '.js-back', function() {
    const {loadManager} = require('./lists-manager');
    loadManager();
  });
}

module.exports = {loadPlanner};