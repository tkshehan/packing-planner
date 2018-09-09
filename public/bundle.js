(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {loadManager} = require('./lists-manager');

$(startUp);

function startUp() {
  const {loadLanding} = require('./landing.js');
  loadManager();
}
},{"./landing.js":2,"./lists-manager":4}],2:[function(require,module,exports){
const {buildModalListeners} = require('./modals');

function loadLanding() {
  buildPage();
  buildListeners();
}

function buildPage() {
  $('main').empty();
  $('main').append(
    $('<button>')
      .text('New Packing List')
      .addClass('js-new-list-button'),
    $('<button>')
      .text('Load Packing List')
      .addClass('js-load-list-button')
  );

  $('main').append(
    $('<p>').text('try loading 5b917a5844bb542f1853eef8')
  )
}

function buildListeners() {
  buildModalListeners();
}

module.exports = {loadLanding};
},{"./modals":6}],3:[function(require,module,exports){
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
  $('main').off();

  $('main').on('click', '.js-back', function() {
    const {loadManager} = require('./lists-manager');
    loadManager();
  });

  $('main').on('click', '.js-check-entry', function() {
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

  $('main').on('click', '.js-delete-entry', function() {
    let $row = $(this).closest('tr');
    currentList.items = currentList.items.filter(item => item._id !== $row.data('id'));
    $row.remove();
  });

  $('main').on('click', '.js-save', function() {
    packingApi.updatedById(currentList.id, currentList);
  });
}

module.exports = {loadPlanner};
},{"./lists-manager":4,"./packing-client":7}],4:[function(require,module,exports){
const {buildModalListeners} = require('./modals');

const {getMultiple, deleteById} = require('./packing-client');

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
  $('main').off();

  $('main').on('click', 'tr:not(:first-child)', function() {
    let id = $(this).data('id');
    const {loadPlanner} = require('./list-planner');
    loadPlanner(id);
  });

  $('main').on('click', '.js-delete-list', function(event) {
    event.stopImmediatePropagation();
    let id = $(this).closest('tr').data('id');
    console.log(id);
    deleteById(id)
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
  return getMultiple();
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
},{"./list-planner":3,"./modals":6,"./packing-client":7}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
const packingApi = require('./packing-client');

function buildModalListeners() {
  buildSharedListeners();

  // Requires a clickable element with the class js-new-list-button
  buildNewListListener();

  // Requires a clickable element with the class js-load-list-button
  buildLoadListener();

  // Requires a clickable element with the class js-new-entry-button
  buildNewItemListeners();
}

function buildSharedListeners() {
  $('body').on('click', '.js-close-modal', closeModal);
}

function buildNewListListener() {
  $('main').on('click', '.js-new-list-button', function() {
    displayNewListModal();
  });

  $('body').on('submit', '.js-new-list-form', function(event) {
    let values = $(this).serializeArray();
    event.preventDefault();

    let name = values[0].value;
    let template = values[1].value;

    const {templates} = require('./mock-data');
    buildNewList(name, templates[template]);

    closeModal();
  });

}

function buildLoadListener() {
  $('main').on('click', '.js-load-list-button', function() {
    displayLoadListModal();
  });

  $('body').on('submit', '.js-load-list-form', function(event) {
    let values = $(this).serializeArray();
    event.preventDefault();

    loadList(values[0].value);

    closeModal();
  });
}

function buildNewItemListeners() {
  $('main').on('click', '.js-new-entry-button', function() {
    displayNewEntryModal();
  });

  $('body').on('submit', '.js-new-entry-form', function(event) {
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
},{"./list-planner":3,"./mock-data":5,"./packing-client":7}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L2xhbmRpbmcuanMiLCJkZXYvbGlzdC1wbGFubmVyLmpzIiwiZGV2L2xpc3RzLW1hbmFnZXIuanMiLCJkZXYvbW9jay1kYXRhLmpzIiwiZGV2L21vZGFscy5qcyIsImRldi9wYWNraW5nLWNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB7bG9hZE1hbmFnZXJ9ID0gcmVxdWlyZSgnLi9saXN0cy1tYW5hZ2VyJyk7XHJcblxyXG4kKHN0YXJ0VXApO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRVcCgpIHtcclxuICBjb25zdCB7bG9hZExhbmRpbmd9ID0gcmVxdWlyZSgnLi9sYW5kaW5nLmpzJyk7XHJcbiAgbG9hZE1hbmFnZXIoKTtcclxufSIsImNvbnN0IHtidWlsZE1vZGFsTGlzdGVuZXJzfSA9IHJlcXVpcmUoJy4vbW9kYWxzJyk7XHJcblxyXG5mdW5jdGlvbiBsb2FkTGFuZGluZygpIHtcclxuICBidWlsZFBhZ2UoKTtcclxuICBidWlsZExpc3RlbmVycygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFBhZ2UoKSB7XHJcbiAgJCgnbWFpbicpLmVtcHR5KCk7XHJcbiAgJCgnbWFpbicpLmFwcGVuZChcclxuICAgICQoJzxidXR0b24+JylcclxuICAgICAgLnRleHQoJ05ldyBQYWNraW5nIExpc3QnKVxyXG4gICAgICAuYWRkQ2xhc3MoJ2pzLW5ldy1saXN0LWJ1dHRvbicpLFxyXG4gICAgJCgnPGJ1dHRvbj4nKVxyXG4gICAgICAudGV4dCgnTG9hZCBQYWNraW5nIExpc3QnKVxyXG4gICAgICAuYWRkQ2xhc3MoJ2pzLWxvYWQtbGlzdC1idXR0b24nKVxyXG4gICk7XHJcblxyXG4gICQoJ21haW4nKS5hcHBlbmQoXHJcbiAgICAkKCc8cD4nKS50ZXh0KCd0cnkgbG9hZGluZyA1YjkxN2E1ODQ0YmI1NDJmMTg1M2VlZjgnKVxyXG4gIClcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRMaXN0ZW5lcnMoKSB7XHJcbiAgYnVpbGRNb2RhbExpc3RlbmVycygpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtsb2FkTGFuZGluZ307IiwiY29uc3QgcGFja2luZ0FwaSA9IHJlcXVpcmUoJy4vcGFja2luZy1jbGllbnQnKTtcclxubGV0IGN1cnJlbnRMaXN0ID0ge307XHJcblxyXG5cclxuZnVuY3Rpb24gbG9hZFBsYW5uZXIoaWQpIHtcclxuICBidWlsZFBhZ2UoKTtcclxuICBidWlsZExpc3RlbmVycygpO1xyXG4gIGdldEFuZERpc3BsYXlEYXRhKGlkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRQYWdlKCkge1xyXG4gICQoJ21haW4nKS5lbXB0eSgpO1xyXG5cclxuICBsZXQgJG9wdGlvbkJhciA9IGJ1aWxkT3B0aW9uQmFyKCk7XHJcbiAgbGV0ICR0YWJsZVNlY3Rpb24gPSAkKCc8c2VjdGlvbj4nKS5hZGRDbGFzcygndGFibGUtc2VjdGlvbicpO1xyXG5cclxuICAkKCdtYWluJykuYXBwZW5kKCRvcHRpb25CYXIsICR0YWJsZVNlY3Rpb24pO1xyXG5cclxuICBmdW5jdGlvbiBidWlsZE9wdGlvbkJhcigpIHtcclxuICAgIGxldCAkb3B0aW9uQmFyID0gJCgnPHNlY3Rpb24+JykuYWRkQ2xhc3MoJ29wdGlvbi1iYXIgZmxleC1ncmlkJyk7XHJcbiAgICBsZXQgJG5ld0VudHJ5QnV0dG9uID0gJCgnPGRpdj4nKVxyXG4gICAgICAuYWRkQ2xhc3MoJ2NvbCBqcy1uZXctZW50cnktYnV0dG9uJylcclxuICAgICAgLmFwcGVuZCgnPGJ1dHRvbj4gTmV3IEVudHJ5Jyk7XHJcblxyXG4gICAgbGV0ICRlbXB0eUNvbCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2NvbCcpO1xyXG4gICAgbGV0ICRtYWluTGlzdEJ1dHRvbiA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2NvbCBqcy1iYWNrJyk7XHJcbiAgICAkbWFpbkxpc3RCdXR0b24uYXBwZW5kKCc8YnV0dG9uPiBCYWNrJyk7XHJcbiAgICBsZXQgJHNhdmVMaXN0QnV0dG9uID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sIGpzLXNhdmUnKTtcclxuICAgICRzYXZlTGlzdEJ1dHRvbi5hcHBlbmQoJzxidXR0b24+IFNhdmUnKTtcclxuXHJcbiAgICAkb3B0aW9uQmFyLmFwcGVuZCgkbmV3RW50cnlCdXR0b24sICRlbXB0eUNvbCwgJG1haW5MaXN0QnV0dG9uLCAkZW1wdHlDb2wuY2xvbmUoKSwgJHNhdmVMaXN0QnV0dG9uKTtcclxuICAgIHJldHVybiAkb3B0aW9uQmFyO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QW5kRGlzcGxheURhdGEoaWQpIHtcclxuICBnZXREYXRhKGlkKVxyXG4gICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgIGN1cnJlbnRMaXN0ID0gZGF0YTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oZGlzcGxheURhdGEpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGEoaWQpIHtcclxuICByZXR1cm4gcGFja2luZ0FwaS5nZXRCeUlkKGlkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheURhdGEoZGF0YSkge1xyXG4gIGxldCAkdGFibGUgPSAkKCc8dGFibGU+JylcclxuICAgIC5hZGRDbGFzcygnanMtdGFibGUgaXRlbXMtdGFibGUnKVxyXG4gICAgLmFwcGVuZChcclxuICAgICAgJCgnPHRyPicpLmFwcGVuZChcclxuICAgICAgICAkKCc8dGg+JyksXHJcbiAgICAgICAgJCgnPHRoPicpLnRleHQoJ0l0ZW0nKSxcclxuICAgICAgICAkKCc8dGg+JykudGV4dCgnVG8gUGFjaycpLFxyXG4gICAgICAgICQoJzx0aD4nKVxyXG4gICAgICApXHJcbiAgICApO1xyXG5cclxuICBkYXRhLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgIGxldCAkbmV3Um93ID0gJCgnPHRyPicpLmRhdGEoJ2lkJywgaXRlbS5faWQpXHJcbiAgICAgIC5hcHBlbmQoXHJcbiAgICAgICAgJCgnPHRkPicpLmFkZENsYXNzKCd0ZC1jaGVjaycpXHJcbiAgICAgICAgICAuYXBwZW5kKFxyXG4gICAgICAgICAgICAkKCc8YnV0dG9uPicpLnRleHQoJ0NoZWNrJykuYWRkQ2xhc3MoJ2pzLWNoZWNrLWVudHJ5JylcclxuICAgICAgICAgICksXHJcbiAgICAgICAgJCgnPHRkPicpLnRleHQoaXRlbS5pdGVtKSxcclxuICAgICAgICAkKCc8dGQ+JykudGV4dChgJHtpdGVtLnBhY2tlZH0gLyAke2l0ZW0udG9QYWNrfWApLmFkZENsYXNzKCd0ZC1wYWNrZWQnKSxcclxuICAgICAgICAkKCc8dGQ+JykuYWRkQ2xhc3MoJ3RkLWRlbGV0ZScpXHJcbiAgICAgICAgICAuYXBwZW5kKFxyXG4gICAgICAgICAgICAkKCc8YnV0dG9uPicpLnRleHQoJ2RlbGV0ZScpLmFkZENsYXNzKCdqcy1kZWxldGUtZW50cnknKVxyXG4gICAgICAgICAgKVxyXG4gICAgICApXHJcblxyXG4gICAgaWYgKGl0ZW0ucGFja2VkID49IGl0ZW0udG9QYWNrKSB7XHJcbiAgICAgICRuZXdSb3cuYWRkQ2xhc3MoJ2dyZWVuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgJHRhYmxlLmFwcGVuZCgkbmV3Um93KTtcclxuICB9KTtcclxuXHJcbiAgJCgnLnRhYmxlLXNlY3Rpb24nKS5hcHBlbmQoJHRhYmxlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRMaXN0ZW5lcnMoKSB7XHJcbiAgJCgnbWFpbicpLm9mZigpO1xyXG5cclxuICAkKCdtYWluJykub24oJ2NsaWNrJywgJy5qcy1iYWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCB7bG9hZE1hbmFnZXJ9ID0gcmVxdWlyZSgnLi9saXN0cy1tYW5hZ2VyJyk7XHJcbiAgICBsb2FkTWFuYWdlcigpO1xyXG4gIH0pO1xyXG5cclxuICAkKCdtYWluJykub24oJ2NsaWNrJywgJy5qcy1jaGVjay1lbnRyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0ICRyb3cgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJyk7XHJcbiAgICBsZXQgaXRlbSA9IGN1cnJlbnRMaXN0Lml0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uX2lkID09PSAkcm93LmRhdGEoJ2lkJykpWzBdO1xyXG5cclxuICAgIGlmIChpdGVtLnBhY2tlZCArIDEgPT09IGl0ZW0udG9QYWNrKSB7XHJcbiAgICAgIGl0ZW0ucGFja2VkKys7XHJcbiAgICAgICRyb3cuYWRkQ2xhc3MoJ2dyZWVuJyk7XHJcbiAgICB9IGVsc2UgaWYgKGl0ZW0ucGFja2VkIDwgaXRlbS50b1BhY2spIHtcclxuICAgICAgaXRlbS5wYWNrZWQrKztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0ucGFja2VkID0gMDtcclxuICAgICAgJHJvdy5yZW1vdmVDbGFzcygnZ3JlZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICAkcm93LmNoaWxkcmVuKCcudGQtcGFja2VkJykudGV4dChgJHtpdGVtLnBhY2tlZH0gLyAke2l0ZW0udG9QYWNrfWApO1xyXG4gIH0pXHJcblxyXG4gICQoJ21haW4nKS5vbignY2xpY2snLCAnLmpzLWRlbGV0ZS1lbnRyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0ICRyb3cgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJyk7XHJcbiAgICBjdXJyZW50TGlzdC5pdGVtcyA9IGN1cnJlbnRMaXN0Lml0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uX2lkICE9PSAkcm93LmRhdGEoJ2lkJykpO1xyXG4gICAgJHJvdy5yZW1vdmUoKTtcclxuICB9KTtcclxuXHJcbiAgJCgnbWFpbicpLm9uKCdjbGljaycsICcuanMtc2F2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgcGFja2luZ0FwaS51cGRhdGVkQnlJZChjdXJyZW50TGlzdC5pZCwgY3VycmVudExpc3QpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtsb2FkUGxhbm5lcn07IiwiY29uc3Qge2J1aWxkTW9kYWxMaXN0ZW5lcnN9ID0gcmVxdWlyZSgnLi9tb2RhbHMnKTtcclxuXHJcbmNvbnN0IHtnZXRNdWx0aXBsZSwgZGVsZXRlQnlJZH0gPSByZXF1aXJlKCcuL3BhY2tpbmctY2xpZW50Jyk7XHJcblxyXG5mdW5jdGlvbiBsb2FkTWFuYWdlcigpIHtcclxuICBidWlsZFBhZ2UoKTtcclxuICBidWlsZExpc3RlbmVycygpO1xyXG4gIGdldEFuZERpc3BsYXlMaXN0cygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFBhZ2UoKSB7XHJcbiAgJCgnbWFpbicpLmVtcHR5KCk7XHJcbiAgbGV0ICRvcHRpb25CYXIgPSBidWlsZE9wdGlvbkJhcigpO1xyXG4gIGxldCAkdGFibGVTZWN0aW9uID0gJCgnPHNlY3Rpb24+JykuYWRkQ2xhc3MoJ3RhYmxlLXNlY3Rpb24nKTtcclxuXHJcbiAgJCgnbWFpbicpLmFwcGVuZCgkb3B0aW9uQmFyLCAkdGFibGVTZWN0aW9uKTtcclxuXHJcbiAgZnVuY3Rpb24gYnVpbGRPcHRpb25CYXIoKSB7XHJcbiAgICBsZXQgJG9wdGlvbkJhciA9ICQoJzxzZWN0aW9uPicpLmFkZENsYXNzKCdvcHRpb24tYmFyIGZsZXgtZ3JpZCcpO1xyXG4gICAgbGV0ICRuZXdMaXN0QnV0dG9uID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sIGpzLW5ldy1saXN0LWJ1dHRvbicpO1xyXG4gICAgJG5ld0xpc3RCdXR0b24uYXBwZW5kKCc8YnV0dG9uPiBOZXcgUGFja2luZyBMaXN0Jyk7XHJcbiAgICBsZXQgJGVtcHR5Q29sID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sJyk7XHJcblxyXG4gICAgJG9wdGlvbkJhci5hcHBlbmQoJG5ld0xpc3RCdXR0b24sICRlbXB0eUNvbCwgJGVtcHR5Q29sLmNsb25lKCkpO1xyXG4gICAgcmV0dXJuICRvcHRpb25CYXI7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZExpc3RlbmVycygpIHtcclxuICAkKCdtYWluJykub2ZmKCk7XHJcblxyXG4gICQoJ21haW4nKS5vbignY2xpY2snLCAndHI6bm90KDpmaXJzdC1jaGlsZCknLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBpZCA9ICQodGhpcykuZGF0YSgnaWQnKTtcclxuICAgIGNvbnN0IHtsb2FkUGxhbm5lcn0gPSByZXF1aXJlKCcuL2xpc3QtcGxhbm5lcicpO1xyXG4gICAgbG9hZFBsYW5uZXIoaWQpO1xyXG4gIH0pO1xyXG5cclxuICAkKCdtYWluJykub24oJ2NsaWNrJywgJy5qcy1kZWxldGUtbGlzdCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgIGxldCBpZCA9ICQodGhpcykuY2xvc2VzdCgndHInKS5kYXRhKCdpZCcpO1xyXG4gICAgY29uc29sZS5sb2coaWQpO1xyXG4gICAgZGVsZXRlQnlJZChpZClcclxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCgnLmpzLXRhYmxlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgZ2V0QW5kRGlzcGxheUxpc3RzKCk7XHJcbiAgICAgIH0pXHJcbiAgfSlcclxuXHJcbiAgYnVpbGRNb2RhbExpc3RlbmVycygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBbmREaXNwbGF5TGlzdHMoKSB7XHJcbiAgZ2V0TGlzdHMoKS50aGVuKGRpc3BsYXlMaXN0cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldExpc3RzKCkge1xyXG4gIHJldHVybiBnZXRNdWx0aXBsZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5TGlzdHMobGlzdHMpIHtcclxuICBsZXQgJHRhYmxlID0gJCgnPHRhYmxlPicpXHJcbiAgICAuYWRkQ2xhc3MoJ2pzLXRhYmxlJylcclxuICAgIC5hcHBlbmQoXHJcbiAgICAgICQoJzx0cj4nKS5hcHBlbmQoXHJcbiAgICAgICAgJCgnPHRoPicpLnRleHQoJ05hbWUnKSxcclxuICAgICAgICAkKCc8dGg+JykudGV4dCgnSXRlbXMnKSxcclxuICAgICAgICAkKCc8dGg+JylcclxuICAgICAgKVxyXG4gICAgKTtcclxuXHJcbiAgbGlzdHMuZm9yRWFjaCgobGlzdCkgPT4ge1xyXG4gICAgbGV0ICRuZXdSb3cgPSAkKCc8dHI+JykuZGF0YSgnaWQnLCBsaXN0LmlkKVxyXG4gICAgICAuYXBwZW5kKFxyXG4gICAgICAgICQoJzx0ZD4nKS50ZXh0KGAke2xpc3QubmFtZX1gKSxcclxuICAgICAgICAkKCc8dGQ+JykudGV4dChgJHtsaXN0LnBhY2tlZH0gLyAke2xpc3QudG9QYWNrfWApLFxyXG4gICAgICAgICQoJzx0ZD4nKS5hZGRDbGFzcygndGQtZGVsZXRlJykuYXBwZW5kKFxyXG4gICAgICAgICAgJCgnPGJ1dHRvbj4nKS50ZXh0KCdEZWxldGUnKS5hZGRDbGFzcygnanMtZGVsZXRlLWxpc3QnKSxcclxuICAgICAgICApXHJcbiAgICAgICk7XHJcbiAgICAkdGFibGUuYXBwZW5kKCRuZXdSb3cpO1xyXG4gIH0pO1xyXG4gICQoJy50YWJsZS1zZWN0aW9uJykuYXBwZW5kKCR0YWJsZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtsb2FkTWFuYWdlcn0iLCJjb25zdCB0ZW1wbGF0ZXMgPSB7XHJcbiAgJ05vbmUnOiBbXSxcclxuICAnQmVhY2gnOiBbXHJcbiAgICB7aXRlbTogJ3Rvd2VsJ30sXHJcbiAgICB7aXRlbTogJ3N1bnNjcmVlbid9LFxyXG4gICAge2l0ZW06ICd3YXRlcid9LFxyXG4gICAge2l0ZW06ICdzd2ltc3VpdCd9LFxyXG4gIF0sXHJcbiAgJ0NhbXBpbmcnOiBbXHJcbiAgICB7aXRlbTogJ3RlbnQnfSxcclxuICAgIHtpdGVtOiAnYnVnLXNwcmF5J30sXHJcbiAgICB7aXRlbTogJ3NsZWVwaW5nLWJhZyd9LFxyXG4gICAge2l0ZW06ICdmbGFzaGxpZ2h0J30sXHJcbiAgICB7aXRlbTogJ2ZpcmUgc3RhcnRlcid9LFxyXG4gICAge2l0ZW06ICd0b2lsZXRyaWVzJ30sXHJcbiAgICB7aXRlbTogJ2Zvb2QnfSxcclxuICAgIHtpdGVtOiAnZmlyc3QtYWlkIGtpdCd9LFxyXG4gIF0sXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge3RlbXBsYXRlc307IiwiY29uc3QgcGFja2luZ0FwaSA9IHJlcXVpcmUoJy4vcGFja2luZy1jbGllbnQnKTtcclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTW9kYWxMaXN0ZW5lcnMoKSB7XHJcbiAgYnVpbGRTaGFyZWRMaXN0ZW5lcnMoKTtcclxuXHJcbiAgLy8gUmVxdWlyZXMgYSBjbGlja2FibGUgZWxlbWVudCB3aXRoIHRoZSBjbGFzcyBqcy1uZXctbGlzdC1idXR0b25cclxuICBidWlsZE5ld0xpc3RMaXN0ZW5lcigpO1xyXG5cclxuICAvLyBSZXF1aXJlcyBhIGNsaWNrYWJsZSBlbGVtZW50IHdpdGggdGhlIGNsYXNzIGpzLWxvYWQtbGlzdC1idXR0b25cclxuICBidWlsZExvYWRMaXN0ZW5lcigpO1xyXG5cclxuICAvLyBSZXF1aXJlcyBhIGNsaWNrYWJsZSBlbGVtZW50IHdpdGggdGhlIGNsYXNzIGpzLW5ldy1lbnRyeS1idXR0b25cclxuICBidWlsZE5ld0l0ZW1MaXN0ZW5lcnMoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRTaGFyZWRMaXN0ZW5lcnMoKSB7XHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtY2xvc2UtbW9kYWwnLCBjbG9zZU1vZGFsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGROZXdMaXN0TGlzdGVuZXIoKSB7XHJcbiAgJCgnbWFpbicpLm9uKCdjbGljaycsICcuanMtbmV3LWxpc3QtYnV0dG9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICBkaXNwbGF5TmV3TGlzdE1vZGFsKCk7XHJcbiAgfSk7XHJcblxyXG4gICQoJ2JvZHknKS5vbignc3VibWl0JywgJy5qcy1uZXctbGlzdC1mb3JtJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGxldCB2YWx1ZXMgPSAkKHRoaXMpLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGxldCBuYW1lID0gdmFsdWVzWzBdLnZhbHVlO1xyXG4gICAgbGV0IHRlbXBsYXRlID0gdmFsdWVzWzFdLnZhbHVlO1xyXG5cclxuICAgIGNvbnN0IHt0ZW1wbGF0ZXN9ID0gcmVxdWlyZSgnLi9tb2NrLWRhdGEnKTtcclxuICAgIGJ1aWxkTmV3TGlzdChuYW1lLCB0ZW1wbGF0ZXNbdGVtcGxhdGVdKTtcclxuXHJcbiAgICBjbG9zZU1vZGFsKCk7XHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZExvYWRMaXN0ZW5lcigpIHtcclxuICAkKCdtYWluJykub24oJ2NsaWNrJywgJy5qcy1sb2FkLWxpc3QtYnV0dG9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICBkaXNwbGF5TG9hZExpc3RNb2RhbCgpO1xyXG4gIH0pO1xyXG5cclxuICAkKCdib2R5Jykub24oJ3N1Ym1pdCcsICcuanMtbG9hZC1saXN0LWZvcm0nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgbGV0IHZhbHVlcyA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgbG9hZExpc3QodmFsdWVzWzBdLnZhbHVlKTtcclxuXHJcbiAgICBjbG9zZU1vZGFsKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTmV3SXRlbUxpc3RlbmVycygpIHtcclxuICAkKCdtYWluJykub24oJ2NsaWNrJywgJy5qcy1uZXctZW50cnktYnV0dG9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICBkaXNwbGF5TmV3RW50cnlNb2RhbCgpO1xyXG4gIH0pO1xyXG5cclxuICAkKCdib2R5Jykub24oJ3N1Ym1pdCcsICcuanMtbmV3LWVudHJ5LWZvcm0nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgbGV0IHZhbHVlcyA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgYWRkTmV3RW50cnkodmFsdWVzWzBdLnZhbHVlKTtcclxuXHJcbiAgICBjbG9zZU1vZGFsKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlOZXdMaXN0TW9kYWwoKSB7XHJcbiAgbGV0ICRvdmVybGF5ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnb3ZlcmxheScpO1xyXG4gIGxldCAkbW9kYWwgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtb2RhbCcpXHJcbiAgICAuYXR0cignYXJpYS1saXZlJywgJ2Fzc2VydGl2ZScpO1xyXG4gICQoJ2JvZHknKS5hcHBlbmQoJG92ZXJsYXksICRtb2RhbCk7XHJcblxyXG4gIGxldCAkY29udGVudCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWNvbnRlbnQnKTtcclxuICBsZXQgJG5ld0xpc3RGb3JtID0gJCgnPGZvcm0+JylcclxuICAgIC5hZGRDbGFzcygnanMtbmV3LWxpc3QtZm9ybScpXHJcbiAgICAuaHRtbChgXHJcbiAgICAgIDxsZWdlbmQ+IENyZWF0ZSBOZXcgTGlzdCA8L2xlZ2VuZD5cclxuICAgICAgPGxhYmVsIGZvcj1cIm5hbWVcIj5OYW1lOiA8L2xhYmVsPlxyXG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIGlkPVwibmV3LWxpc3QtbmFtZVwiPlxyXG5cclxuICAgICAgPGxhYmVsIGZvcj1cInRlbXBsYXRlXCI+VGVtcGxhdGU8L2xhYmVsPlxyXG4gICAgICA8c2VsZWN0IG5hbWU9XCJ0ZW1wbGF0ZVwiIGlkPVwidGVtcGxhdGUtc2VsZWN0XCI+XHJcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk5vbmVcIj5Ob25lPC9vcHRpb24+XHJcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkNhbXBpbmdcIj5DYW1waW5nPC9vcHRpb24+XHJcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkJlYWNoXCI+QmVhY2g8L29wdGlvbj5cclxuICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWJ1dHRvbnNcIj5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiQ3JlYXRlXCIgY2xhc3M9XCJidXR0b25cIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImpzLWNsb3NlLW1vZGFsIGJ1dHRvblwiPiBDYW5jZWwgPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gIGApO1xyXG5cclxuICAkY29udGVudC5hcHBlbmQoJG5ld0xpc3RGb3JtKTtcclxuICAkbW9kYWwuYXBwZW5kKCRjb250ZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheUxvYWRMaXN0TW9kYWwoKSB7XHJcbiAgbGV0ICRvdmVybGF5ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnb3ZlcmxheScpO1xyXG4gIGxldCAkbW9kYWwgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtb2RhbCcpXHJcbiAgICAuYXR0cignYXJpYS1saXZlJywgJ2Fzc2VydGl2ZScpO1xyXG4gICQoJ2JvZHknKS5hcHBlbmQoJG92ZXJsYXksICRtb2RhbCk7XHJcblxyXG5cclxuICBsZXQgJGNvbnRlbnQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdtb2RhbC1jb250ZW50Jyk7XHJcbiAgbGV0ICRsb2FkTW9kYWxGb3JtID0gJCgnPGZvcm0+JylcclxuICAgIC5hZGRDbGFzcygnanMtbG9hZC1saXN0LWZvcm0nKVxyXG4gICAgLmh0bWwoYFxyXG4gICAgICA8bGVnZW5kPiBMb2FkIEEgTGlzdCA8L2xlZ2VuZD5cclxuICAgICAgPGxhYmVsIGZvcj1cImlkXCIgPiBJRCA8L2xhYmVsPlxyXG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiaWRcIiBpZD1cImxvYWQtaWRcIj5cclxuICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWJ1dHRvbnNcIj5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJMb2FkXCIgY2xhc3M9XCJidXR0b25cIj5cclxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwianMtY2xvc2UtbW9kYWwgYnV0dG9uXCI+IENhbmNlbCA8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIGApO1xyXG5cclxuICAkY29udGVudC5hcHBlbmQoJGxvYWRNb2RhbEZvcm0pO1xyXG4gICRtb2RhbC5hcHBlbmQoJGNvbnRlbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5TmV3RW50cnlNb2RhbCgpIHtcclxuICBsZXQgJG92ZXJsYXkgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdvdmVybGF5Jyk7XHJcbiAgbGV0ICRtb2RhbCA9ICQoJzxkaXYnKS5hZGRDbGFzcygnbW9kYWwnKVxyXG4gICAgLmF0dHIoJ2FyaWEtbGl2ZScsICdhc3NlcnRpdmUnKTtcclxuICAkKCdib2R5JykuYXBwZW5kKCRvdmVybGF5LCAkbW9kYWwpO1xyXG5cclxuICBsZXQgJG5ld0VudHJ5Rm9ybSA9ICQoJzxmb3JtPicpXHJcbiAgICAuYWRkQ2xhc3MoJ2pzLW5ldy1lbnRyeS1mb3JtJylcclxuICAgIC5odG1sKGBcclxuICAgIFxyXG4gICAgYClcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcclxuICAkKCcub3ZlcmxheScpLnJlbW92ZSgpO1xyXG4gICQoJy5tb2RhbCcpLnJlbW92ZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZE5ld0xpc3QobmFtZSwgdGVtcGxhdGUpIHtcclxuICBjb25zb2xlLmxvZyhgYnVpbGRpbmcgbmV3IGxpc3Qgd2l0aCAke25hbWV9IGFuZCAke3RlbXBsYXRlfWApO1xyXG5cclxuICBsZXQgbmV3TGlzdCA9IHtcclxuICAgIG5hbWU6IG5hbWUsXHJcbiAgICBpdGVtczogdGVtcGxhdGUsXHJcbiAgfTtcclxuICBwYWNraW5nQXBpXHJcbiAgICAucG9zdChuZXdMaXN0KVxyXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XHJcbiAgICAgIGNvbnN0IHtsb2FkUGxhbm5lcn0gPSByZXF1aXJlKCcuL2xpc3QtcGxhbm5lcicpO1xyXG4gICAgICBsb2FkUGxhbm5lcihyZXMuaWQpO1xyXG4gICAgfSk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkTGlzdChpZCkge1xyXG4gIGNvbnNvbGUubG9nKGBsb2FkaW5nIGxpc3Qgd2l0aCAke2lkfWApO1xyXG4gIGNvbnN0IHtsb2FkUGxhbm5lcn0gPSByZXF1aXJlKCcuL2xpc3QtcGxhbm5lcicpO1xyXG4gIGxvYWRQbGFubmVyKGlkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkTmV3RW50cnkobGlzdCwgbmFtZSwgcGFja2VkID0gMCwgdG9QYWNrID0gMSkge1xyXG4gIGNvbnNvbGUubG9nKGBhZGRpbmcgbmV3IGl0ZW0gJHtuYW1lfWApO1xyXG4gIGxpc3QuaXRlbXMucHVzaCh7XHJcbiAgICBuYW1lOiBuYW1lLFxyXG4gICAgcGFja2VkOiBwYWNrZWQsXHJcbiAgICB0b1BhY2s6IHRvUGFjayxcclxuICB9KTtcclxuXHJcbiAgcGFja2luZ0FwaVxyXG4gICAgLnVwZGF0ZWRCeUlkKGxpc3QuaWQsIGxpc3QpXHJcbiAgICAudGhlbihmdW5jdGlvbihyZXMpIHtcclxuICAgICAgY29uc3Qge2xvYWRQbGFubmVyfSA9IHJlcXVpcmUoJy4vbGlzdC1wbGFubmVyJyk7XHJcbiAgICAgIGxvYWRQbGFubmVyKGxpc3QuaWQpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2J1aWxkTW9kYWxMaXN0ZW5lcnN9OyIsImZ1bmN0aW9uIHBvc3QoZGF0YSkge1xyXG4gIGxldCBzZXR0aW5ncyA9IHtcclxuICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgdXJsOiAnLi9hcGkvcGFja2luZycsXHJcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE11bHRpcGxlKCkge1xyXG4gIGxldCBzZXR0aW5ncyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB1cmw6ICcuL2FwaS9wYWNraW5nJyxcclxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXHJcbiAgfVxyXG5cclxuICByZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QnlJZChpZCkge1xyXG4gIGxldCBzZXR0aW5ncyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICB1cmw6IGAuL2FwaS9wYWNraW5nLyR7aWR9YCxcclxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXHJcbiAgfVxyXG5cclxuICByZXR1cm4gJC5hamF4KHNldHRpbmdzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlZEJ5SWQoaWQsIGRhdGEpIHtcclxuICBpZiAoZGF0YS5pZCAhPT0gaWQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1hdGVyIElEIGFuZCBkYXRhLmlkIGRvIG5vdCBtYXRjaCcpO1xyXG4gIH1cclxuICBsZXQgc2V0dGluZ3MgPSB7XHJcbiAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgdXJsOiBgLi9hcGkvcGFja2luZy8ke2lkfWAsXHJcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlbGV0ZUJ5SWQoaWQpIHtcclxuICBsZXQgc2V0dGluZ3MgPSB7XHJcbiAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgdXJsOiBgLi9hcGkvcGFja2luZy8ke2lkfWAsXHJcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuICQuYWpheChzZXR0aW5ncyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2dldE11bHRpcGxlLCBnZXRCeUlkLCBkZWxldGVCeUlkLCB1cGRhdGVkQnlJZCwgcG9zdH07Il19
