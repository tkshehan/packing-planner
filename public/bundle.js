(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {loadManager} = require('./lists-manager');

$(startUp);

function startUp() {
  loadManager();
}
},{"./lists-manager":2}],2:[function(require,module,exports){
const {listsData} = require('./mock-data');

function loadManager() {
  $('main').empty();
  getAndDisplayLists();
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
  let table = $('<table>').addClass('js-table');
  table.append(`
    <tr>
      <th> Name </td>
      <th> Items </td>
    </tr>
  `);
  lists.forEach((list) => {
    let newRow = `
    <tr>
      <td> ${list.name} </td>
      <td> ${list.packedAmount} / ${list.amount} </td>
    </tr>`;
    table.append(newRow);
    console.log('new row added');
  });
  $('main').append(table);
};

module.exports = {loadManager}
},{"./mock-data":3}],3:[function(require,module,exports){
const listsData = [
  {
    name: "Camping",
    amount: 15,
    packedAmount: 5,
  },
  {
    name: "Beach Trip",
    amount: 10,
    packedAmount: 9,
  }
];

module.exports = {listsData};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvYXBwLmpzIiwiZGV2L2xpc3RzLW1hbmFnZXIuanMiLCJkZXYvbW9jay1kYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHtsb2FkTWFuYWdlcn0gPSByZXF1aXJlKCcuL2xpc3RzLW1hbmFnZXInKTtcclxuXHJcbiQoc3RhcnRVcCk7XHJcblxyXG5mdW5jdGlvbiBzdGFydFVwKCkge1xyXG4gIGxvYWRNYW5hZ2VyKCk7XHJcbn0iLCJjb25zdCB7bGlzdHNEYXRhfSA9IHJlcXVpcmUoJy4vbW9jay1kYXRhJyk7XHJcblxyXG5mdW5jdGlvbiBsb2FkTWFuYWdlcigpIHtcclxuICAkKCdtYWluJykuZW1wdHkoKTtcclxuICBnZXRBbmREaXNwbGF5TGlzdHMoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QW5kRGlzcGxheUxpc3RzKCkge1xyXG4gIGdldExpc3RzKCkudGhlbihkaXNwbGF5TGlzdHMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRMaXN0cygpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgcmVzb2x2ZShsaXN0c0RhdGEpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5TGlzdHMobGlzdHMpIHtcclxuICBsZXQgdGFibGUgPSAkKCc8dGFibGU+JykuYWRkQ2xhc3MoJ2pzLXRhYmxlJyk7XHJcbiAgdGFibGUuYXBwZW5kKGBcclxuICAgIDx0cj5cclxuICAgICAgPHRoPiBOYW1lIDwvdGQ+XHJcbiAgICAgIDx0aD4gSXRlbXMgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgYCk7XHJcbiAgbGlzdHMuZm9yRWFjaCgobGlzdCkgPT4ge1xyXG4gICAgbGV0IG5ld1JvdyA9IGBcclxuICAgIDx0cj5cclxuICAgICAgPHRkPiAke2xpc3QubmFtZX0gPC90ZD5cclxuICAgICAgPHRkPiAke2xpc3QucGFja2VkQW1vdW50fSAvICR7bGlzdC5hbW91bnR9IDwvdGQ+XHJcbiAgICA8L3RyPmA7XHJcbiAgICB0YWJsZS5hcHBlbmQobmV3Um93KTtcclxuICAgIGNvbnNvbGUubG9nKCduZXcgcm93IGFkZGVkJyk7XHJcbiAgfSk7XHJcbiAgJCgnbWFpbicpLmFwcGVuZCh0YWJsZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtsb2FkTWFuYWdlcn0iLCJjb25zdCBsaXN0c0RhdGEgPSBbXHJcbiAge1xyXG4gICAgbmFtZTogXCJDYW1waW5nXCIsXHJcbiAgICBhbW91bnQ6IDE1LFxyXG4gICAgcGFja2VkQW1vdW50OiA1LFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogXCJCZWFjaCBUcmlwXCIsXHJcbiAgICBhbW91bnQ6IDEwLFxyXG4gICAgcGFja2VkQW1vdW50OiA5LFxyXG4gIH1cclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge2xpc3RzRGF0YX07Il19
