(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {loadManager} = require('./lists-manager');

$(startUp);

function startUp() {
  loadManager();
}
},{"./lists-manager":2}],2:[function(require,module,exports){
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
},{"./modals":3,"./packing-api":4,"./planner":5}],3:[function(require,module,exports){
const packingApi = require('./packing-api');

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

    const {templates} = require('./templates');
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
    saveAndUpdate(list);

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
      const {loadPlanner} = require('./planner');
      loadPlanner(res.id);
    });

}

function loadList(id) {
  console.log(`loading list with ${id}`);
  const {loadPlanner} = require('./planner');
  loadPlanner(id);
}

function addNewEntry(list, name, toPack = 1) {
  console.log(`adding new item ${name}`);
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

module.exports = {buildModalListeners, addNewEntry, saveAndUpdate};
},{"./packing-api":4,"./planner":5,"./templates":6}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
const packingApi = require('./packing-api');
const {addNewEntry, buildModalListeners, saveAndUpdate} = require('./modals');
let currentList = {};


function loadPlanner(id) {
  buildPage();
  buildListeners(currentList);
  getAndDisplayData(id);
}

function buildPage() {
  $('main').empty();

  const $optionBar = buildOptionBar();
  const $quickItems = buildQuickItems();
  const $tableSection = $('<section>').addClass('table-section');
  const $content = $('<div>').addClass('flex-grid');

  $content.append($quickItems, $tableSection);
  $('main').append($optionBar, $content);

  function buildOptionBar() {
    const $optionBar = $('<section>').addClass('option-bar flex-grid');
    const $newEntryButton = $('<div>')
      .addClass('col js-new-entry-button')
      .append('<button> New Entry');

    const $emptyCol = $('<div>').addClass('col');
    const $mainListButton = $('<div>').addClass('col js-back');
    $mainListButton.append('<button> Back');
    const $saveListButton = $('<div>').addClass('col js-save');
    $saveListButton.append('<button> Save');

    $optionBar.append($newEntryButton, $emptyCol, $mainListButton, $emptyCol.clone(), $saveListButton);
    return $optionBar;
  }

  function buildQuickItems() {
    let $quickItems = $('<section>').addClass('quick-items');
    let items = ['clothes', 'socks', 'food', 'swimsuit', 'phone charger', 'first-aid kit'];
    items.forEach(function(item) {
      let $newButton = $('<button>')
        .text(item)
        .addClass('js-quick-item');
      $quickItems.append($newButton);
    });
    return $quickItems;
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
    packingApi.updatedById(currentList.id, currentList);
  });

  $('main').on('click', '.js-quick-item', function() {
    const newItem = $(this).text();
    let hasItem = false;

    currentList.items.forEach(item => {
      if (item.item === newItem) {
        item.toPack++;
        hasItem = true;
      }
    });

    if (!hasItem) {
      addNewEntry(currentList, newItem);
    }

    saveAndUpdate(currentList);
  })

}

