(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {loadManager} = require('./lists-manager');

$(startUp);

function startUp() {
  loadManager();
}
},{"./lists-manager":3}],2:[function(require,module,exports){
const {packingData} = require('./mock-data');

function loadPlanner(id) {
  getAndDisplayData(id);
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
  console.log(data);
}

module.exports = {loadPlanner};
},{"./mock-data":4}],3:[function(require,module,exports){
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
},{"./list-planner":2,"./mock-data":4}],4:[function(require,module,exports){
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

module.exports = {listsData, packingData};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L2xpc3QtcGxhbm5lci5qcyIsImRldi9saXN0cy1tYW5hZ2VyLmpzIiwiZGV2L21vY2stZGF0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3Qge2xvYWRNYW5hZ2VyfSA9IHJlcXVpcmUoJy4vbGlzdHMtbWFuYWdlcicpO1xyXG5cclxuJChzdGFydFVwKTtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0VXAoKSB7XHJcbiAgbG9hZE1hbmFnZXIoKTtcclxufSIsImNvbnN0IHtwYWNraW5nRGF0YX0gPSByZXF1aXJlKCcuL21vY2stZGF0YScpO1xyXG5cclxuZnVuY3Rpb24gbG9hZFBsYW5uZXIoaWQpIHtcclxuICBnZXRBbmREaXNwbGF5RGF0YShpZCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFuZERpc3BsYXlEYXRhKGlkKSB7XHJcbiAgZ2V0RGF0YShpZCkudGhlbihkaXNwbGF5RGF0YSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGEoaWQpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgcmVzb2x2ZShwYWNraW5nRGF0YSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlEYXRhKGRhdGEpIHtcclxuICBjb25zb2xlLmxvZyhkYXRhKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7bG9hZFBsYW5uZXJ9OyIsImNvbnN0IHtsaXN0c0RhdGF9ID0gcmVxdWlyZSgnLi9tb2NrLWRhdGEnKTtcclxuY29uc3Qge2xvYWRQbGFubmVyfSA9IHJlcXVpcmUoJy4vbGlzdC1wbGFubmVyJyk7XHJcblxyXG5mdW5jdGlvbiBsb2FkTWFuYWdlcigpIHtcclxuICBidWlsZFBhZ2UoKTtcclxuICBidWlsZExpc3RlbmVycygpO1xyXG4gIGdldEFuZERpc3BsYXlMaXN0cygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFBhZ2UoKSB7XHJcbiAgJCgnbWFpbicpLmVtcHR5KCk7XHJcbiAgbGV0ICRvcHRpb25CYXIgPSBidWlsZE9wdGlvbkJhcigpO1xyXG4gIGxldCAkdGFibGVTZWN0aW9uID0gJCgnPHNlY3Rpb24+JykuYWRkQ2xhc3MoJ3RhYmxlLXNlY3Rpb24nKTtcclxuXHJcbiAgJCgnbWFpbicpLmFwcGVuZCgkb3B0aW9uQmFyLCAkdGFibGVTZWN0aW9uKTtcclxuXHJcbiAgZnVuY3Rpb24gYnVpbGRPcHRpb25CYXIoKSB7XHJcbiAgICBsZXQgJG9wdGlvbkJhciA9ICQoJzxzZWN0aW9uPicpLmFkZENsYXNzKCdvcHRpb24tYmFyIGZsZXgtZ3JpZCcpO1xyXG4gICAgbGV0ICRuZXdMaXN0QnV0dG9uID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sIGpzLW5ldy1saXN0LWJ1dHRvbicpO1xyXG4gICAgJG5ld0xpc3RCdXR0b24uYXBwZW5kKCc8YnV0dG9uPiBOZXcgUGFja2luZyBMaXN0Jyk7XHJcbiAgICBsZXQgJGVtcHR5Q29sID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnY29sJyk7XHJcblxyXG4gICAgJG9wdGlvbkJhci5hcHBlbmQoJG5ld0xpc3RCdXR0b24sICRlbXB0eUNvbCk7XHJcbiAgICByZXR1cm4gJG9wdGlvbkJhcjtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTGlzdGVuZXJzKCkge1xyXG4gICQoJ21haW4nKS5vbignY2xpY2snLCAndHInLCBmdW5jdGlvbigpIHtcclxuICAgIGxldCBpZCA9ICQodGhpcykuZGF0YSgnaWQnKTtcclxuICAgIGxvYWRQbGFubmVyKGlkKTtcclxuICB9KTtcclxuXHJcbiAgJCgnbWFpbicpLm9uKCdjbGljaycsICcuanMtbmV3LWxpc3QtYnV0dG9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICBkaXNwbGF5TmV3TGlzdE1vZGFsKCk7XHJcbiAgfSk7XHJcblxyXG4gICQoJ2JvZHknKS5vbignc3VibWl0JywgJy5qcy1uZXctbGlzdC1mb3JtJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGxldCB2YWx1ZXMgPSAkKHRoaXMpLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGxldCBuYW1lID0gdmFsdWVzWzBdLnZhbHVlO1xyXG4gICAgbGV0IHRlbXBsYXRlID0gdmFsdWVzWzFdLnZhbHVlO1xyXG4gICAgYnVpbGROZXdMaXN0KG5hbWUsIHRlbXBsYXRlKTtcclxuXHJcbiAgICAkKCcub3ZlcmxheScpLnJlbW92ZSgpO1xyXG4gICAgJCgnLm1vZGFsJykucmVtb3ZlKCk7XHJcbiAgfSlcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtY2xvc2UtbW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICQoJy5vdmVybGF5JykucmVtb3ZlKCk7XHJcbiAgICAkKCcubW9kYWwnKS5yZW1vdmUoKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheU5ld0xpc3RNb2RhbCgpIHtcclxuICBsZXQgJG92ZXJsYXkgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdvdmVybGF5Jyk7XHJcbiAgbGV0ICRtb2RhbCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21vZGFsJylcclxuICAgIC5hdHRyKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XHJcbiAgJCgnYm9keScpLmFwcGVuZCgkb3ZlcmxheSwgJG1vZGFsKTtcclxuXHJcbiAgbGV0ICRjb250ZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbW9kYWwtY29udGVudCcpO1xyXG4gIGxldCAkbmV3TGlzdEZvcm0gPSAkKCc8Zm9ybT4nKVxyXG4gICAgLmFkZENsYXNzKCdqcy1uZXctbGlzdC1mb3JtJylcclxuICAgIC5odG1sKGBcclxuICAgICAgPGxlZ2VuZD4gQ3JlYXRlIE5ldyBMaXN0IDwvbGVnZW5kPlxyXG4gICAgICA8bGFiZWwgZm9yPVwibmFtZVwiPk5hbWU6IDwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCIgaWQ9XCJuZXctbGlzdC1uYW1lXCI+XHJcblxyXG4gICAgICA8bGFiZWwgZm9yPVwidGVtcGxhdGVcIj5UZW1wbGF0ZTwvbGFiZWw+XHJcbiAgICAgIDxzZWxlY3QgbmFtZT1cInRlbXBsYXRlXCIgaWQ9XCJ0ZW1wbGF0ZS1zZWxlY3RcIj5cclxuICAgICAgICA8b3B0aW9uPk5vbmU8L29wdGlvbj5cclxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiY2FtcGluZ1wiPkNhbXBpbmc8L29wdGlvbj5cclxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYmVhY2hcIj5CZWFjaDwvb3B0aW9uPlxyXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCJnZW5lcmFsXCI+R2VuZXJhbDwvb3B0aW9uPlxyXG4gICAgICA8L3NlbGVjdD5cclxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tYnV0dG9uc1wiPlxyXG4gICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJDcmVhdGVcIiBjbGFzcz1cImJ1dHRvblwiPlxyXG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJqcy1jbG9zZS1tb2RhbCBidXR0b25cIj4gQ2FuY2VsIDwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICBgKTtcclxuXHJcbiAgJGNvbnRlbnQuYXBwZW5kKCRuZXdMaXN0Rm9ybSk7XHJcbiAgJG1vZGFsLmFwcGVuZCgkY29udGVudCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRBbmREaXNwbGF5TGlzdHMoKSB7XHJcbiAgZ2V0TGlzdHMoKS50aGVuKGRpc3BsYXlMaXN0cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldExpc3RzKCkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICByZXNvbHZlKGxpc3RzRGF0YSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlMaXN0cyhsaXN0cykge1xyXG4gIGxldCAkdGFibGUgPSAkKCc8dGFibGU+JylcclxuICAgIC5hZGRDbGFzcygnanMtdGFibGUnKVxyXG4gICAgLmFwcGVuZChgXHJcbiAgICA8dHI+XHJcbiAgICAgIDx0aD4gTmFtZSA8L3RkPlxyXG4gICAgICA8dGg+IEl0ZW1zIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gIGApO1xyXG5cclxuICBsaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XHJcbiAgICBsZXQgJG5ld1JvdyA9ICQoJzx0cj4nKVxyXG4gICAgICAuYXBwZW5kKGBcclxuICAgICAgICA8dGQ+ICR7bGlzdC5uYW1lfSA8L3RkPlxyXG4gICAgICAgIDx0ZD4gJHtsaXN0LnBhY2tlZEFtb3VudH0gLyAke2xpc3QuYW1vdW50fSA8L3RkPmBcclxuICAgICAgKVxyXG4gICAgICAuZGF0YSgnaWQnLCBsaXN0LmlkKTtcclxuICAgICR0YWJsZS5hcHBlbmQoJG5ld1Jvdyk7XHJcbiAgfSk7XHJcbiAgJCgnLnRhYmxlLXNlY3Rpb24nKS5hcHBlbmQoJHRhYmxlKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGJ1aWxkTmV3TGlzdChuYW1lLCB0ZW1wbGF0ZSkge1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7bG9hZE1hbmFnZXJ9IiwiY29uc3QgbGlzdHNEYXRhID0gW1xyXG4gIHtcclxuICAgIG5hbWU6IFwiQ2FtcGluZ1wiLFxyXG4gICAgYW1vdW50OiA0LFxyXG4gICAgcGFja2VkQW1vdW50OiAxLFxyXG4gICAgaWQ6IDEsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiBcIkJlYWNoIFRyaXBcIixcclxuICAgIGFtb3VudDogMTAsXHJcbiAgICBwYWNrZWRBbW91bnQ6IDksXHJcbiAgICBpZDogMixcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6IFwiRmFtaWx5IFJldW5pb25cIixcclxuICAgIGFtb3VudDogMTUsXHJcbiAgICBwYWNrZWRBbW91bnQ6IDE1LFxyXG4gICAgaWQ6IDMsXHJcbiAgfVxyXG5dO1xyXG5cclxuY29uc3QgcGFja2luZ0RhdGEgPSB7XHJcbiAgaWQ6IDEsXHJcbiAgbmFtZTogXCJDYW1waW5nXCIsXHJcbiAgaXRlbXM6IFtcclxuICAgIHtcclxuICAgICAgbmFtZTogXCJGaXJzdCBBaWQgS2l0XCIsXHJcbiAgICAgIHBhY2tlZDogMCxcclxuICAgICAgdG9QYWNrOiAxXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiBcIlRlbnRcIixcclxuICAgICAgcGFja2VkOiAxLFxyXG4gICAgICB0b1BhY2s6IDEsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiBcIlNsZWVwaW5nIEJhZ3NcIixcclxuICAgICAgcGFja2VkOiAwLFxyXG4gICAgICB0b1BhY2s6IDIsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiBcIkNoYW5nZSBvZiBDbG90aGVzXCIsXHJcbiAgICAgIHBhY2tlZDogMSxcclxuICAgICAgdG9QYWNrOiAyLFxyXG4gICAgfVxyXG4gIF1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2xpc3RzRGF0YSwgcGFja2luZ0RhdGF9OyJdfQ==
