const {listsData} = require('./mock-data');
const {loadPlanner} = require('./list-planner');

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

    $optionBar.append($newListButton, $emptyCol);
    return $optionBar;
  }
}

function buildListeners() {
  $('main').on('click', 'tr', function() {
    let id = $(this).data('id');
    loadPlanner(id);
  });

  $('main').on('click', '.js-new-list-button', function() {
    displayNewListModal();
  });

  $('body').on('submit', '.js-new-list-form', function(event) {
    let values = $(this).serializeArray();
    event.preventDefault();

    let name = values[0].value;
    let template = values[1].value;
    buildNewList(name, template);

    $('.overlay').remove();
    $('.modal').remove();
  })

  $('body').on('click', '.js-close-modal', function() {
    $('.overlay').remove();
    $('.modal').remove();
  });
}

function displayNewListModal() {
  let $overlay = $('<div>').addClass('overlay');
  let $modal = $('<div>').addClass('modal')
    .attr('aria-live', 'assertive');
  $('body').append($overlay, $modal);

  let $content = $('<div>').addClass('modal-content');
  let $newListForm = $('<form>')
    .addClass('js-new-list-form')
    .html(`
      <legend> Create New List </legend>
      <label for="name">Name: </label>
      <input type="text" name="name" id="new-list-name">

      <label for="template">Template</label>
      <select name="template" id="template-select">
        <option>None</option>
        <option value="camping">Camping</option>
        <option value="beach">Beach</option>
        <option value="general">General</option>
      </select>
      <div class="form-buttons">
        <input type="submit" value="Create" class="button">
        <button class="js-close-modal button"> Cancel </button>
      </div>
  `);

  $content.append($newListForm);
  $modal.append($content);
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
  let $table = $('<table>')
    .addClass('js-table')
    .append(`
    <tr>
      <th> Name </td>
      <th> Items </td>
    </tr>
  `);

  lists.forEach((list) => {
    let $newRow = $('<tr>')
      .append(`
        <td> ${list.name} </td>
        <td> ${list.packedAmount} / ${list.amount} </td>`
      )
      .data('id', list.id);
    $table.append($newRow);
  });
  $('.table-section').append($table);
};

function buildNewList(name, template) {

}

module.exports = {loadManager}