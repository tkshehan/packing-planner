const packingApi = require('./packing-api');
const {templates, saveTemplates} = require('./templates');

function buildModalListeners(list) {
  const $main = $('main');
  const $body = $('body');

  buildSharedListeners($body);

  // Requires a clickable element with the class js-new-list-button
  buildNewListListener($main, $body);

  // Requires a clickable element with the class js-load-list-button
  buildLoadListener($main, $body);

  // Requires a clickable element with the class js-new-entry-button
  buildNewItemListeners($main, $body, list);

  // Requires class js-new-templates-button
  buildNewTemplateListeners($main, $body);

  // Requires class js-delete-template-option
  buildDeleteTemplateListeners($main, $body);
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
    const values = $(this).serializeArray();
    event.preventDefault();

    const name = values[0].value;
    const template = values[1].value;

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
    const values = $(this).serializeArray();
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
    const values = $(this).serializeArray();
    event.preventDefault();

    addNewEntry(list, values[0].value, values[1].value);
    saveAndUpdate(list);

    closeModal();
  });
}

function displayNewListModal() {
  const $overlay = $('<div>').addClass('overlay');
  const $modal = $('<div>').addClass('modal')
    .attr('aria-live', 'assertive');
  $('body').append($overlay, $modal);

  const $content = $('<div>').addClass('modal-content');
  const $newListForm = $('<form>')
    .addClass('js-new-list-form ')
    .html(`
      <legend> Create New List </legend>
      <div>
        <label for="name">Name: </label>
        <input type="text" name="name" id="new-list-name" required>
      </div>
      <div>
        <label for="template">Template</label>
        <select name="template" id="template-select">
      </select>
      </div>
      <div class="form-buttons">
        <input type="submit" value="Create" class="button">
        <button type="button" class="js-close-modal button"> Cancel </button>
      </div>
  `);

  $content.append($newListForm);
  $modal.append($content);

  $('select').append(generateTemplateOptions());

  function generateTemplateOptions() {
    const options = Object.keys(templates);
    return options.map((key) => {
      return $('<option>').val(key).text(key);
    });
  }
}

let templateEntryCounter = 0;
function buildNewTemplateListeners($main, $body) {
  $main.on('click', '.js-new-template-button', function(event) {
    event.preventDefault();
    displayNewTemplateModal();
  });

  $body.on('click', '.js-add-template-item', function(event) {
    event.preventDefault();
    templateEntryCounter++;
    $('.js-extra-items').append(`
        <label>
          Item 
          <input name="template-entry-${templateEntryCounter}" type="text" required> 
        </label>
    `);
  });

  $body.on('click', '.js-remove-template-item', function(event) {
    event.preventDefault();
    if (templateEntryCounter > 0) {
      $(`input[name="template-entry-${templateEntryCounter}"]`).closest('label').remove();
      templateEntryCounter--;
    }
  });

  $body.on('submit', '.js-new-template-form', function(event) {
    const values = $(this).serializeArray();
    event.preventDefault();
    addTemplate(values);
    saveTemplates(templates);

    closeModal();
  });
}

function buildDeleteTemplateListeners($main, $body) {
  $main.on('click', '.js-delete-template-option', function(event) {
    event.preventDefault();
    displayDeleteTemplateModal();
  });

  $body.on('click', '.js-delete-template', function(event) {
    event.preventDefault();
    const name = $(this).closest('tr').find('td').first().text();
    delete templates[name];
    $(this).closest('tr').remove();

    saveTemplates(templates);
  });
}

function displayLoadListModal() {
  const $overlay = $('<div>').addClass('overlay');
  const $modal = $('<div>').addClass('modal')
    .attr('aria-live', 'assertive');
  $('body').append($overlay, $modal);


  const $content = $('<div>').addClass('modal-content');
  const $loadModalForm = $('<form>')
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
  const $overlay = $('<div>').addClass('overlay');
  const $modal = $('<div>').addClass('modal')
    .attr('aria-live', 'assertive');
  $('body').append($overlay, $modal);

  const $content = $('<div>').addClass('modal-content');
  const $newEntryForm = $('<form>')
    .addClass('js-new-entry-form')
    .html(`
    <legend> New Item </legend>
    <label for ="item"> Item </label>
    <input type="text" name="item" id="new-item" required>
    <label for="amount"> # </label>
    <input type="number" name="amount" id="amount" min="1" max="10" value="1" required>
    <div class="form-buttons">
      <input type="submit" value="Add" class="button">
      <button type="button" class="js-close-modal button"> Cancel </button>
    </div>
    `);

  $content.append($newEntryForm);
  $modal.append($content);
}

function displayNewTemplateModal() {
  const $overlay = $('<div>').addClass('overlay');
  const $modal = $('<div>').addClass('modal');
  $('body').append($overlay, $modal);

  const $content = $('<div>').addClass('modal-content');
  templateEntryCounter = 0;
  const $newTemplateForm = $('<form>')
    .addClass('js-new-template-form')
    .html(`
      <legend> New Template </legend>
      <label for="name"> Name </label>
      <input type="text" name="name" id="new-template" required">
      <button class="js-add-template-item" alt="add"> + </button>
      <button class="js-remove-template-item" alt="remove"> - </button>
      <div class="js-extra-items flex-col">
        <label>
          Item 
          <input name="template-entry-0 type="text" required> 
        </label>
      </div>
      <div class="form-buttons">
        <input type="submit" value="Create Template" class="button">
        <button type="button" class="js-close-modal button"> Cancel </button>
      </div>
    `);
  $content.append($newTemplateForm);
  $modal.append($content);
}

function displayDeleteTemplateModal() {
  const $overlay = $('<div>').addClass('overlay');
  const $modal = $('<div>').addClass('modal');
  $('body').append($overlay, $modal);

  const $content = $('<div>').addClass('modal-content');
  const $title = $('<h2>').text('Delete Templates');
  const $deleteTemplateList = $('<table>')
    .append(
      $('<tr>').append(
        $('<th>').text('Name'),
        $('<th>')
      )
    );
  Object.keys(templates).forEach((name) => {
    const $newRow = $('<tr>')
      .append(
        $('<td>').text(name),
        $('<td>').addClass('td-delete').append(
          $('<button>', {
            'class': 'delete js-delete-template',
            'aria-label': 'delete',
          })
        )
      );
    $deleteTemplateList.append($newRow);
  });
  $content.append($title, $deleteTemplateList);
  $content.append(`
      <div class="form-buttons">
        <button type="button" class="js-close-modal button"> Close </button>
      </div>`);

  $modal.append($content);
}

function closeModal() {
  $('.overlay').remove();
  $('.modal').remove();
}

function buildNewList(name, template) {
  const newList = {
    name: name,
    items: template,
  };
  packingApi
    .post(newList)
    .then(function(res) {
      const {loadPlanner} = require('./planner');
      loadPlanner(res.id);
    });
}

function loadList(id) {
  const {loadPlanner} = require('./planner');
  loadPlanner(id);
}

function addNewEntry(list, name, toPack = 1) {
  list.items.push({
    item: name,
    packed: 0,
    toPack: toPack,
  });
}

function saveAndUpdate(list) {
  packingApi
    .updatedById(list.id, list)
    .then(function(res) {
      const {loadPlanner} = require('./planner');
      loadPlanner(list.id);
    });
}

function addTemplate(values) {
  const name = values[0].value;
  templates[name] = [];
  for (let i = 1; i < values.length; i++) {
    templates[name].push({item: values[i].value});
  }
}

module.exports = {buildModalListeners, addNewEntry, saveAndUpdate};