module.exports = {loadPlanner};
},{"./lists-manager":2,"./modals":3,"./packing-api":4}],6:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L2xpc3RzLW1hbmFnZXIuanMiLCJkZXYvbW9kYWxzLmpzIiwiZGV2L3BhY2tpbmctYXBpLmpzIiwiZGV2L3BsYW5uZXIuanMiLCJkZXYvdGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3Qge2xvYWRNYW5hZ2VyfSA9IHJlcXVpcmUoJy4vbGlzdHMtbWFuYWdlcicpO1xyXG5cclxuJChzdGFydFVwKTtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0VXAoKSB7XHJcbiAgbG9hZE1hbmFnZXIoKTtcclxufSIsImNvbnN0IHtidWlsZE1vZGFsTGlzdGVuZXJzfSA9IHJlcXVpcmUoJy4vbW9kYWxzJyk7XHJcbmNvbnN0IHBhY2tpbmdBcGkgPSByZXF1aXJlKCcuL3BhY2tpbmctYXBpJyk7XHJcblxyXG5mdW5jdGlvbiBsb2FkTWFuYWdlcigpIHtcclxuICBidWlsZFBhZ2UoKTtcclxuICBidWlsZExpc3RlbmVycygpO1xyXG4gIGdldEFuZERpc3BsYXlMaXN0cygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFBhZ2UoKSB7XHJcbiAgJCgnbWFpbicpLmVtcHR5KCk7XHJcbiAgbGV0ICRvcHRpb25CYXIgPSBidWlsZE9wdGlvbkJhcigpO1xyXG4gIGxldCAkdGFibGVTZWN0aW9uID0gJCgnPHNlY3Rpb24+JykuYWRkQ2xhc3MoJ3RhYmxlLXNlY3Rpb24nKTtcclxuXHJcbiAgJCgnbWFpbicpLmFwcGVuZCgkb3B0aW9uQmFyLCAkdGFibGVTZWN0aW9uKTtcclxuXHJcbiAgZnVuY3Rpb24gYnVpbGRPcHRpb25CYXIoKSB7XHJcbiAgICBsZXQgJG9wdGlvbkJhciA9ICQoJzxzZWN0aW9uPicpLmFkZENsYXNzKCdvcHRpb24tYmFyIGZsZXgtZ3JpZCcpO1xyXG4gICAgbGV0ICRuZXdMaXN0QnV0dG9uID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sIGpzLW5ldy1saXN0LWJ1dHRvbicpO1xyXG4gICAgJG5ld0xpc3RCdXR0b24uYXBwZW5kKCc8YnV0dG9uPiBOZXcgUGFja2luZyBMaXN0Jyk7XHJcbiAgICBsZXQgJGVtcHR5Q29sID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sJyk7XHJcblxyXG4gICAgJG9wdGlvbkJhci5hcHBlbmQoJG5ld0xpc3RCdXR0b24sICRlbXB0eUNvbCwgJGVtcHR5Q29sLmNsb25lKCkpO1xyXG4gICAgcmV0dXJuICRvcHRpb25CYXI7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZExpc3RlbmVycygpIHtcclxuICBsZXQgJG1haW4gPSAkKCdtYWluJyk7XHJcbiAgJG1haW4ub2ZmKCk7XHJcbiAgJCgnYm9keScpLm9mZigpO1xyXG5cclxuICAkbWFpbi5vbignY2xpY2snLCAndHI6bm90KDpmaXJzdC1jaGlsZCknLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBpZCA9ICQodGhpcykuZGF0YSgnaWQnKTtcclxuICAgIGNvbnN0IHtsb2FkUGxhbm5lcn0gPSByZXF1aXJlKCcuL3BsYW5uZXInKTtcclxuICAgICQoJy5qcy10YWJsZS1yZW1vdmUnKTtcclxuICAgIGxvYWRQbGFubmVyKGlkKTtcclxuICB9KTtcclxuXHJcbiAgJG1haW4ub24oJ2NsaWNrJywgJy5qcy1kZWxldGUtbGlzdCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgIGxldCBpZCA9ICQodGhpcykuY2xvc2VzdCgndHInKS5kYXRhKCdpZCcpO1xyXG4gICAgY29uc29sZS5sb2coaWQpO1xyXG4gICAgcGFja2luZ0FwaS5kZWxldGVCeUlkKGlkKVxyXG4gICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCcuanMtdGFibGUnKS5yZW1vdmUoKTtcclxuICAgICAgICBnZXRBbmREaXNwbGF5TGlzdHMoKTtcclxuICAgICAgfSlcclxuICB9KVxyXG5cclxuICBidWlsZE1vZGFsTGlzdGVuZXJzKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFuZERpc3BsYXlMaXN0cygpIHtcclxuICBnZXRMaXN0cygpLnRoZW4oZGlzcGxheUxpc3RzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TGlzdHMoKSB7XHJcbiAgcmV0dXJuIHBhY2tpbmdBcGkuZ2V0TXVsdGlwbGUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheUxpc3RzKGxpc3RzKSB7XHJcbiAgbGV0ICR0YWJsZSA9ICQoJzx0YWJsZT4nKVxyXG4gICAgLmFkZENsYXNzKCdqcy10YWJsZScpXHJcbiAgICAuYXBwZW5kKFxyXG4gICAgICAkKCc8dHI+JykuYXBwZW5kKFxyXG4gICAgICAgICQoJzx0aD4nKS50ZXh0KCdOYW1lJyksXHJcbiAgICAgICAgJCgnPHRoPicpLnRleHQoJ0l0ZW1zJyksXHJcbiAgICAgICAgJCgnPHRoPicpXHJcbiAgICAgIClcclxuICAgICk7XHJcblxyXG4gIGxpc3RzLmZvckVhY2goKGxpc3QpID0+IHtcclxuICAgIGxldCAkbmV3Um93ID0gJCgnPHRyPicpLmRhdGEoJ2lkJywgbGlzdC5pZClcclxuICAgICAgLmFwcGVuZChcclxuICAgICAgICAkKCc8dGQ+JykudGV4dChgJHtsaXN0Lm5hbWV9YCksXHJcbiAgICAgICAgJCgnPHRkPicpLnRleHQoYCR7bGlzdC5wYWNrZWR9IC8gJHtsaXN0LnRvUGFja31gKSxcclxuICAgICAgICAkKCc8dGQ+JykuYWRkQ2xhc3MoJ3RkLWRlbGV0ZScpLmFwcGVuZChcclxuICAgICAgICAgICQoJzxidXR0b24+JykudGV4dCgnRGVsZXRlJykuYWRkQ2xhc3MoJ2pzLWRlbGV0ZS1saXN0JyksXHJcbiAgICAgICAgKVxyXG4gICAgICApO1xyXG4gICAgJHRhYmxlLmFwcGVuZCgkbmV3Um93KTtcclxuICB9KTtcclxuICAkKCcudGFibGUtc2VjdGlvbicpLmFwcGVuZCgkdGFibGUpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7bG9hZE1hbmFnZXJ9IiwiY29uc3QgcGFja2luZ0FwaSA9IHJlcXVpcmUoJy4vcGFja2luZy1hcGknKTtcclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTW9kYWxMaXN0ZW5lcnMobGlzdCkge1xyXG4gIGxldCAkbWFpbiA9ICQoJ21haW4nKTtcclxuICBsZXQgJGJvZHkgPSAkKCdib2R5Jyk7XHJcblxyXG4gIGJ1aWxkU2hhcmVkTGlzdGVuZXJzKCRib2R5KTtcclxuXHJcbiAgLy8gUmVxdWlyZXMgYSBjbGlja2FibGUgZWxlbWVudCB3aXRoIHRoZSBjbGFzcyBqcy1uZXctbGlzdC1idXR0b25cclxuICBidWlsZE5ld0xpc3RMaXN0ZW5lcigkbWFpbiwgJGJvZHkpO1xyXG5cclxuICAvLyBSZXF1aXJlcyBhIGNsaWNrYWJsZSBlbGVtZW50IHdpdGggdGhlIGNsYXNzIGpzLWxvYWQtbGlzdC1idXR0b25cclxuICBidWlsZExvYWRMaXN0ZW5lcigkbWFpbiwgJGJvZHkpO1xyXG5cclxuICAvLyBSZXF1aXJlcyBhIGNsaWNrYWJsZSBlbGVtZW50IHdpdGggdGhlIGNsYXNzIGpzLW5ldy1lbnRyeS1idXR0b25cclxuICBidWlsZE5ld0l0ZW1MaXN0ZW5lcnMoJG1haW4sICRib2R5LCBsaXN0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRTaGFyZWRMaXN0ZW5lcnMoJGJvZHkpIHtcclxuICAkYm9keS5vbignY2xpY2snLCAnLmpzLWNsb3NlLW1vZGFsJywgY2xvc2VNb2RhbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTmV3TGlzdExpc3RlbmVyKCRtYWluLCAkYm9keSkge1xyXG4gICRtYWluLm9uKCdjbGljaycsICcuanMtbmV3LWxpc3QtYnV0dG9uJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBkaXNwbGF5TmV3TGlzdE1vZGFsKCk7XHJcbiAgfSk7XHJcblxyXG4gICRib2R5Lm9uKCdzdWJtaXQnLCAnLmpzLW5ldy1saXN0LWZvcm0nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgbGV0IHZhbHVlcyA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgbGV0IG5hbWUgPSB2YWx1ZXNbMF0udmFsdWU7XHJcbiAgICBsZXQgdGVtcGxhdGUgPSB2YWx1ZXNbMV0udmFsdWU7XHJcblxyXG4gICAgY29uc3Qge3RlbXBsYXRlc30gPSByZXF1aXJlKCcuL3RlbXBsYXRlcycpO1xyXG4gICAgYnVpbGROZXdMaXN0KG5hbWUsIHRlbXBsYXRlc1t0ZW1wbGF0ZV0pO1xyXG5cclxuICAgIGNsb3NlTW9kYWwoKTtcclxuICB9KTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTG9hZExpc3RlbmVyKCRtYWluLCAkYm9keSkge1xyXG4gICRtYWluLm9uKCdjbGljaycsICcuanMtbG9hZC1saXN0LWJ1dHRvbicsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZGlzcGxheUxvYWRMaXN0TW9kYWwoKTtcclxuICB9KTtcclxuXHJcbiAgJGJvZHkub24oJ3N1Ym1pdCcsICcuanMtbG9hZC1saXN0LWZvcm0nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgbGV0IHZhbHVlcyA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgbG9hZExpc3QodmFsdWVzWzBdLnZhbHVlKTtcclxuXHJcbiAgICBjbG9zZU1vZGFsKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTmV3SXRlbUxpc3RlbmVycygkbWFpbiwgJGJvZHksIGxpc3QpIHtcclxuICAkbWFpbi5vbignY2xpY2snLCAnLmpzLW5ldy1lbnRyeS1idXR0b24nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGRpc3BsYXlOZXdFbnRyeU1vZGFsKCk7XHJcbiAgfSk7XHJcblxyXG4gICRib2R5Lm9uKCdzdWJtaXQnLCAnLmpzLW5ldy1lbnRyeS1mb3JtJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGxldCB2YWx1ZXMgPSAkKHRoaXMpLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICBjb25zb2xlLmxvZyh2YWx1ZXMpO1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBhZGROZXdFbnRyeShsaXN0LCB2YWx1ZXNbMF0udmFsdWUsIHZhbHVlc1sxXS52YWx1ZSk7XHJcbiAgICBzYXZlQW5kVXBkYXRlKGxpc3QpO1xyXG5cclxuICAgIGNsb3NlTW9kYWwoKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheU5ld0xpc3RNb2RhbCgpIHtcclxuICBsZXQgJG92ZXJsYXkgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdvdmVybGF5Jyk7XHJcbiAgbGV0ICRtb2RhbCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21vZGFsJylcclxuICAgIC5hdHRyKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XHJcbiAgJCgnYm9keScpLmFwcGVuZCgkb3ZlcmxheSwgJG1vZGFsKTtcclxuXHJcbiAgbGV0ICRjb250ZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbW9kYWwtY29udGVudCcpO1xyXG4gIGxldCAkbmV3TGlzdEZvcm0gPSAkKCc8Zm9ybT4nKVxyXG4gICAgLmFkZENsYXNzKCdqcy1uZXctbGlzdC1mb3JtJylcclxuICAgIC5odG1sKGBcclxuICAgICAgPGxlZ2VuZD4gQ3JlYXRlIE5ldyBMaXN0IDwvbGVnZW5kPlxyXG4gICAgICA8bGFiZWwgZm9yPVwibmFtZVwiPk5hbWU6IDwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgaWQ9XCJuZXctbGlzdC1uYW1lXCIgcmVxdWlyZWQ+XHJcblxyXG4gICAgICA8bGFiZWwgZm9yPVwidGVtcGxhdGVcIj5UZW1wbGF0ZTwvbGFiZWw+XHJcbiAgICAgIDxzZWxlY3QgbmFtZT1cInRlbXBsYXRlXCIgaWQ9XCJ0ZW1wbGF0ZS1zZWxlY3RcIj5cclxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiTm9uZVwiPk5vbmU8L29wdGlvbj5cclxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQ2FtcGluZ1wiPkNhbXBpbmc8L29wdGlvbj5cclxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQmVhY2hcIj5CZWFjaDwvb3B0aW9uPlxyXG4gICAgICA8L3NlbGVjdD5cclxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tYnV0dG9uc1wiPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJDcmVhdGVcIiBjbGFzcz1cImJ1dHRvblwiPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwianMtY2xvc2UtbW9kYWwgYnV0dG9uXCI+IENhbmNlbCA8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgYCk7XHJcblxyXG4gICRjb250ZW50LmFwcGVuZCgkbmV3TGlzdEZvcm0pO1xyXG4gICRtb2RhbC5hcHBlbmQoJGNvbnRlbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5TG9hZExpc3RNb2RhbCgpIHtcclxuICBsZXQgJG92ZXJsYXkgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdvdmVybGF5Jyk7XHJcbiAgbGV0ICRtb2RhbCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21vZGFsJylcclxuICAgIC5hdHRyKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XHJcbiAgJCgnYm9keScpLmFwcGVuZCgkb3ZlcmxheSwgJG1vZGFsKTtcclxuXHJcblxyXG4gIGxldCAkY29udGVudCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWNvbnRlbnQnKTtcclxuICBsZXQgJGxvYWRNb2RhbEZvcm0gPSAkKCc8Zm9ybT4nKVxyXG4gICAgLmFkZENsYXNzKCdqcy1sb2FkLWxpc3QtZm9ybScpXHJcbiAgICAuaHRtbChgXHJcbiAgICAgIDxsZWdlbmQ+IExvYWQgQSBMaXN0IDwvbGVnZW5kPlxyXG4gICAgICA8bGFiZWwgZm9yPVwiaWRcIiA+IElEIDwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJpZFwiIGlkPVwibG9hZC1pZFwiPlxyXG4gICAgICAgPGRpdiBjbGFzcz1cImZvcm0tYnV0dG9uc1wiPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIkxvYWRcIiBjbGFzcz1cImJ1dHRvblwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJqcy1jbG9zZS1tb2RhbCBidXR0b25cIj4gQ2FuY2VsIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgYCk7XHJcblxyXG4gICRjb250ZW50LmFwcGVuZCgkbG9hZE1vZGFsRm9ybSk7XHJcbiAgJG1vZGFsLmFwcGVuZCgkY29udGVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlOZXdFbnRyeU1vZGFsKCkge1xyXG4gIGxldCAkb3ZlcmxheSA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcclxuICBsZXQgJG1vZGFsID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbW9kYWwnKVxyXG4gICAgLmF0dHIoJ2FyaWEtbGl2ZScsICdhc3NlcnRpdmUnKTtcclxuICAkKCdib2R5JykuYXBwZW5kKCRvdmVybGF5LCAkbW9kYWwpO1xyXG5cclxuICBsZXQgJGNvbnRlbnQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtb2RhbC1jb250ZW50Jyk7XHJcbiAgbGV0ICRuZXdFbnRyeUZvcm0gPSAkKCc8Zm9ybT4nKVxyXG4gICAgLmFkZENsYXNzKCdqcy1uZXctZW50cnktZm9ybScpXHJcbiAgICAuaHRtbChgXHJcbiAgICA8bGVnZW5kPiBOZXcgSXRlbSA8L2xlZ2VuZD5cclxuICAgIDxsYWJlbCBmb3IgPVwiaXRlbVwiPiBJdGVtIDwvbGFiZWw+XHJcbiAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiaXRlbVwiIGlkPVwibmV3LWl0ZW1cIiByZXF1aXJlZD5cclxuICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbmFtZT1cImFtb3VudFwiIGlkPVwiYW1vdW50XCIgbWluPVwiMVwiIG1heD1cIjEwXCIgdmFsdWU9XCIxXCIgcmVxdWlyZWQ+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1idXR0b25zXCI+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJBZGRcIiBjbGFzcz1cImJ1dHRvblwiPlxyXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImpzLWNsb3NlLW1vZGFsIGJ1dHRvblwiPiBDYW5jZWwgPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuICAgIGApO1xyXG5cclxuICAkY29udGVudC5hcHBlbmQoJG5ld0VudHJ5Rm9ybSk7XHJcbiAgJG1vZGFsLmFwcGVuZCgkY29udGVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XHJcbiAgJCgnLm92ZXJsYXknKS5yZW1vdmUoKTtcclxuICAkKCcubW9kYWwnKS5yZW1vdmUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGROZXdMaXN0KG5hbWUsIHRlbXBsYXRlKSB7XHJcbiAgY29uc29sZS5sb2coYGJ1aWxkaW5nIG5ldyBsaXN0IHdpdGggJHtuYW1lfSBhbmQgJHt0ZW1wbGF0ZX1gKTtcclxuXHJcbiAgbGV0IG5ld0xpc3QgPSB7XHJcbiAgICBuYW1lOiBuYW1lLFxyXG4gICAgaXRlbXM6IHRlbXBsYXRlLFxyXG4gIH07XHJcbiAgcGFja2luZ0FwaVxyXG4gICAgLnBvc3QobmV3TGlzdClcclxuICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICBjb25zdCB7bG9hZFBsYW5uZXJ9ID0gcmVxdWlyZSgnLi9wbGFubmVyJyk7XHJcbiAgICAgIGxvYWRQbGFubmVyKHJlcy5pZCk7XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvYWRMaXN0KGlkKSB7XHJcbiAgY29uc29sZS5sb2coYGxvYWRpbmcgbGlzdCB3aXRoICR7aWR9YCk7XHJcbiAgY29uc3Qge2xvYWRQbGFubmVyfSA9IHJlcXVpcmUoJy4vcGxhbm5lcicpO1xyXG4gIGxvYWRQbGFubmVyKGlkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkTmV3RW50cnkobGlzdCwgbmFtZSwgdG9QYWNrID0gMSkge1xyXG4gIGNvbnNvbGUubG9nKGBhZGRpbmcgbmV3IGl0ZW0gJHtuYW1lfWApO1xyXG4gIGxpc3QuaXRlbXMucHVzaCh7XHJcbiAgICBpdGVtOiBuYW1lLFxyXG4gICAgcGFja2VkOiAwLFxyXG4gICAgdG9QYWNrOiB0b1BhY2ssXHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNhdmVBbmRVcGRhdGUobGlzdCkge1xyXG4gIHBhY2tpbmdBcGlcclxuICAgIC51cGRhdGVkQnlJZChsaXN0LmlkLCBsaXN0KVxyXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgIGNvbnN0IHtsb2FkUGxhbm5lcn0gPSByZXF1aXJlKCcuL3BsYW5uZXInKTtcclxuICAgICAgbG9hZFBsYW5uZXIobGlzdC5pZCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7YnVpbGRNb2RhbExpc3RlbmVycywgYWRkTmV3RW50cnksIHNhdmVBbmRVcGRhdGV9OyIsImZ1bmN0aW9uIHBvc3QoZGF0YSkge1xyXG4gIGxldCBzZXR0aW5ncyA9IHtcclxuICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgdXJsOiAnLi9hcGkvcGFja2luZycsXHJcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE11bHRpcGxlKCkge1xyXG4gIGxldCBzZXR0aW5ncyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB1cmw6ICcuL2FwaS9wYWNraW5nJyxcclxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXHJcbiAgfVxyXG5cclxuICByZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QnlJZChpZCkge1xyXG4gIGxldCBzZXR0aW5ncyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB1cmw6IGAuL2FwaS9wYWNraW5nLyR7aWR9YCxcclxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXHJcbiAgfVxyXG5cclxuICByZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlZEJ5SWQoaWQsIGRhdGEpIHtcclxuICBpZiAoZGF0YS5pZCAhPT0gaWQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1hdGVyIElEIGFuZCBkYXRhLmlkIGRvIG5vdCBtYXRjaCcpO1xyXG4gIH1cclxuICBsZXQgc2V0dGluZ3MgPSB7XHJcbiAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgdXJsOiBgLi9hcGkvcGFja2luZy8ke2lkfWAsXHJcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlbGV0ZUJ5SWQoaWQpIHtcclxuICBsZXQgc2V0dGluZ3MgPSB7XHJcbiAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgdXJsOiBgLi9hcGkvcGFja2luZy8ke2lkfWAsXHJcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2dldE11bHRpcGxlLCBnZXRCeUlkLCBkZWxldGVCeUlkLCB1cGRhdGVkQnlJZCwgcG9zdH07IiwiY29uc3QgcGFja2luZ0FwaSA9IHJlcXVpcmUoJy4vcGFja2luZy1hcGknKTtcclxuY29uc3Qge2FkZE5ld0VudHJ5LCBidWlsZE1vZGFsTGlzdGVuZXJzLCBzYXZlQW5kVXBkYXRlfSA9IHJlcXVpcmUoJy4vbW9kYWxzJyk7XHJcbmxldCBjdXJyZW50TGlzdCA9IHt9O1xyXG5cclxuXHJcbmZ1bmN0aW9uIGxvYWRQbGFubmVyKGlkKSB7XHJcbiAgYnVpbGRQYWdlKCk7XHJcbiAgYnVpbGRMaXN0ZW5lcnMoY3VycmVudExpc3QpO1xyXG4gIGdldEFuZERpc3BsYXlEYXRhKGlkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRQYWdlKCkge1xyXG4gICQoJ21haW4nKS5lbXB0eSgpO1xyXG5cclxuICBjb25zdCAkb3B0aW9uQmFyID0gYnVpbGRPcHRpb25CYXIoKTtcclxuICBjb25zdCAkcXVpY2tJdGVtcyA9IGJ1aWxkUXVpY2tJdGVtcygpO1xyXG4gIGNvbnN0ICR0YWJsZVNlY3Rpb24gPSAkKCc8c2VjdGlvbj4nKS5hZGRDbGFzcygndGFibGUtc2VjdGlvbicpO1xyXG4gIGNvbnN0ICRjb250ZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnZmxleC1ncmlkJyk7XHJcblxyXG4gICRjb250ZW50LmFwcGVuZCgkcXVpY2tJdGVtcywgJHRhYmxlU2VjdGlvbik7XHJcbiAgJCgnbWFpbicpLmFwcGVuZCgkb3B0aW9uQmFyLCAkY29udGVudCk7XHJcblxyXG4gIGZ1bmN0aW9uIGJ1aWxkT3B0aW9uQmFyKCkge1xyXG4gICAgY29uc3QgJG9wdGlvbkJhciA9ICQoJzxzZWN0aW9uPicpLmFkZENsYXNzKCdvcHRpb24tYmFyIGZsZXgtZ3JpZCcpO1xyXG4gICAgY29uc3QgJG5ld0VudHJ5QnV0dG9uID0gJCgnPGRpdj4nKVxyXG4gICAgICAuYWRkQ2xhc3MoJ2NvbCBqcy1uZXctZW50cnktYnV0dG9uJylcclxuICAgICAgLmFwcGVuZCgnPGJ1dHRvbj4gTmV3IEVudHJ5Jyk7XHJcblxyXG4gICAgY29uc3QgJGVtcHR5Q29sID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sJyk7XHJcbiAgICBjb25zdCAkbWFpbkxpc3RCdXR0b24gPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdjb2wganMtYmFjaycpO1xyXG4gICAgJG1haW5MaXN0QnV0dG9uLmFwcGVuZCgnPGJ1dHRvbj4gQmFjaycpO1xyXG4gICAgY29uc3QgJHNhdmVMaXN0QnV0dG9uID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sIGpzLXNhdmUnKTtcclxuICAgICRzYXZlTGlzdEJ1dHRvbi5hcHBlbmQoJzxidXR0b24+IFNhdmUnKTtcclxuXHJcbiAgICAkb3B0aW9uQmFyLmFwcGVuZCgkbmV3RW50cnlCdXR0b24sICRlbXB0eUNvbCwgJG1haW5MaXN0QnV0dG9uLCAkZW1wdHlDb2wuY2xvbmUoKSwgJHNhdmVMaXN0QnV0dG9uKTtcclxuICAgIHJldHVybiAkb3B0aW9uQmFyO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYnVpbGRRdWlja0l0ZW1zKCkge1xyXG4gICAgbGV0ICRxdWlja0l0ZW1zID0gJCgnPHNlY3Rpb24+JykuYWRkQ2xhc3MoJ3F1aWNrLWl0ZW1zJyk7XHJcbiAgICBsZXQgaXRlbXMgPSBbJ2Nsb3RoZXMnLCAnc29ja3MnLCAnZm9vZCcsICdzd2ltc3VpdCcsICdwaG9uZSBjaGFyZ2VyJywgJ2ZpcnN0LWFpZCBraXQnXTtcclxuICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICBsZXQgJG5ld0J1dHRvbiA9ICQoJzxidXR0b24+JylcclxuICAgICAgICAudGV4dChpdGVtKVxyXG4gICAgICAgIC5hZGRDbGFzcygnanMtcXVpY2staXRlbScpO1xyXG4gICAgICAkcXVpY2tJdGVtcy5hcHBlbmQoJG5ld0J1dHRvbik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiAkcXVpY2tJdGVtcztcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFuZERpc3BsYXlEYXRhKGlkKSB7XHJcbiAgZ2V0RGF0YShpZClcclxuICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICBjdXJyZW50TGlzdC5pZCA9IGRhdGEuaWQ7XHJcbiAgICAgIGN1cnJlbnRMaXN0Lml0ZW1zID0gZGF0YS5pdGVtcztcclxuICAgICAgY3VycmVudExpc3QubmFtZSA9IGRhdGEubmFtZTtcclxuICAgICAgcmV0dXJuIGN1cnJlbnRMaXN0O1xyXG4gICAgfSlcclxuICAgIC50aGVuKGRpc3BsYXlEYXRhKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXREYXRhKGlkKSB7XHJcbiAgcmV0dXJuIHBhY2tpbmdBcGkuZ2V0QnlJZChpZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlEYXRhKGRhdGEpIHtcclxuICBsZXQgJHRhYmxlID0gJCgnPHRhYmxlPicpXHJcbiAgICAuYWRkQ2xhc3MoJ2pzLXRhYmxlIGl0ZW1zLXRhYmxlJylcclxuICAgIC5hcHBlbmQoXHJcbiAgICAgICQoJzx0cj4nKS5hcHBlbmQoXHJcbiAgICAgICAgJCgnPHRoPicpLFxyXG4gICAgICAgICQoJzx0aD4nKS50ZXh0KCdJdGVtJyksXHJcbiAgICAgICAgJCgnPHRoPicpLnRleHQoJ1RvIFBhY2snKSxcclxuICAgICAgICAkKCc8dGg+JylcclxuICAgICAgKVxyXG4gICAgKTtcclxuXHJcbiAgZGF0YS5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICBsZXQgJG5ld1JvdyA9ICQoJzx0cj4nKS5kYXRhKCdpZCcsIGl0ZW0uX2lkKVxyXG4gICAgICAuYXBwZW5kKFxyXG4gICAgICAgICQoJzx0ZD4nKS5hZGRDbGFzcygndGQtY2hlY2snKVxyXG4gICAgICAgICAgLmFwcGVuZChcclxuICAgICAgICAgICAgJCgnPGJ1dHRvbj4nKS50ZXh0KCdDaGVjaycpLmFkZENsYXNzKCdqcy1jaGVjay1lbnRyeScpXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgICQoJzx0ZD4nKS50ZXh0KGl0ZW0uaXRlbSksXHJcbiAgICAgICAgJCgnPHRkPicpLnRleHQoYCR7aXRlbS5wYWNrZWR9IC8gJHtpdGVtLnRvUGFja31gKS5hZGRDbGFzcygndGQtcGFja2VkJyksXHJcbiAgICAgICAgJCgnPHRkPicpLmFkZENsYXNzKCd0ZC1kZWxldGUnKVxyXG4gICAgICAgICAgLmFwcGVuZChcclxuICAgICAgICAgICAgJCgnPGJ1dHRvbj4nKS50ZXh0KCdkZWxldGUnKS5hZGRDbGFzcygnanMtZGVsZXRlLWVudHJ5JylcclxuICAgICAgICAgIClcclxuICAgICAgKVxyXG5cclxuICAgIGlmIChpdGVtLnBhY2tlZCA+PSBpdGVtLnRvUGFjaykge1xyXG4gICAgICAkbmV3Um93LmFkZENsYXNzKCdncmVlbicpO1xyXG4gICAgfVxyXG5cclxuICAgICR0YWJsZS5hcHBlbmQoJG5ld1Jvdyk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy50YWJsZS1zZWN0aW9uJykuYXBwZW5kKCR0YWJsZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTGlzdGVuZXJzKGxpc3QpIHtcclxuICBsZXQgJG1haW4gPSAkKCdtYWluJyk7XHJcbiAgJG1haW4ub2ZmKCk7XHJcbiAgJCgnYm9keScpLm9mZigpO1xyXG5cclxuICBidWlsZE1vZGFsTGlzdGVuZXJzKGxpc3QpO1xyXG5cclxuICAkbWFpbi5vbignY2xpY2snLCAnLmpzLWJhY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IHtsb2FkTWFuYWdlcn0gPSByZXF1aXJlKCcuL2xpc3RzLW1hbmFnZXInKTtcclxuICAgIGxvYWRNYW5hZ2VyKCk7XHJcbiAgfSk7XHJcblxyXG4gICRtYWluLm9uKCdjbGljaycsICcuanMtY2hlY2stZW50cnknLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCAkcm93ID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpO1xyXG4gICAgbGV0IGl0ZW0gPSBjdXJyZW50TGlzdC5pdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLl9pZCA9PT0gJHJvdy5kYXRhKCdpZCcpKVswXTtcclxuXHJcbiAgICBpZiAoaXRlbS5wYWNrZWQgKyAxID09PSBpdGVtLnRvUGFjaykge1xyXG4gICAgICBpdGVtLnBhY2tlZCsrO1xyXG4gICAgICAkcm93LmFkZENsYXNzKCdncmVlbicpO1xyXG4gICAgfSBlbHNlIGlmIChpdGVtLnBhY2tlZCA8IGl0ZW0udG9QYWNrKSB7XHJcbiAgICAgIGl0ZW0ucGFja2VkKys7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnBhY2tlZCA9IDA7XHJcbiAgICAgICRyb3cucmVtb3ZlQ2xhc3MoJ2dyZWVuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgJHJvdy5jaGlsZHJlbignLnRkLXBhY2tlZCcpLnRleHQoYCR7aXRlbS5wYWNrZWR9IC8gJHtpdGVtLnRvUGFja31gKTtcclxuICB9KVxyXG5cclxuICAkbWFpbi5vbignY2xpY2snLCAnLmpzLWRlbGV0ZS1lbnRyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0ICRyb3cgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJyk7XHJcbiAgICBjdXJyZW50TGlzdC5pdGVtcyA9IGN1cnJlbnRMaXN0Lml0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uX2lkICE9PSAkcm93LmRhdGEoJ2lkJykpO1xyXG4gICAgJHJvdy5yZW1vdmUoKTtcclxuICB9KTtcclxuXHJcbiAgJG1haW4ub24oJ2NsaWNrJywgJy5qcy1zYXZlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBwYWNraW5nQXBpLnVwZGF0ZWRCeUlkKGN1cnJlbnRMaXN0LmlkLCBjdXJyZW50TGlzdCk7XHJcbiAgfSk7XHJcblxyXG4gICQoJ21haW4nKS5vbignY2xpY2snLCAnLmpzLXF1aWNrLWl0ZW0nLCBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSAkKHRoaXMpLnRleHQoKTtcclxuICAgIGxldCBoYXNJdGVtID0gZmFsc2U7XHJcblxyXG4gICAgY3VycmVudExpc3QuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgaWYgKGl0ZW0uaXRlbSA9PT0gbmV3SXRlbSkge1xyXG4gICAgICAgIGl0ZW0udG9QYWNrKys7XHJcbiAgICAgICAgaGFzSXRlbSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghaGFzSXRlbSkge1xyXG4gICAgICBhZGROZXdFbnRyeShjdXJyZW50TGlzdCwgbmV3SXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZUFuZFVwZGF0ZShjdXJyZW50TGlzdCk7XHJcbiAgfSlcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2xvYWRQbGFubmVyfTsiLCJjb25zdCB0ZW1wbGF0ZXMgPSB7XHJcbiAgJ05vbmUnOiBbXSxcclxuICAnQmVhY2gnOiBbXHJcbiAgICB7aXRlbTogJ3Rvd2VsJ30sXHJcbiAgICB7aXRlbTogJ3N1bnNjcmVlbid9LFxyXG4gICAge2l0ZW06ICd3YXRlcid9LFxyXG4gICAge2l0ZW06ICdzd2ltc3VpdCd9LFxyXG4gIF0sXHJcbiAgJ0NhbXBpbmcnOiBbXHJcbiAgICB7aXRlbTogJ3RlbnQnfSxcclxuICAgIHtpdGVtOiAnYnVnLXNwcmF5J30sXHJcbiAgICB7aXRlbTogJ3NsZWVwaW5nLWJhZyd9LFxyXG4gICAge2l0ZW06ICdmbGFzaGxpZ2h0J30sXHJcbiAgICB7aXRlbTogJ2ZpcmUgc3RhcnRlcid9LFxyXG4gICAge2l0ZW06ICd0b2lsZXRyaWVzJ30sXHJcbiAgICB7aXRlbTogJ2Zvb2QnfSxcclxuICAgIHtpdGVtOiAnZmlyc3QtYWlkIGtpdCd9LFxyXG4gIF0sXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlc307Il19
