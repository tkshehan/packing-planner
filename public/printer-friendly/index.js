$(startUp)

function startUp() {
  let id = getIdParameter();
  getAndDisplayData(id);
}

function getIdParameter() {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function getAndDisplayData(id) {
  getData(id)
    .then(displayData);
}

function getData(id) {
  let settings = {
    method: 'GET',
    url: `../api/packing/${id}`,
    contentType: 'application/json; charset=utf-8',
  }
  return $.ajax(settings);
}

function displayData(data) {
  $('header').append(
    $('<h1>').text(data.name)
  );
  let counter = 0;
  let $table = $('<table>');
  data.items.forEach(item => {
    let $newRow = $('<tr>')
      .append(
        $('<td>'),
        $('<td>').text(`${item.item}`)
      );
    $table.append($newRow);
    counter++;
  });
  while (counter < 12) {
    let $newRow = $('<tr>')
      .append(
        $('<td>'),
        $('<td>').text('_________________')
      )
    $table.append($newRow);
    counter++;
  }
  $('main').append($table);
}