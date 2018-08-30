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

  $('body').on('click', '.js-close-modal', function() {
    $('.overlay').remove();
    $('.modal').remove();
  });
}

function displayNewListModal() {
  let $overlay = $('<div>').addClass('overlay');
  let $modal = $('<div>').addClass('modal');
  let $content = $('<div>').addClass('modal-content');
  let $closeButton = $('<button> ')
    .text('Close')
    .addClass('js-close-modal close-modal');
  $content.append('<p> No Content Yet', $closeButton);
  $modal.append($content);
  $('body').append($overlay, $modal);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L2xpc3QtcGxhbm5lci5qcyIsImRldi9saXN0cy1tYW5hZ2VyLmpzIiwiZGV2L21vY2stZGF0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB7bG9hZE1hbmFnZXJ9ID0gcmVxdWlyZSgnLi9saXN0cy1tYW5hZ2VyJyk7XHJcblxyXG4kKHN0YXJ0VXApO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRVcCgpIHtcclxuICBsb2FkTWFuYWdlcigpO1xyXG59IiwiY29uc3Qge3BhY2tpbmdEYXRhfSA9IHJlcXVpcmUoJy4vbW9jay1kYXRhJyk7XHJcblxyXG5mdW5jdGlvbiBsb2FkUGxhbm5lcihpZCkge1xyXG4gIGdldEFuZERpc3BsYXlEYXRhKGlkKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QW5kRGlzcGxheURhdGEoaWQpIHtcclxuICBnZXREYXRhKGlkKS50aGVuKGRpc3BsYXlEYXRhKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0YShpZCkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICByZXNvbHZlKHBhY2tpbmdEYXRhKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheURhdGEoZGF0YSkge1xyXG4gIGNvbnNvbGUubG9nKGRhdGEpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtsb2FkUGxhbm5lcn07IiwiY29uc3Qge2xpc3RzRGF0YX0gPSByZXF1aXJlKCcuL21vY2stZGF0YScpO1xyXG5jb25zdCB7bG9hZFBsYW5uZXJ9ID0gcmVxdWlyZSgnLi9saXN0LXBsYW5uZXInKTtcclxuXHJcbmZ1bmN0aW9uIGxvYWRNYW5hZ2VyKCkge1xyXG4gIGJ1aWxkUGFnZSgpO1xyXG4gIGJ1aWxkTGlzdGVuZXJzKCk7XHJcbiAgZ2V0QW5kRGlzcGxheUxpc3RzKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkUGFnZSgpIHtcclxuICAkKCdtYWluJykuZW1wdHkoKTtcclxuICBsZXQgJG9wdGlvbkJhciA9IGJ1aWxkT3B0aW9uQmFyKCk7XHJcbiAgbGV0ICR0YWJsZVNlY3Rpb24gPSAkKCc8c2VjdGlvbj4nKS5hZGRDbGFzcygndGFibGUtc2VjdGlvbicpO1xyXG5cclxuICAkKCdtYWluJykuYXBwZW5kKCRvcHRpb25CYXIsICR0YWJsZVNlY3Rpb24pO1xyXG5cclxuICBmdW5jdGlvbiBidWlsZE9wdGlvbkJhcigpIHtcclxuICAgIGxldCAkb3B0aW9uQmFyID0gJCgnPHNlY3Rpb24+JykuYWRkQ2xhc3MoJ29wdGlvbi1iYXIgZmxleC1ncmlkJyk7XHJcbiAgICBsZXQgJG5ld0xpc3RCdXR0b24gPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdjb2wganMtbmV3LWxpc3QtYnV0dG9uJyk7XHJcbiAgICAkbmV3TGlzdEJ1dHRvbi5hcHBlbmQoJzxidXR0b24+IE5ldyBQYWNraW5nIExpc3QnKTtcclxuICAgIGxldCAkZW1wdHlDb2wgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdjb2wnKTtcclxuXHJcbiAgICAkb3B0aW9uQmFyLmFwcGVuZCgkbmV3TGlzdEJ1dHRvbiwgJGVtcHR5Q29sKTtcclxuICAgIHJldHVybiAkb3B0aW9uQmFyO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRMaXN0ZW5lcnMoKSB7XHJcbiAgJCgnbWFpbicpLm9uKCdjbGljaycsICd0cicsIGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IGlkID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xyXG4gICAgbG9hZFBsYW5uZXIoaWQpO1xyXG4gIH0pO1xyXG5cclxuICAkKCdtYWluJykub24oJ2NsaWNrJywgJy5qcy1uZXctbGlzdC1idXR0b24nLCBmdW5jdGlvbigpIHtcclxuICAgIGRpc3BsYXlOZXdMaXN0TW9kYWwoKTtcclxuICB9KTtcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtY2xvc2UtbW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICQoJy5vdmVybGF5JykucmVtb3ZlKCk7XHJcbiAgICAkKCcubW9kYWwnKS5yZW1vdmUoKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheU5ld0xpc3RNb2RhbCgpIHtcclxuICBsZXQgJG92ZXJsYXkgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdvdmVybGF5Jyk7XHJcbiAgbGV0ICRtb2RhbCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ21vZGFsJyk7XHJcbiAgbGV0ICRjb250ZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbW9kYWwtY29udGVudCcpO1xyXG4gIGxldCAkY2xvc2VCdXR0b24gPSAkKCc8YnV0dG9uPiAnKVxyXG4gICAgLnRleHQoJ0Nsb3NlJylcclxuICAgIC5hZGRDbGFzcygnanMtY2xvc2UtbW9kYWwgY2xvc2UtbW9kYWwnKTtcclxuICAkY29udGVudC5hcHBlbmQoJzxwPiBObyBDb250ZW50IFlldCcsICRjbG9zZUJ1dHRvbik7XHJcbiAgJG1vZGFsLmFwcGVuZCgkY29udGVudCk7XHJcbiAgJCgnYm9keScpLmFwcGVuZCgkb3ZlcmxheSwgJG1vZGFsKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldEFuZERpc3BsYXlMaXN0cygpIHtcclxuICBnZXRMaXN0cygpLnRoZW4oZGlzcGxheUxpc3RzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TGlzdHMoKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIHJlc29sdmUobGlzdHNEYXRhKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGxheUxpc3RzKGxpc3RzKSB7XHJcbiAgbGV0ICR0YWJsZSA9ICQoJzx0YWJsZT4nKVxyXG4gICAgLmFkZENsYXNzKCdqcy10YWJsZScpXHJcbiAgICAuYXBwZW5kKGBcclxuICAgIDx0cj5cclxuICAgICAgPHRoPiBOYW1lIDwvdGQ+XHJcbiAgICAgIDx0aD4gSXRlbXMgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgYCk7XHJcblxyXG4gIGxpc3RzLmZvckVhY2goKGxpc3QpID0+IHtcclxuICAgIGxldCAkbmV3Um93ID0gJCgnPHRyPicpXHJcbiAgICAgIC5hcHBlbmQoYFxyXG4gICAgICAgIDx0ZD4gJHtsaXN0Lm5hbWV9IDwvdGQ+XHJcbiAgICAgICAgPHRkPiAke2xpc3QucGFja2VkQW1vdW50fSAvICR7bGlzdC5hbW91bnR9IDwvdGQ+YFxyXG4gICAgICApXHJcbiAgICAgIC5kYXRhKCdpZCcsIGxpc3QuaWQpO1xyXG4gICAgJHRhYmxlLmFwcGVuZCgkbmV3Um93KTtcclxuICB9KTtcclxuICAkKCcudGFibGUtc2VjdGlvbicpLmFwcGVuZCgkdGFibGUpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7bG9hZE1hbmFnZXJ9IiwiY29uc3QgbGlzdHNEYXRhID0gW1xyXG4gIHtcclxuICAgIG5hbWU6IFwiQ2FtcGluZ1wiLFxyXG4gICAgYW1vdW50OiA0LFxyXG4gICAgcGFja2VkQW1vdW50OiAxLFxyXG4gICAgaWQ6IDEsXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiBcIkJlYWNoIFRyaXBcIixcclxuICAgIGFtb3VudDogMTAsXHJcbiAgICBwYWNrZWRBbW91bnQ6IDksXHJcbiAgICBpZDogMixcclxuICB9LFxyXG4gIHtcclxuICAgIG5hbWU6IFwiRmFtaWx5IFJldW5pb25cIixcclxuICAgIGFtb3VudDogMTUsXHJcbiAgICBwYWNrZWRBbW91bnQ6IDE1LFxyXG4gICAgaWQ6IDMsXHJcbiAgfVxyXG5dO1xyXG5cclxuY29uc3QgcGFja2luZ0RhdGEgPSB7XHJcbiAgaWQ6IDEsXHJcbiAgbmFtZTogXCJDYW1waW5nXCIsXHJcbiAgaXRlbXM6IFtcclxuICAgIHtcclxuICAgICAgbmFtZTogXCJGaXJzdCBBaWQgS2l0XCIsXHJcbiAgICAgIHBhY2tlZDogMCxcclxuICAgICAgdG9QYWNrOiAxXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiBcIlRlbnRcIixcclxuICAgICAgcGFja2VkOiAxLFxyXG4gICAgICB0b1BhY2s6IDEsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiBcIlNsZWVwaW5nIEJhZ3NcIixcclxuICAgICAgcGFja2VkOiAwLFxyXG4gICAgICB0b1BhY2s6IDIsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiBcIkNoYW5nZSBvZiBDbG90aGVzXCIsXHJcbiAgICAgIHBhY2tlZDogMSxcclxuICAgICAgdG9QYWNrOiAyLFxyXG4gICAgfVxyXG4gIF1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2xpc3RzRGF0YSwgcGFja2luZ0RhdGF9OyJdfQ==
