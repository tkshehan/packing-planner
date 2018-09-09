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