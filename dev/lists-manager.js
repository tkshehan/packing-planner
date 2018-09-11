const {buildModalListeners} = require('./modals');
const packingApi = require('./packing-api');

function loadManager() {
  buildPage();
  buildListeners();
  getAndDisplayLists();
}

function buildPage() {
  $('main').empty();
  let $optionBar = buildOptionBar();
  let $tableSection = $('<section>').addClass('table-section');

  $('main').append($optionBar, $tableSection);

  function buildOptionBar() {
    let $optionBar = $('<section>').addClass('option-bar flex-grid');
    let $newListButton = $('<div>').addClass('col js-new-list-button');
    $newListButton.append('<button> New Packing List');
    let $emptyCol = $('<div>').addClass('col');

    $optionBar.append($newListButton, $emptyCol, $emptyCol.clone());
    return $optionBar;
  }
}

function buildListeners() {
  let $main = $('main');
  $main.off();
  $('body').off();

  $main.on('click', 'tr:not(:first-child)', function() {
    let id = $(this).data('id');
    const {loadPlanner} = require('./planner');
    $('.js-table-remove');
    loadPlanner(id);
  });

  $main.on('click', '.js-delete-list', function(event) {
    event.stopImmediatePropagation();
    let id = $(this).closest('tr').data('id');
    console.log(id);
    packingApi.deleteById(id)
      .then(function() {
        $('.js-table').remove();
        getAndDisplayLists();
      })
  })

  buildModalListeners();
}

function getAndDisplayLists() {
  getLists().then(displayLists);
}

function getLists() {
  return packingApi.getMultiple();
}

function displayLists(lists) {
  let $table = $('<table>')
    .addClass('js-table')
    .append(
      $('<tr>').append(
        $('<th>').text('Name'),
        $('<th>').text('Items'),
        $('<th>')
      )
    );

  lists.forEach((list) => {
    let $newRow = $('<tr>').data('id', list.id)
      .append(
        $('<td>').text(`${list.name}`),
        $('<td>').text(`${list.packed} / ${list.toPack}`),
        $('<td>').addClass('td-delete').append(
          $('<button>').text('Delete').addClass('js-delete-list'),
        )
      );
    $table.append($newRow);
  });
  $('.table-section').append($table);
};

module.exports = {loadManager}