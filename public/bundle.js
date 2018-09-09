(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {loadManager} = require('./lists-manager');

$(startUp);

function startUp() {
  loadManager();
}
},{"./lists-manager":3}],2:[function(require,module,exports){
const packingApi = require('./packing-client');
const {buildModalListeners} = require('./modals');
let currentList = {};


function loadPlanner(id) {
  buildPage();
  buildListeners(currentList);
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
      currentList.id = data.id;
      currentList.items = data.items;
      currentList.name = data.name;
      return currentList;
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

function buildListeners(list) {
  let $main = $('main');
  $main.off();
  $('body').off();

  buildModalListeners(list);

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
    console.log(currentList);
    packingApi.updatedById(currentList.id, currentList);
  });
}

module.exports = {loadPlanner};
},{"./lists-manager":3,"./modals":5,"./packing-client":6}],3:[function(require,module,exports){
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
    <input type="number" name="amount" id="amount" min="1" value="1" required>
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L2xpc3QtcGxhbm5lci5qcyIsImRldi9saXN0cy1tYW5hZ2VyLmpzIiwiZGV2L21vY2stZGF0YS5qcyIsImRldi9tb2RhbHMuanMiLCJkZXYvcGFja2luZy1jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB7bG9hZE1hbmFnZXJ9ID0gcmVxdWlyZSgnLi9saXN0cy1tYW5hZ2VyJyk7XHJcblxyXG4kKHN0YXJ0VXApO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRVcCgpIHtcclxuICBsb2FkTWFuYWdlcigpO1xyXG59IiwiY29uc3QgcGFja2luZ0FwaSA9IHJlcXVpcmUoJy4vcGFja2luZy1jbGllbnQnKTtcclxuY29uc3Qge2J1aWxkTW9kYWxMaXN0ZW5lcnN9ID0gcmVxdWlyZSgnLi9tb2RhbHMnKTtcclxubGV0IGN1cnJlbnRMaXN0ID0ge307XHJcblxyXG5cclxuZnVuY3Rpb24gbG9hZFBsYW5uZXIoaWQpIHtcclxuICBidWlsZFBhZ2UoKTtcclxuICBidWlsZExpc3RlbmVycyhjdXJyZW50TGlzdCk7XHJcbiAgZ2V0QW5kRGlzcGxheURhdGEoaWQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFBhZ2UoKSB7XHJcbiAgJCgnbWFpbicpLmVtcHR5KCk7XHJcblxyXG4gIGxldCAkb3B0aW9uQmFyID0gYnVpbGRPcHRpb25CYXIoKTtcclxuICBsZXQgJHRhYmxlU2VjdGlvbiA9ICQoJzxzZWN0aW9uPicpLmFkZENsYXNzKCd0YWJsZS1zZWN0aW9uJyk7XHJcblxyXG4gICQoJ21haW4nKS5hcHBlbmQoJG9wdGlvbkJhciwgJHRhYmxlU2VjdGlvbik7XHJcblxyXG4gIGZ1bmN0aW9uIGJ1aWxkT3B0aW9uQmFyKCkge1xyXG4gICAgbGV0ICRvcHRpb25CYXIgPSAkKCc8c2VjdGlvbj4nKS5hZGRDbGFzcygnb3B0aW9uLWJhciBmbGV4LWdyaWQnKTtcclxuICAgIGxldCAkbmV3RW50cnlCdXR0b24gPSAkKCc8ZGl2PicpXHJcbiAgICAgIC5hZGRDbGFzcygnY29sIGpzLW5ldy1lbnRyeS1idXR0b24nKVxyXG4gICAgICAuYXBwZW5kKCc8YnV0dG9uPiBOZXcgRW50cnknKTtcclxuXHJcbiAgICBsZXQgJGVtcHR5Q29sID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sJyk7XHJcbiAgICBsZXQgJG1haW5MaXN0QnV0dG9uID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sIGpzLWJhY2snKTtcclxuICAgICRtYWluTGlzdEJ1dHRvbi5hcHBlbmQoJzxidXR0b24+IEJhY2snKTtcclxuICAgIGxldCAkc2F2ZUxpc3RCdXR0b24gPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdjb2wganMtc2F2ZScpO1xyXG4gICAgJHNhdmVMaXN0QnV0dG9uLmFwcGVuZCgnPGJ1dHRvbj4gU2F2ZScpO1xyXG5cclxuICAgICRvcHRpb25CYXIuYXBwZW5kKCRuZXdFbnRyeUJ1dHRvbiwgJGVtcHR5Q29sLCAkbWFpbkxpc3RCdXR0b24sICRlbXB0eUNvbC5jbG9uZSgpLCAkc2F2ZUxpc3RCdXR0b24pO1xyXG4gICAgcmV0dXJuICRvcHRpb25CYXI7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbmREaXNwbGF5RGF0YShpZCkge1xyXG4gIGdldERhdGEoaWQpXHJcbiAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgY3VycmVudExpc3QuaWQgPSBkYXRhLmlkO1xyXG4gICAgICBjdXJyZW50TGlzdC5pdGVtcyA9IGRhdGEuaXRlbXM7XHJcbiAgICAgIGN1cnJlbnRMaXN0Lm5hbWUgPSBkYXRhLm5hbWU7XHJcbiAgICAgIHJldHVybiBjdXJyZW50TGlzdDtcclxuICAgIH0pXHJcbiAgICAudGhlbihkaXNwbGF5RGF0YSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0YShpZCkge1xyXG4gIHJldHVybiBwYWNraW5nQXBpLmdldEJ5SWQoaWQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5RGF0YShkYXRhKSB7XHJcbiAgbGV0ICR0YWJsZSA9ICQoJzx0YWJsZT4nKVxyXG4gICAgLmFkZENsYXNzKCdqcy10YWJsZSBpdGVtcy10YWJsZScpXHJcbiAgICAuYXBwZW5kKFxyXG4gICAgICAkKCc8dHI+JykuYXBwZW5kKFxyXG4gICAgICAgICQoJzx0aD4nKSxcclxuICAgICAgICAkKCc8dGg+JykudGV4dCgnSXRlbScpLFxyXG4gICAgICAgICQoJzx0aD4nKS50ZXh0KCdUbyBQYWNrJyksXHJcbiAgICAgICAgJCgnPHRoPicpXHJcbiAgICAgIClcclxuICAgICk7XHJcblxyXG4gIGRhdGEuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgbGV0ICRuZXdSb3cgPSAkKCc8dHI+JykuZGF0YSgnaWQnLCBpdGVtLl9pZClcclxuICAgICAgLmFwcGVuZChcclxuICAgICAgICAkKCc8dGQ+JykuYWRkQ2xhc3MoJ3RkLWNoZWNrJylcclxuICAgICAgICAgIC5hcHBlbmQoXHJcbiAgICAgICAgICAgICQoJzxidXR0b24+JykudGV4dCgnQ2hlY2snKS5hZGRDbGFzcygnanMtY2hlY2stZW50cnknKVxyXG4gICAgICAgICAgKSxcclxuICAgICAgICAkKCc8dGQ+JykudGV4dChpdGVtLml0ZW0pLFxyXG4gICAgICAgICQoJzx0ZD4nKS50ZXh0KGAke2l0ZW0ucGFja2VkfSAvICR7aXRlbS50b1BhY2t9YCkuYWRkQ2xhc3MoJ3RkLXBhY2tlZCcpLFxyXG4gICAgICAgICQoJzx0ZD4nKS5hZGRDbGFzcygndGQtZGVsZXRlJylcclxuICAgICAgICAgIC5hcHBlbmQoXHJcbiAgICAgICAgICAgICQoJzxidXR0b24+JykudGV4dCgnZGVsZXRlJykuYWRkQ2xhc3MoJ2pzLWRlbGV0ZS1lbnRyeScpXHJcbiAgICAgICAgICApXHJcbiAgICAgIClcclxuXHJcbiAgICBpZiAoaXRlbS5wYWNrZWQgPj0gaXRlbS50b1BhY2spIHtcclxuICAgICAgJG5ld1Jvdy5hZGRDbGFzcygnZ3JlZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICAkdGFibGUuYXBwZW5kKCRuZXdSb3cpO1xyXG4gIH0pO1xyXG5cclxuICAkKCcudGFibGUtc2VjdGlvbicpLmFwcGVuZCgkdGFibGUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZExpc3RlbmVycyhsaXN0KSB7XHJcbiAgbGV0ICRtYWluID0gJCgnbWFpbicpO1xyXG4gICRtYWluLm9mZigpO1xyXG4gICQoJ2JvZHknKS5vZmYoKTtcclxuXHJcbiAgYnVpbGRNb2RhbExpc3RlbmVycyhsaXN0KTtcclxuXHJcbiAgJG1haW4ub24oJ2NsaWNrJywgJy5qcy1iYWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCB7bG9hZE1hbmFnZXJ9ID0gcmVxdWlyZSgnLi9saXN0cy1tYW5hZ2VyJyk7XHJcbiAgICBsb2FkTWFuYWdlcigpO1xyXG4gIH0pO1xyXG5cclxuICAkbWFpbi5vbignY2xpY2snLCAnLmpzLWNoZWNrLWVudHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgJHJvdyA9ICQodGhpcykuY2xvc2VzdCgndHInKTtcclxuICAgIGxldCBpdGVtID0gY3VycmVudExpc3QuaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5faWQgPT09ICRyb3cuZGF0YSgnaWQnKSlbMF07XHJcblxyXG4gICAgaWYgKGl0ZW0ucGFja2VkICsgMSA9PT0gaXRlbS50b1BhY2spIHtcclxuICAgICAgaXRlbS5wYWNrZWQrKztcclxuICAgICAgJHJvdy5hZGRDbGFzcygnZ3JlZW4nKTtcclxuICAgIH0gZWxzZSBpZiAoaXRlbS5wYWNrZWQgPCBpdGVtLnRvUGFjaykge1xyXG4gICAgICBpdGVtLnBhY2tlZCsrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5wYWNrZWQgPSAwO1xyXG4gICAgICAkcm93LnJlbW92ZUNsYXNzKCdncmVlbicpO1xyXG4gICAgfVxyXG5cclxuICAgICRyb3cuY2hpbGRyZW4oJy50ZC1wYWNrZWQnKS50ZXh0KGAke2l0ZW0ucGFja2VkfSAvICR7aXRlbS50b1BhY2t9YCk7XHJcbiAgfSlcclxuXHJcbiAgJG1haW4ub24oJ2NsaWNrJywgJy5qcy1kZWxldGUtZW50cnknLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCAkcm93ID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpO1xyXG4gICAgY3VycmVudExpc3QuaXRlbXMgPSBjdXJyZW50TGlzdC5pdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLl9pZCAhPT0gJHJvdy5kYXRhKCdpZCcpKTtcclxuICAgICRyb3cucmVtb3ZlKCk7XHJcbiAgfSk7XHJcblxyXG4gICRtYWluLm9uKCdjbGljaycsICcuanMtc2F2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coY3VycmVudExpc3QpO1xyXG4gICAgcGFja2luZ0FwaS51cGRhdGVkQnlJZChjdXJyZW50TGlzdC5pZCwgY3VycmVudExpc3QpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtsb2FkUGxhbm5lcn07IiwiY29uc3Qge2J1aWxkTW9kYWxMaXN0ZW5lcnN9ID0gcmVxdWlyZSgnLi9tb2RhbHMnKTtcclxuY29uc3QgcGFja2luZ0FwaSA9IHJlcXVpcmUoJy4vcGFja2luZy1jbGllbnQnKTtcclxuXHJcbmZ1bmN0aW9uIGxvYWRNYW5hZ2VyKCkge1xyXG4gIGJ1aWxkUGFnZSgpO1xyXG4gIGJ1aWxkTGlzdGVuZXJzKCk7XHJcbiAgZ2V0QW5kRGlzcGxheUxpc3RzKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkUGFnZSgpIHtcclxuICAkKCdtYWluJykuZW1wdHkoKTtcclxuICBsZXQgJG9wdGlvbkJhciA9IGJ1aWxkT3B0aW9uQmFyKCk7XHJcbiAgbGV0ICR0YWJsZVNlY3Rpb24gPSAkKCc8c2VjdGlvbj4nKS5hZGRDbGFzcygndGFibGUtc2VjdGlvbicpO1xyXG5cclxuICAkKCdtYWluJykuYXBwZW5kKCRvcHRpb25CYXIsICR0YWJsZVNlY3Rpb24pO1xyXG5cclxuICBmdW5jdGlvbiBidWlsZE9wdGlvbkJhcigpIHtcclxuICAgIGxldCAkb3B0aW9uQmFyID0gJCgnPHNlY3Rpb24+JykuYWRkQ2xhc3MoJ29wdGlvbi1iYXIgZmxleC1ncmlkJyk7XHJcbiAgICBsZXQgJG5ld0xpc3RCdXR0b24gPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdjb2wganMtbmV3LWxpc3QtYnV0dG9uJyk7XHJcbiAgICAkbmV3TGlzdEJ1dHRvbi5hcHBlbmQoJzxidXR0b24+IE5ldyBQYWNraW5nIExpc3QnKTtcclxuICAgIGxldCAkZW1wdHlDb2wgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdjb2wnKTtcclxuXHJcbiAgICAkb3B0aW9uQmFyLmFwcGVuZCgkbmV3TGlzdEJ1dHRvbiwgJGVtcHR5Q29sLCAkZW1wdHlDb2wuY2xvbmUoKSk7XHJcbiAgICByZXR1cm4gJG9wdGlvbkJhcjtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTGlzdGVuZXJzKCkge1xyXG4gIGxldCAkbWFpbiA9ICQoJ21haW4nKTtcclxuICAkbWFpbi5vZmYoKTtcclxuICAkKCdib2R5Jykub2ZmKCk7XHJcblxyXG4gICRtYWluLm9uKCdjbGljaycsICd0cjpub3QoOmZpcnN0LWNoaWxkKScsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGlkID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xyXG4gICAgY29uc3Qge2xvYWRQbGFubmVyfSA9IHJlcXVpcmUoJy4vbGlzdC1wbGFubmVyJyk7XHJcbiAgICAkKCcuanMtdGFibGUtcmVtb3ZlJyk7XHJcbiAgICBsb2FkUGxhbm5lcihpZCk7XHJcbiAgfSk7XHJcblxyXG4gICRtYWluLm9uKCdjbGljaycsICcuanMtZGVsZXRlLWxpc3QnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICBsZXQgaWQgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZGF0YSgnaWQnKTtcclxuICAgIGNvbnNvbGUubG9nKGlkKTtcclxuICAgIHBhY2tpbmdBcGkuZGVsZXRlQnlJZChpZClcclxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLmpzLXRhYmxlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgZ2V0QW5kRGlzcGxheUxpc3RzKCk7XHJcbiAgICAgIH0pXHJcbiAgfSlcclxuXHJcbiAgYnVpbGRNb2RhbExpc3RlbmVycygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbmREaXNwbGF5TGlzdHMoKSB7XHJcbiAgZ2V0TGlzdHMoKS50aGVuKGRpc3BsYXlMaXN0cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldExpc3RzKCkge1xyXG4gIHJldHVybiBwYWNraW5nQXBpLmdldE11bHRpcGxlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlMaXN0cyhsaXN0cykge1xyXG4gIGxldCAkdGFibGUgPSAkKCc8dGFibGU+JylcclxuICAgIC5hZGRDbGFzcygnanMtdGFibGUnKVxyXG4gICAgLmFwcGVuZChcclxuICAgICAgJCgnPHRyPicpLmFwcGVuZChcclxuICAgICAgICAkKCc8dGg+JykudGV4dCgnTmFtZScpLFxyXG4gICAgICAgICQoJzx0aD4nKS50ZXh0KCdJdGVtcycpLFxyXG4gICAgICAgICQoJzx0aD4nKVxyXG4gICAgICApXHJcbiAgICApO1xyXG5cclxuICBsaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XHJcbiAgICBsZXQgJG5ld1JvdyA9ICQoJzx0cj4nKS5kYXRhKCdpZCcsIGxpc3QuaWQpXHJcbiAgICAgIC5hcHBlbmQoXHJcbiAgICAgICAgJCgnPHRkPicpLnRleHQoYCR7bGlzdC5uYW1lfWApLFxyXG4gICAgICAgICQoJzx0ZD4nKS50ZXh0KGAke2xpc3QucGFja2VkfSAvICR7bGlzdC50b1BhY2t9YCksXHJcbiAgICAgICAgJCgnPHRkPicpLmFkZENsYXNzKCd0ZC1kZWxldGUnKS5hcHBlbmQoXHJcbiAgICAgICAgICAkKCc8YnV0dG9uPicpLnRleHQoJ0RlbGV0ZScpLmFkZENsYXNzKCdqcy1kZWxldGUtbGlzdCcpLFxyXG4gICAgICAgIClcclxuICAgICAgKTtcclxuICAgICR0YWJsZS5hcHBlbmQoJG5ld1Jvdyk7XHJcbiAgfSk7XHJcbiAgJCgnLnRhYmxlLXNlY3Rpb24nKS5hcHBlbmQoJHRhYmxlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2xvYWRNYW5hZ2VyfSIsImNvbnN0IHRlbXBsYXRlcyA9IHtcclxuICAnTm9uZSc6IFtdLFxyXG4gICdCZWFjaCc6IFtcclxuICAgIHtpdGVtOiAndG93ZWwnfSxcclxuICAgIHtpdGVtOiAnc3Vuc2NyZWVuJ30sXHJcbiAgICB7aXRlbTogJ3dhdGVyJ30sXHJcbiAgICB7aXRlbTogJ3N3aW1zdWl0J30sXHJcbiAgXSxcclxuICAnQ2FtcGluZyc6IFtcclxuICAgIHtpdGVtOiAndGVudCd9LFxyXG4gICAge2l0ZW06ICdidWctc3ByYXknfSxcclxuICAgIHtpdGVtOiAnc2xlZXBpbmctYmFnJ30sXHJcbiAgICB7aXRlbTogJ2ZsYXNobGlnaHQnfSxcclxuICAgIHtpdGVtOiAnZmlyZSBzdGFydGVyJ30sXHJcbiAgICB7aXRlbTogJ3RvaWxldHJpZXMnfSxcclxuICAgIHtpdGVtOiAnZm9vZCd9LFxyXG4gICAge2l0ZW06ICdmaXJzdC1haWQga2l0J30sXHJcbiAgXSxcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7dGVtcGxhdGVzfTsiLCJjb25zdCBwYWNraW5nQXBpID0gcmVxdWlyZSgnLi9wYWNraW5nLWNsaWVudCcpO1xyXG5cclxuZnVuY3Rpb24gYnVpbGRNb2RhbExpc3RlbmVycyhsaXN0KSB7XHJcbiAgbGV0ICRtYWluID0gJCgnbWFpbicpO1xyXG4gIGxldCAkYm9keSA9ICQoJ2JvZHknKTtcclxuXHJcbiAgYnVpbGRTaGFyZWRMaXN0ZW5lcnMoJGJvZHkpO1xyXG5cclxuICAvLyBSZXF1aXJlcyBhIGNsaWNrYWJsZSBlbGVtZW50IHdpdGggdGhlIGNsYXNzIGpzLW5ldy1saXN0LWJ1dHRvblxyXG4gIGJ1aWxkTmV3TGlzdExpc3RlbmVyKCRtYWluLCAkYm9keSk7XHJcblxyXG4gIC8vIFJlcXVpcmVzIGEgY2xpY2thYmxlIGVsZW1lbnQgd2l0aCB0aGUgY2xhc3MganMtbG9hZC1saXN0LWJ1dHRvblxyXG4gIGJ1aWxkTG9hZExpc3RlbmVyKCRtYWluLCAkYm9keSk7XHJcblxyXG4gIC8vIFJlcXVpcmVzIGEgY2xpY2thYmxlIGVsZW1lbnQgd2l0aCB0aGUgY2xhc3MganMtbmV3LWVudHJ5LWJ1dHRvblxyXG4gIGJ1aWxkTmV3SXRlbUxpc3RlbmVycygkbWFpbiwgJGJvZHksIGxpc3QpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFNoYXJlZExpc3RlbmVycygkYm9keSkge1xyXG4gICRib2R5Lm9uKCdjbGljaycsICcuanMtY2xvc2UtbW9kYWwnLCBjbG9zZU1vZGFsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGROZXdMaXN0TGlzdGVuZXIoJG1haW4sICRib2R5KSB7XHJcbiAgJG1haW4ub24oJ2NsaWNrJywgJy5qcy1uZXctbGlzdC1idXR0b24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGRpc3BsYXlOZXdMaXN0TW9kYWwoKTtcclxuICB9KTtcclxuXHJcbiAgJGJvZHkub24oJ3N1Ym1pdCcsICcuanMtbmV3LWxpc3QtZm9ybScsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBsZXQgdmFsdWVzID0gJCh0aGlzKS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBsZXQgbmFtZSA9IHZhbHVlc1swXS52YWx1ZTtcclxuICAgIGxldCB0ZW1wbGF0ZSA9IHZhbHVlc1sxXS52YWx1ZTtcclxuXHJcbiAgICBjb25zdCB7dGVtcGxhdGVzfSA9IHJlcXVpcmUoJy4vbW9jay1kYXRhJyk7XHJcbiAgICBidWlsZE5ld0xpc3QobmFtZSwgdGVtcGxhdGVzW3RlbXBsYXRlXSk7XHJcblxyXG4gICAgY2xvc2VNb2RhbCgpO1xyXG4gIH0pO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRMb2FkTGlzdGVuZXIoJG1haW4sICRib2R5KSB7XHJcbiAgJG1haW4ub24oJ2NsaWNrJywgJy5qcy1sb2FkLWxpc3QtYnV0dG9uJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBkaXNwbGF5TG9hZExpc3RNb2RhbCgpO1xyXG4gIH0pO1xyXG5cclxuICAkYm9keS5vbignc3VibWl0JywgJy5qcy1sb2FkLWxpc3QtZm9ybScsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBsZXQgdmFsdWVzID0gJCh0aGlzKS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBsb2FkTGlzdCh2YWx1ZXNbMF0udmFsdWUpO1xyXG5cclxuICAgIGNsb3NlTW9kYWwoKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGROZXdJdGVtTGlzdGVuZXJzKCRtYWluLCAkYm9keSwgbGlzdCkge1xyXG4gICRtYWluLm9uKCdjbGljaycsICcuanMtbmV3LWVudHJ5LWJ1dHRvbicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZGlzcGxheU5ld0VudHJ5TW9kYWwoKTtcclxuICB9KTtcclxuXHJcbiAgJGJvZHkub24oJ3N1Ym1pdCcsICcuanMtbmV3LWVudHJ5LWZvcm0nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgbGV0IHZhbHVlcyA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcclxuICAgIGNvbnNvbGUubG9nKHZhbHVlcyk7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGFkZE5ld0VudHJ5KGxpc3QsIHZhbHVlc1swXS52YWx1ZSwgdmFsdWVzWzFdLnZhbHVlKTtcclxuXHJcbiAgICBjbG9zZU1vZGFsKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlOZXdMaXN0TW9kYWwoKSB7XHJcbiAgbGV0ICRvdmVybGF5ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnb3ZlcmxheScpO1xyXG4gIGxldCAkbW9kYWwgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtb2RhbCcpXHJcbiAgICAuYXR0cignYXJpYS1saXZlJywgJ2Fzc2VydGl2ZScpO1xyXG4gICQoJ2JvZHknKS5hcHBlbmQoJG92ZXJsYXksICRtb2RhbCk7XHJcblxyXG4gIGxldCAkY29udGVudCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWNvbnRlbnQnKTtcclxuICBsZXQgJG5ld0xpc3RGb3JtID0gJCgnPGZvcm0+JylcclxuICAgIC5hZGRDbGFzcygnanMtbmV3LWxpc3QtZm9ybScpXHJcbiAgICAuaHRtbChgXHJcbiAgICAgIDxsZWdlbmQ+IENyZWF0ZSBOZXcgTGlzdCA8L2xlZ2VuZD5cclxuICAgICAgPGxhYmVsIGZvcj1cIm5hbWVcIj5OYW1lOiA8L2xhYmVsPlxyXG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIGlkPVwibmV3LWxpc3QtbmFtZVwiIHJlcXVpcmVkPlxyXG5cclxuICAgICAgPGxhYmVsIGZvcj1cInRlbXBsYXRlXCI+VGVtcGxhdGU8L2xhYmVsPlxyXG4gICAgICA8c2VsZWN0IG5hbWU9XCJ0ZW1wbGF0ZVwiIGlkPVwidGVtcGxhdGUtc2VsZWN0XCI+XHJcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk5vbmVcIj5Ob25lPC9vcHRpb24+XHJcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkNhbXBpbmdcIj5DYW1waW5nPC9vcHRpb24+XHJcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkJlYWNoXCI+QmVhY2g8L29wdGlvbj5cclxuICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWJ1dHRvbnNcIj5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiQ3JlYXRlXCIgY2xhc3M9XCJidXR0b25cIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImpzLWNsb3NlLW1vZGFsIGJ1dHRvblwiPiBDYW5jZWwgPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gIGApO1xyXG5cclxuICAkY29udGVudC5hcHBlbmQoJG5ld0xpc3RGb3JtKTtcclxuICAkbW9kYWwuYXBwZW5kKCRjb250ZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheUxvYWRMaXN0TW9kYWwoKSB7XHJcbiAgbGV0ICRvdmVybGF5ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnb3ZlcmxheScpO1xyXG4gIGxldCAkbW9kYWwgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtb2RhbCcpXHJcbiAgICAuYXR0cignYXJpYS1saXZlJywgJ2Fzc2VydGl2ZScpO1xyXG4gICQoJ2JvZHknKS5hcHBlbmQoJG92ZXJsYXksICRtb2RhbCk7XHJcblxyXG5cclxuICBsZXQgJGNvbnRlbnQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtb2RhbC1jb250ZW50Jyk7XHJcbiAgbGV0ICRsb2FkTW9kYWxGb3JtID0gJCgnPGZvcm0+JylcclxuICAgIC5hZGRDbGFzcygnanMtbG9hZC1saXN0LWZvcm0nKVxyXG4gICAgLmh0bWwoYFxyXG4gICAgICA8bGVnZW5kPiBMb2FkIEEgTGlzdCA8L2xlZ2VuZD5cclxuICAgICAgPGxhYmVsIGZvcj1cImlkXCIgPiBJRCA8L2xhYmVsPlxyXG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiaWRcIiBpZD1cImxvYWQtaWRcIj5cclxuICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWJ1dHRvbnNcIj5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJMb2FkXCIgY2xhc3M9XCJidXR0b25cIj5cclxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwianMtY2xvc2UtbW9kYWwgYnV0dG9uXCI+IENhbmNlbCA8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIGApO1xyXG5cclxuICAkY29udGVudC5hcHBlbmQoJGxvYWRNb2RhbEZvcm0pO1xyXG4gICRtb2RhbC5hcHBlbmQoJGNvbnRlbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5TmV3RW50cnlNb2RhbCgpIHtcclxuICBsZXQgJG92ZXJsYXkgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdvdmVybGF5Jyk7XHJcbiAgbGV0ICRtb2RhbCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21vZGFsJylcclxuICAgIC5hdHRyKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XHJcbiAgJCgnYm9keScpLmFwcGVuZCgkb3ZlcmxheSwgJG1vZGFsKTtcclxuXHJcbiAgbGV0ICRjb250ZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbW9kYWwtY29udGVudCcpO1xyXG4gIGxldCAkbmV3RW50cnlGb3JtID0gJCgnPGZvcm0+JylcclxuICAgIC5hZGRDbGFzcygnanMtbmV3LWVudHJ5LWZvcm0nKVxyXG4gICAgLmh0bWwoYFxyXG4gICAgPGxlZ2VuZD4gTmV3IEl0ZW0gPC9sZWdlbmQ+XHJcbiAgICA8bGFiZWwgZm9yID1cIml0ZW1cIj4gSXRlbSA8L2xhYmVsPlxyXG4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIml0ZW1cIiBpZD1cIm5ldy1pdGVtXCIgcmVxdWlyZWQ+XHJcbiAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIG5hbWU9XCJhbW91bnRcIiBpZD1cImFtb3VudFwiIG1pbj1cIjFcIiB2YWx1ZT1cIjFcIiByZXF1aXJlZD5cclxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWJ1dHRvbnNcIj5cclxuICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIkFkZFwiIGNsYXNzPVwiYnV0dG9uXCI+XHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwianMtY2xvc2UtbW9kYWwgYnV0dG9uXCI+IENhbmNlbCA8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gICAgYCk7XHJcblxyXG4gICRjb250ZW50LmFwcGVuZCgkbmV3RW50cnlGb3JtKTtcclxuICAkbW9kYWwuYXBwZW5kKCRjb250ZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcclxuICAkKCcub3ZlcmxheScpLnJlbW92ZSgpO1xyXG4gICQoJy5tb2RhbCcpLnJlbW92ZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZE5ld0xpc3QobmFtZSwgdGVtcGxhdGUpIHtcclxuICBjb25zb2xlLmxvZyhgYnVpbGRpbmcgbmV3IGxpc3Qgd2l0aCAke25hbWV9IGFuZCAke3RlbXBsYXRlfWApO1xyXG5cclxuICBsZXQgbmV3TGlzdCA9IHtcclxuICAgIG5hbWU6IG5hbWUsXHJcbiAgICBpdGVtczogdGVtcGxhdGUsXHJcbiAgfTtcclxuICBwYWNraW5nQXBpXHJcbiAgICAucG9zdChuZXdMaXN0KVxyXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgIGNvbnN0IHtsb2FkUGxhbm5lcn0gPSByZXF1aXJlKCcuL2xpc3QtcGxhbm5lcicpO1xyXG4gICAgICBsb2FkUGxhbm5lcihyZXMuaWQpO1xyXG4gICAgfSk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkTGlzdChpZCkge1xyXG4gIGNvbnNvbGUubG9nKGBsb2FkaW5nIGxpc3Qgd2l0aCAke2lkfWApO1xyXG4gIGNvbnN0IHtsb2FkUGxhbm5lcn0gPSByZXF1aXJlKCcuL2xpc3QtcGxhbm5lcicpO1xyXG4gIGxvYWRQbGFubmVyKGlkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkTmV3RW50cnkobGlzdCwgbmFtZSwgdG9QYWNrID0gMSkge1xyXG4gIGNvbnNvbGUubG9nKGBhZGRpbmcgbmV3IGl0ZW0gJHtuYW1lfWApO1xyXG4gIGxpc3QuaXRlbXMucHVzaCh7XHJcbiAgICBpdGVtOiBuYW1lLFxyXG4gICAgcGFja2VkOiAwLFxyXG4gICAgdG9QYWNrOiB0b1BhY2ssXHJcbiAgfSk7XHJcblxyXG4gIHBhY2tpbmdBcGlcclxuICAgIC51cGRhdGVkQnlJZChsaXN0LmlkLCBsaXN0KVxyXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgIGNvbnN0IHtsb2FkUGxhbm5lcn0gPSByZXF1aXJlKCcuL2xpc3QtcGxhbm5lcicpO1xyXG4gICAgICBsb2FkUGxhbm5lcihsaXN0LmlkKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtidWlsZE1vZGFsTGlzdGVuZXJzfTsiLCJmdW5jdGlvbiBwb3N0KGRhdGEpIHtcclxuICBsZXQgc2V0dGluZ3MgPSB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIHVybDogJy4vYXBpL3BhY2tpbmcnLFxyXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcclxuICB9XHJcblxyXG4gIHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNdWx0aXBsZSgpIHtcclxuICBsZXQgc2V0dGluZ3MgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgdXJsOiAnLi9hcGkvcGFja2luZycsXHJcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEJ5SWQoaWQpIHtcclxuICBsZXQgc2V0dGluZ3MgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgdXJsOiBgLi9hcGkvcGFja2luZy8ke2lkfWAsXHJcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZWRCeUlkKGlkLCBkYXRhKSB7XHJcbiAgaWYgKGRhdGEuaWQgIT09IGlkKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtYXRlciBJRCBhbmQgZGF0YS5pZCBkbyBub3QgbWF0Y2gnKTtcclxuICB9XHJcbiAgbGV0IHNldHRpbmdzID0ge1xyXG4gICAgbWV0aG9kOiAnUFVUJyxcclxuICAgIHVybDogYC4vYXBpL3BhY2tpbmcvJHtpZH1gLFxyXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcclxuICB9XHJcblxyXG4gIHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZWxldGVCeUlkKGlkKSB7XHJcbiAgbGV0IHNldHRpbmdzID0ge1xyXG4gICAgbWV0aG9kOiAnREVMRVRFJyxcclxuICAgIHVybDogYC4vYXBpL3BhY2tpbmcvJHtpZH1gLFxyXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcclxuICB9XHJcblxyXG4gIHJldHVybiAkLmFqYXgoc2V0dGluZ3MpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtnZXRNdWx0aXBsZSwgZ2V0QnlJZCwgZGVsZXRlQnlJZCwgdXBkYXRlZEJ5SWQsIHBvc3R9OyJdfQ==
