const {buildModalListeners} = require('./modals');
const packingApi = require('./packing-api');

function loadManager() {
  buildPage();
  buildListeners();
  getAndDisplayLists();
}

function buildPage() {
  $('main').empty();
  const $optionBar = buildOptionBar();
  const $tableSection = $('<section>',
    {
      class: 'table-section',
      role: 'region',
    });

  $('main').append($optionBar, $tableSection);

  function buildOptionBar() {
    const $optionBar = $('<section>',
      {
        class: 'option-bar flex-grid',
        role: 'region',
      });
    const $newListButton = $('<div>')
      .addClass('col js-new-list-button')
      .append('<button class="accent"> New Packing List');
    const $newTemplateButton = $('<div>')
      .addClass('col js-new-template-button')
      .append('<button> New Template');
    const $deleteTemplateButton = $('<div>')
      .addClass('col js-delete-template-option')
      .append('<button> Delete Templates');
    const $emptyCol = $('<div>').addClass('col');

    $optionBar.append($newListButton, $emptyCol, $newTemplateButton, $deleteTemplateButton);
    return $optionBar;
  }
}

function buildListeners() {
  const $main = $('main');
  $main.off();
  $('body').off();

  $main.on('click', 'tr:not(:first-child)', function() {
    const id = $(this).data('id');
    const {loadPlanner} = require('./planner');
    $('.js-table-remove');
    loadPlanner(id);
  });

  $main.on('click', '.js-delete-list', function(event) {
    event.stopImmediatePropagation();
    const id = $(this).closest('tr').data('id');
    packingApi.deleteById(id)
      .then(function() {
        $('.js-table').remove();
        getAndDisplayLists();
      });
  });

  buildModalListeners();
}

function getAndDisplayLists() {
  getLists().then(displayLists);
}

function getLists() {
  return packingApi.getMultiple();
}

function displayLists(lists) {
  const $table = $('<table>')
    .addClass('js-table list-table')
    .append(
      $('<tr>').append(
        $('<th>').text('Name'),
        $('<th>').text('Items'),
        $('<th>')
      )
    );

  lists.forEach((list) => {
    const $newRow = $('<tr>').data('id', list.id)
      .append(
        $('<td>').append(
          $('<button>')
            .addClass('no-style-button')
            .text(`${list.name}`)),
        $('<td>').text(`${list.packed} / ${list.toPack}`),
        $('<td>').addClass('td-delete').append(
          $('<button>', {
            'class': 'delete js-delete-list',
            'aria-label': 'delete',
          })
        )
      );
    $table.append($newRow);
  });
  $('.table-section').append($table);
};

module.exports = {loadManager};
