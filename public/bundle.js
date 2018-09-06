(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {loadManager} = require('./lists-manager');

$(startUp);

function startUp() {
  const {loadLanding} = require('./landing.js');
  loadLanding();
}
},{"./landing.js":2,"./lists-manager":4}],2:[function(require,module,exports){
function loadLanding() {
  buildPage();
  buildListeners();
}

function buildPage() {
  $('main').empty();
  $('main').append(
    $('<button>').text('New Packing List'),
    $('<button>').text('Load Packing List')
  );

}

module.exports = {loadLanding};
},{}],3:[function(require,module,exports){
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
},{"./lists-manager":4,"./mock-data":5}],4:[function(require,module,exports){
const {listsData, templates} = require('./mock-data');

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
  });

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
        <option value="None">None</option>
        <option value="Camping">Camping</option>
        <option value="Beach">Beach</option>
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
      <th> Name </th>
      <th> Items </th>
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
  if (!name) {
    console.log('no name');
    return;
  }
  // build new list from template
  // send to server, recieve id
  // const {loadPlanner} = require('./list-planner');
  // loadPlanner(id);
}

module.exports = {loadManager}
},{"./list-planner":3,"./mock-data":5}],5:[function(require,module,exports){
const listsData = [
  {
    name: "Camping",
    amount: 4,
    packedAmount: 1,
    id: 1,
  },
  {
    name: "Beach Trip",
    amount: 10,
    packedAmount: 9,
    id: 2,
  },
  {
    name: "Family Reunion",
    amount: 15,
    packedAmount: 15,
    id: 3,
  }
];

const packingData = {
  id: 1,
  name: "Camping",
  items: [
    {
      name: "First Aid Kit",
      packed: 0,
      toPack: 1
    },
    {
      name: "Tent",
      packed: 1,
      toPack: 1,
    },
    {
      name: "Sleeping Bags",
      packed: 0,
      toPack: 2,
    },
    {
      name: "Change of Clothes",
      packed: 1,
      toPack: 2,
    }
  ]
};

const templates = {
  'None': [],
  'Beach': [
    'towel',
    'sunscreen',
    'cooler', 'water',
    'sunglasses',
    'swimsuit',
  ],
  'Camping': [
    'tent',
    'bug-spray',
    'sleeping-bag',
    'flash-light',
    'fire-starter',
    'toiletries',
    'food',
    'first-aid kit',
  ],
}

module.exports = {listsData, packingData, templates};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L2xhbmRpbmcuanMiLCJkZXYvbGlzdC1wbGFubmVyLmpzIiwiZGV2L2xpc3RzLW1hbmFnZXIuanMiLCJkZXYvbW9jay1kYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHtsb2FkTWFuYWdlcn0gPSByZXF1aXJlKCcuL2xpc3RzLW1hbmFnZXInKTtcclxuXHJcbiQoc3RhcnRVcCk7XHJcblxyXG5mdW5jdGlvbiBzdGFydFVwKCkge1xyXG4gIGNvbnN0IHtsb2FkTGFuZGluZ30gPSByZXF1aXJlKCcuL2xhbmRpbmcuanMnKTtcclxuICBsb2FkTGFuZGluZygpO1xyXG59IiwiZnVuY3Rpb24gbG9hZExhbmRpbmcoKSB7XHJcbiAgYnVpbGRQYWdlKCk7XHJcbiAgYnVpbGRMaXN0ZW5lcnMoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRQYWdlKCkge1xyXG4gICQoJ21haW4nKS5lbXB0eSgpO1xyXG4gICQoJ21haW4nKS5hcHBlbmQoXHJcbiAgICAkKCc8YnV0dG9uPicpLnRleHQoJ05ldyBQYWNraW5nIExpc3QnKSxcclxuICAgICQoJzxidXR0b24+JykudGV4dCgnTG9hZCBQYWNraW5nIExpc3QnKVxyXG4gICk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtsb2FkTGFuZGluZ307IiwiY29uc3Qge3BhY2tpbmdEYXRhfSA9IHJlcXVpcmUoJy4vbW9jay1kYXRhJyk7XHJcblxyXG5cclxuZnVuY3Rpb24gbG9hZFBsYW5uZXIoaWQpIHtcclxuICBidWlsZFBhZ2UoKTtcclxuICBidWlsZExpc3RlbmVycygpO1xyXG4gIGdldEFuZERpc3BsYXlEYXRhKGlkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRQYWdlKCkge1xyXG4gICQoJ21haW4nKS5lbXB0eSgpO1xyXG5cclxuICBsZXQgJG9wdGlvbkJhciA9IGJ1aWxkT3B0aW9uQmFyKCk7XHJcbiAgbGV0ICR0YWJsZVNlY3Rpb24gPSAkKCc8c2VjdGlvbj4nKS5hZGRDbGFzcygndGFibGUtc2VjdGlvbicpO1xyXG5cclxuICAkKCdtYWluJykuYXBwZW5kKCRvcHRpb25CYXIsICR0YWJsZVNlY3Rpb24pO1xyXG5cclxuICBmdW5jdGlvbiBidWlsZE9wdGlvbkJhcigpIHtcclxuICAgIGxldCAkb3B0aW9uQmFyID0gJCgnPHNlY3Rpb24+JykuYWRkQ2xhc3MoJ29wdGlvbi1iYXIgZmxleC1ncmlkJyk7XHJcbiAgICBsZXQgJG5ld0VudHJ5QnV0dG9uID0gJCgnPGRpdj4nKVxyXG4gICAgICAuYWRkQ2xhc3MoJ2NvbCBqcy1uZXctZW50cnktYnV0dG9uJylcclxuICAgICAgLmFwcGVuZCgnPGJ1dHRvbj4gTmV3IEVudHJ5Jyk7XHJcblxyXG4gICAgbGV0ICRlbXB0eUNvbCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2NvbCcpO1xyXG4gICAgbGV0ICRtYWluTGlzdEJ1dHRvbiA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2NvbCBqcy1iYWNrJyk7XHJcbiAgICAkbWFpbkxpc3RCdXR0b24uYXBwZW5kKCc8YnV0dG9uPiBCYWNrJyk7XHJcblxyXG4gICAgJG9wdGlvbkJhci5hcHBlbmQoJG5ld0VudHJ5QnV0dG9uLCAkZW1wdHlDb2wsICRtYWluTGlzdEJ1dHRvbik7XHJcbiAgICByZXR1cm4gJG9wdGlvbkJhcjtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFuZERpc3BsYXlEYXRhKGlkKSB7XHJcbiAgZ2V0RGF0YShpZCkudGhlbihkaXNwbGF5RGF0YSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGEoaWQpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgcmVzb2x2ZShwYWNraW5nRGF0YSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlEYXRhKGRhdGEpIHtcclxuICBsZXQgJHRhYmxlID0gJCgnPHRhYmxlPicpXHJcbiAgICAuYWRkQ2xhc3MoJ2pzLXRhYmxlIGl0ZW1zLXRhYmxlJylcclxuICAgIC5hcHBlbmQoXHJcbiAgICAgICQoJzx0cj4nKS5hcHBlbmQoXHJcbiAgICAgICAgJCgnPHRoPicpLnRleHQoJ0l0ZW0nKSxcclxuICAgICAgICAkKCc8dGg+JykudGV4dCgnVG8gUGFjaycpXHJcbiAgICAgIClcclxuICAgICk7XHJcblxyXG4gIGRhdGEuaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgJHRhYmxlLmFwcGVuZChcclxuICAgICAgJCgnPHRyPicpLmFwcGVuZChcclxuICAgICAgICAkKCc8dGQ+JykudGV4dChpdGVtLm5hbWUpLFxyXG4gICAgICAgICQoJzx0ZD4nKS50ZXh0KGAke2l0ZW0ucGFja2VkfSAvICR7aXRlbS50b1BhY2t9YClcclxuICAgICAgKVxyXG4gICAgKTtcclxuICB9KTtcclxuXHJcbiAgJCgnLnRhYmxlLXNlY3Rpb24nKS5hcHBlbmQoJHRhYmxlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRMaXN0ZW5lcnMoKSB7XHJcbiAgJCgnbWFpbicpLm9mZigpO1xyXG5cclxuICAkKCdtYWluJykub24oJ2NsaWNrJywgJy5qcy1iYWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCB7bG9hZE1hbmFnZXJ9ID0gcmVxdWlyZSgnLi9saXN0cy1tYW5hZ2VyJyk7XHJcbiAgICBsb2FkTWFuYWdlcigpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtsb2FkUGxhbm5lcn07IiwiY29uc3Qge2xpc3RzRGF0YSwgdGVtcGxhdGVzfSA9IHJlcXVpcmUoJy4vbW9jay1kYXRhJyk7XHJcblxyXG5mdW5jdGlvbiBsb2FkTWFuYWdlcigpIHtcclxuICBidWlsZFBhZ2UoKTtcclxuICBidWlsZExpc3RlbmVycygpO1xyXG4gIGdldEFuZERpc3BsYXlMaXN0cygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFBhZ2UoKSB7XHJcbiAgJCgnbWFpbicpLmVtcHR5KCk7XHJcbiAgbGV0ICRvcHRpb25CYXIgPSBidWlsZE9wdGlvbkJhcigpO1xyXG4gIGxldCAkdGFibGVTZWN0aW9uID0gJCgnPHNlY3Rpb24+JykuYWRkQ2xhc3MoJ3RhYmxlLXNlY3Rpb24nKTtcclxuXHJcbiAgJCgnbWFpbicpLmFwcGVuZCgkb3B0aW9uQmFyLCAkdGFibGVTZWN0aW9uKTtcclxuXHJcbiAgZnVuY3Rpb24gYnVpbGRPcHRpb25CYXIoKSB7XHJcbiAgICBsZXQgJG9wdGlvbkJhciA9ICQoJzxzZWN0aW9uPicpLmFkZENsYXNzKCdvcHRpb24tYmFyIGZsZXgtZ3JpZCcpO1xyXG4gICAgbGV0ICRuZXdMaXN0QnV0dG9uID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sIGpzLW5ldy1saXN0LWJ1dHRvbicpO1xyXG4gICAgJG5ld0xpc3RCdXR0b24uYXBwZW5kKCc8YnV0dG9uPiBOZXcgUGFja2luZyBMaXN0Jyk7XHJcbiAgICBsZXQgJGVtcHR5Q29sID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sJyk7XHJcblxyXG4gICAgJG9wdGlvbkJhci5hcHBlbmQoJG5ld0xpc3RCdXR0b24sICRlbXB0eUNvbCwgJGVtcHR5Q29sLmNsb25lKCkpO1xyXG4gICAgcmV0dXJuICRvcHRpb25CYXI7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZExpc3RlbmVycygpIHtcclxuICAkKCdtYWluJykub2ZmKCk7XHJcblxyXG4gICQoJ21haW4nKS5vbignY2xpY2snLCAndHI6bm90KDpmaXJzdC1jaGlsZCknLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBpZCA9ICQodGhpcykuZGF0YSgnaWQnKTtcclxuICAgIGNvbnN0IHtsb2FkUGxhbm5lcn0gPSByZXF1aXJlKCcuL2xpc3QtcGxhbm5lcicpO1xyXG4gICAgbG9hZFBsYW5uZXIoaWQpO1xyXG4gIH0pO1xyXG5cclxuICAkKCdtYWluJykub24oJ2NsaWNrJywgJy5qcy1uZXctbGlzdC1idXR0b24nLCBmdW5jdGlvbigpIHtcclxuICAgIGRpc3BsYXlOZXdMaXN0TW9kYWwoKTtcclxuICB9KTtcclxuXHJcbiAgJCgnYm9keScpLm9uKCdzdWJtaXQnLCAnLmpzLW5ldy1saXN0LWZvcm0nLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgbGV0IHZhbHVlcyA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgbGV0IG5hbWUgPSB2YWx1ZXNbMF0udmFsdWU7XHJcbiAgICBsZXQgdGVtcGxhdGUgPSB2YWx1ZXNbMV0udmFsdWU7XHJcbiAgICBidWlsZE5ld0xpc3QobmFtZSwgdGVtcGxhdGUpO1xyXG5cclxuICAgICQoJy5vdmVybGF5JykucmVtb3ZlKCk7XHJcbiAgICAkKCcubW9kYWwnKS5yZW1vdmUoKTtcclxuICB9KTtcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtY2xvc2UtbW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICQoJy5vdmVybGF5JykucmVtb3ZlKCk7XHJcbiAgICAkKCcubW9kYWwnKS5yZW1vdmUoKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheU5ld0xpc3RNb2RhbCgpIHtcclxuICBsZXQgJG92ZXJsYXkgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdvdmVybGF5Jyk7XHJcbiAgbGV0ICRtb2RhbCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21vZGFsJylcclxuICAgIC5hdHRyKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XHJcbiAgJCgnYm9keScpLmFwcGVuZCgkb3ZlcmxheSwgJG1vZGFsKTtcclxuXHJcbiAgbGV0ICRjb250ZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbW9kYWwtY29udGVudCcpO1xyXG4gIGxldCAkbmV3TGlzdEZvcm0gPSAkKCc8Zm9ybT4nKVxyXG4gICAgLmFkZENsYXNzKCdqcy1uZXctbGlzdC1mb3JtJylcclxuICAgIC5odG1sKGBcclxuICAgICAgPGxlZ2VuZD4gQ3JlYXRlIE5ldyBMaXN0IDwvbGVnZW5kPlxyXG4gICAgICA8bGFiZWwgZm9yPVwibmFtZVwiPk5hbWU6IDwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgaWQ9XCJuZXctbGlzdC1uYW1lXCI+XHJcblxyXG4gICAgICA8bGFiZWwgZm9yPVwidGVtcGxhdGVcIj5UZW1wbGF0ZTwvbGFiZWw+XHJcbiAgICAgIDxzZWxlY3QgbmFtZT1cInRlbXBsYXRlXCIgaWQ9XCJ0ZW1wbGF0ZS1zZWxlY3RcIj5cclxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiTm9uZVwiPk5vbmU8L29wdGlvbj5cclxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQ2FtcGluZ1wiPkNhbXBpbmc8L29wdGlvbj5cclxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQmVhY2hcIj5CZWFjaDwvb3B0aW9uPlxyXG4gICAgICA8L3NlbGVjdD5cclxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tYnV0dG9uc1wiPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJDcmVhdGVcIiBjbGFzcz1cImJ1dHRvblwiPlxyXG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJqcy1jbG9zZS1tb2RhbCBidXR0b25cIj4gQ2FuY2VsIDwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICBgKTtcclxuXHJcbiAgJGNvbnRlbnQuYXBwZW5kKCRuZXdMaXN0Rm9ybSk7XHJcbiAgJG1vZGFsLmFwcGVuZCgkY29udGVudCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRBbmREaXNwbGF5TGlzdHMoKSB7XHJcbiAgZ2V0TGlzdHMoKS50aGVuKGRpc3BsYXlMaXN0cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldExpc3RzKCkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICByZXNvbHZlKGxpc3RzRGF0YSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlMaXN0cyhsaXN0cykge1xyXG4gIGxldCAkdGFibGUgPSAkKCc8dGFibGU+JylcclxuICAgIC5hZGRDbGFzcygnanMtdGFibGUnKVxyXG4gICAgLmFwcGVuZChgXHJcbiAgICA8dHI+XHJcbiAgICAgIDx0aD4gTmFtZSA8L3RoPlxyXG4gICAgICA8dGg+IEl0ZW1zIDwvdGg+XHJcbiAgICA8L3RyPlxyXG4gIGApO1xyXG5cclxuICBsaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XHJcbiAgICBsZXQgJG5ld1JvdyA9ICQoJzx0cj4nKVxyXG4gICAgICAuYXBwZW5kKGBcclxuICAgICAgICA8dGQ+ICR7bGlzdC5uYW1lfSA8L3RkPlxyXG4gICAgICAgIDx0ZD4gJHtsaXN0LnBhY2tlZEFtb3VudH0gLyAke2xpc3QuYW1vdW50fSA8L3RkPmBcclxuICAgICAgKVxyXG4gICAgICAuZGF0YSgnaWQnLCBsaXN0LmlkKTtcclxuICAgICR0YWJsZS5hcHBlbmQoJG5ld1Jvdyk7XHJcbiAgfSk7XHJcbiAgJCgnLnRhYmxlLXNlY3Rpb24nKS5hcHBlbmQoJHRhYmxlKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTmV3TGlzdChuYW1lLCB0ZW1wbGF0ZSkge1xyXG4gIGlmICghbmFtZSkge1xyXG4gICAgY29uc29sZS5sb2coJ25vIG5hbWUnKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgLy8gYnVpbGQgbmV3IGxpc3QgZnJvbSB0ZW1wbGF0ZVxyXG4gIC8vIHNlbmQgdG8gc2VydmVyLCByZWNpZXZlIGlkXHJcbiAgLy8gY29uc3Qge2xvYWRQbGFubmVyfSA9IHJlcXVpcmUoJy4vbGlzdC1wbGFubmVyJyk7XHJcbiAgLy8gbG9hZFBsYW5uZXIoaWQpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtsb2FkTWFuYWdlcn0iLCJjb25zdCBsaXN0c0RhdGEgPSBbXHJcbiAge1xyXG4gICAgbmFtZTogXCJDYW1waW5nXCIsXHJcbiAgICBhbW91bnQ6IDQsXHJcbiAgICBwYWNrZWRBbW91bnQ6IDEsXHJcbiAgICBpZDogMSxcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6IFwiQmVhY2ggVHJpcFwiLFxyXG4gICAgYW1vdW50OiAxMCxcclxuICAgIHBhY2tlZEFtb3VudDogOSxcclxuICAgIGlkOiAyLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogXCJGYW1pbHkgUmV1bmlvblwiLFxyXG4gICAgYW1vdW50OiAxNSxcclxuICAgIHBhY2tlZEFtb3VudDogMTUsXHJcbiAgICBpZDogMyxcclxuICB9XHJcbl07XHJcblxyXG5jb25zdCBwYWNraW5nRGF0YSA9IHtcclxuICBpZDogMSxcclxuICBuYW1lOiBcIkNhbXBpbmdcIixcclxuICBpdGVtczogW1xyXG4gICAge1xyXG4gICAgICBuYW1lOiBcIkZpcnN0IEFpZCBLaXRcIixcclxuICAgICAgcGFja2VkOiAwLFxyXG4gICAgICB0b1BhY2s6IDFcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6IFwiVGVudFwiLFxyXG4gICAgICBwYWNrZWQ6IDEsXHJcbiAgICAgIHRvUGFjazogMSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6IFwiU2xlZXBpbmcgQmFnc1wiLFxyXG4gICAgICBwYWNrZWQ6IDAsXHJcbiAgICAgIHRvUGFjazogMixcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6IFwiQ2hhbmdlIG9mIENsb3RoZXNcIixcclxuICAgICAgcGFja2VkOiAxLFxyXG4gICAgICB0b1BhY2s6IDIsXHJcbiAgICB9XHJcbiAgXVxyXG59O1xyXG5cclxuY29uc3QgdGVtcGxhdGVzID0ge1xyXG4gICdOb25lJzogW10sXHJcbiAgJ0JlYWNoJzogW1xyXG4gICAgJ3Rvd2VsJyxcclxuICAgICdzdW5zY3JlZW4nLFxyXG4gICAgJ2Nvb2xlcicsICd3YXRlcicsXHJcbiAgICAnc3VuZ2xhc3NlcycsXHJcbiAgICAnc3dpbXN1aXQnLFxyXG4gIF0sXHJcbiAgJ0NhbXBpbmcnOiBbXHJcbiAgICAndGVudCcsXHJcbiAgICAnYnVnLXNwcmF5JyxcclxuICAgICdzbGVlcGluZy1iYWcnLFxyXG4gICAgJ2ZsYXNoLWxpZ2h0JyxcclxuICAgICdmaXJlLXN0YXJ0ZXInLFxyXG4gICAgJ3RvaWxldHJpZXMnLFxyXG4gICAgJ2Zvb2QnLFxyXG4gICAgJ2ZpcnN0LWFpZCBraXQnLFxyXG4gIF0sXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2xpc3RzRGF0YSwgcGFja2luZ0RhdGEsIHRlbXBsYXRlc307Il19
