const packingApi = require('./packing-client');

function buildModalListeners(list) {
  let $main = $('main');
  let $body = $('body');

  buildSharedListeners($body);

  // Requires a clickable element with the class js-new-list-button
  buildNewListListener($main, $body);

  // Requires a clickable element with the class js-load-list-button
  buildLoadListener($main, $body);

  // Requires a clickable element with the class js-new-entry-button
  buildNewItemListeners($main, $body, list);
}

function buildSharedListeners($body) {
  $body.on('click', '.js-close-modal', closeModal);
}

function buildNewListListener($main, $body) {
  $main.on('click', '.js-new-list-button', function(event) {
    event.preventDefault();
    displayNewListModal();
  });

  $body.on('submit', '.js-new-list-form', function(event) {
    let values = $(this).serializeArray();
    event.preventDefault();

    let name = values[0].value;
    let template = values[1].value;

    const {templates} = require('./mock-data');
    buildNewList(name, templates[template]);

    closeModal();
  });

}

function buildLoadListener($main, $body) {
  $main.on('click', '.js-load-list-button', function(event) {
    event.preventDefault();
    displayLoadListModal();
  });

  $body.on('submit', '.js-load-list-form', function(event) {
    let values = $(this).serializeArray();
    event.preventDefault();

    loadList(values[0].value);

    closeModal();
  });
}

function buildNewItemListeners($main, $body, list) {
  $main.on('click', '.js-new-entry-button', function(event) {
    event.preventDefault();
    displayNewEntryModal();
  });

  $body.on('submit', '.js-new-entry-form', function(event) {
    let values = $(this).serializeArray();
    console.log(values);
    event.preventDefault();

    addNewEntry(list, values[0].value, values[1].value);

    closeModal();
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
      <input type="text" name="name" id="new-list-name" required>

      <label for="template">Template</label>
      <select name="template" id="template-select">
        <option value="None">None</option>
        <option value="Camping">Camping</option>
        <option value="Beach">Beach</option>
      </select>
      <div class="form-buttons">
        <input type="submit" value="Create" class="button">
        <button type="button" class="js-close-modal button"> Cancel </button>
      </div>
  `);

  $content.append($newListForm);
  $modal.append($content);
}

function displayLoadListModal() {
  let $overlay = $('<div>').addClass('overlay');
  let $modal = $('<div>').addClass('modal')
    .attr('aria-live', 'assertive');
  $('body').append($overlay, $modal);


  let $content = $('<div>').addClass('modal-content');
  let $loadModalForm = $('<form>')
    .addClass('js-load-list-form')
    .html(`
      <legend> Load A List </legend>
      <label for="id" > ID </label>
      <input type="text" name="id" id="load-id">
       <div class="form-buttons">
          <input type="submit" value="Load" class="button">
          <button type="button" class="js-close-modal button"> Cancel </button>
        </div>
    `);

  $content.append($loadModalForm);
  $modal.append($content);
}

function displayNewEntryModal() {
  let $overlay = $('<div>').addClass('overlay');
  let $modal = $('<div>').addClass('modal')
    .attr('aria-live', 'assertive');
  $('body').append($overlay, $modal);

  let $content = $('<div>').addClass('modal-content');
  let $newEntryForm = $('<form>')
    .addClass('js-new-entry-form')
    .html(`
    <legend> New Item </legend>
    <label for ="item"> Item </label>
    <input type="text" name="item" id="new-item" required>
    <input type="number" name="amount" id="amount" min="1" max="10" value="1" required>
    <div class="form-buttons">
      <input type="submit" value="Add" class="button">
      <button type="button" class="js-close-modal button"> Cancel </button>
    </div>
    `);

  $content.append($newEntryForm);
  $modal.append($content);
}

function closeModal() {
  $('.overlay').remove();
  $('.modal').remove();
}

function buildNewList(name, template) {
  console.log(`building new list with ${name} and ${template}`);

  let newList = {
    name: name,
    items: template,
  };
  packingApi
    .post(newList)
    .then(function(res) {
      const {loadPlanner} = require('./list-planner');
      loadPlanner(res.id);
    });

}

function loadList(id) {
  console.log(`loading list with ${id}`);
  const {loadPlanner} = require('./list-planner');
  loadPlanner(id);
}

function addNewEntry(list, name, toPack = 1) {
  console.log(`adding new item ${name}`);
  list.items.push({
    item: name,
    packed: 0,
    toPack: toPack,
  });

  packingApi
    .updatedById(list.id, list)
    .then(function(res) {
      const {loadPlanner} = require('./list-planner');
      loadPlanner(list.id);
    });
}

module.exports = {buildModalListeners};