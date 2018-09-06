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