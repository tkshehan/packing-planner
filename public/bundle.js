(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {loadManager} = require('./lists-manager');

$(startUp);

function startUp() {
  loadManager();
}
},{"./lists-manager":3}],2:[function(require,module,exports){
const packingApi = require('./packing-client');
let currentList = {};


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
    let $saveListButton = $('<div>').addClass('col js-save');
    $saveListButton.append('<button> Save');

    $optionBar.append($newEntryButton, $emptyCol, $mainListButton, $emptyCol.clone(), $saveListButton);
    return $optionBar;
  }
}

function getAndDisplayData(id) {
  getData(id)
    .then(data => {
      currentList = data;
      return data;
    })
    .then(displayData)
}

function getData(id) {
  return packingApi.getById(id);
}

function displayData(data) {
  let $table = $('<table>')
    .addClass('js-table items-table')
    .append(
      $('<tr>').append(
        $('<th>'),
        $('<th>').text('Item'),
        $('<th>').text('To Pack'),
        $('<th>')
      )
    );

  data.items.forEach((item) => {
    let $newRow = $('<tr>').data('id', item._id)
      .append(
        $('<td>').addClass('td-check')
          .append(
            $('<button>').text('Check').addClass('js-check-entry')
          ),
        $('<td>').text(item.item),
        $('<td>').text(`${item.packed} / ${item.toPack}`).addClass('td-packed'),
        $('<td>').addClass('td-delete')
          .append(
            $('<button>').text('delete').addClass('js-delete-entry')
          )
      )

    if (item.packed >= item.toPack) {
      $newRow.addClass('green');
    }

    $table.append($newRow);
  });

  $('.table-section').append($table);
}

function buildListeners() {
  let $main = $('main');
  $main.off();
  $('body').off();

  $main.on('click', '.js-back', function() {
    const {loadManager} = require('./lists-manager');
    loadManager();
  });

  $main.on('click', '.js-check-entry', function() {
    let $row = $(this).closest('tr');
    let item = currentList.items.filter(item => item._id === $row.data('id'))[0];

    if (item.packed + 1 === item.toPack) {
      item.packed++;
      $row.addClass('green');
    } else if (item.packed < item.toPack) {
      item.packed++;
    } else {
      item.packed = 0;
      $row.removeClass('green');
    }

    $row.children('.td-packed').text(`${item.packed} / ${item.toPack}`);
  })

  $main.on('click', '.js-delete-entry', function() {
    let $row = $(this).closest('tr');
    currentList.items = currentList.items.filter(item => item._id !== $row.data('id'));
    $row.remove();
  });

  $main.on('click', '.js-save', function() {
    packingApi.updatedById(currentList.id, currentList);
  });
}

module.exports = {loadPlanner};
},{"./lists-manager":3,"./packing-client":6}],3:[function(require,module,exports){
const {buildModalListeners} = require('./modals');
const packingApi = require('./packing-client');

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
    const {loadPlanner} = require('./list-planner');
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
},{"./list-planner":2,"./modals":5,"./packing-client":6}],4:[function(require,module,exports){
const templates = {
  'None': [],
  'Beach': [
    {item: 'towel'},
    {item: 'sunscreen'},
    {item: 'water'},
    {item: 'swimsuit'},
  ],
  'Camping': [
    {item: 'tent'},
    {item: 'bug-spray'},
    {item: 'sleeping-bag'},
    {item: 'flashlight'},
    {item: 'fire starter'},
    {item: 'toiletries'},
    {item: 'food'},
    {item: 'first-aid kit'},
  ],
}

module.exports = {templates};
},{}],5:[function(require,module,exports){
const packingApi = require('./packing-client');

function buildModalListeners() {
  let $main = $('main');
  let $body = $('body');

  buildSharedListeners($body);

  // Requires a clickable element with the class js-new-list-button
  buildNewListListener($main, $body);

  // Requires a clickable element with the class js-load-list-button
  buildLoadListener($main, $body);

  // Requires a clickable element with the class js-new-entry-button
  buildNewItemListeners($main, $body);
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

function buildNewItemListeners($main, $body) {
  $main.on('click', '.js-new-entry-button', function(event) {
    event.preventDefault();
    displayNewEntryModal();
  });

  $body.on('submit', '.js-new-entry-form', function(event) {
    let values = $(this).serializeArray();
    event.preventDefault();

    addNewEntry(values[0].value);

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
      <input type="text" name="name" id="new-list-name">

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
  let $modal = $('<div').addClass('modal')
    .attr('aria-live', 'assertive');
  $('body').append($overlay, $modal);

  let $newEntryForm = $('<form>')
    .addClass('js-new-entry-form')
    .html(`
    
    `)
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

function addNewEntry(list, name, packed = 0, toPack = 1) {
  console.log(`adding new item ${name}`);
  list.items.push({
    name: name,
    packed: packed,
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
},{"./list-planner":2,"./mock-data":4,"./packing-client":6}],6:[function(require,module,exports){
function post(data) {
  let settings = {
    method: 'POST',
    url: './api/packing',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: JSON.stringify(data),
  }

  return $.ajax(settings);
}

function getMultiple() {
  let settings = {
    method: 'GET',
    url: './api/packing',
    contentType: 'application/json; charset=utf-8',
  }

  return $.ajax(settings);
}

function getById(id) {
  let settings = {
    method: 'GET',
    url: `./api/packing/${id}`,
    contentType: 'application/json; charset=utf-8',
  }

  return $.ajax(settings);
}

function updatedById(id, data) {
  if (data.id !== id) {
    throw new Error('Paramater ID and data.id do not match');
  }
  let settings = {
    method: 'PUT',
    url: `./api/packing/${id}`,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: JSON.stringify(data),
  }

  return $.ajax(settings);
}

function deleteById(id) {
  let settings = {
    method: 'DELETE',
    url: `./api/packing/${id}`,
    contentType: 'application/json; charset=utf-8',
  }

  return $.ajax(settings);
}

module.exports = {getMultiple, getById, deleteById, updatedById, post};
},{}]},{},[1]);
