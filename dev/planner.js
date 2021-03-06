const packingApi = require('./packing-api');
const {addNewEntry, buildModalListeners, saveAndUpdate} = require('./modals');
const currentList = {};


function loadPlanner(id) {
  buildPage(id);
  buildListeners(currentList);
  getAndDisplayData(id);
}

function buildPage(id) {
  $('main').empty();

  const $optionBar = buildOptionBar();
  const $quickItems = buildQuickItems();
  const $tableSection = $('<section>',
    {
      class: 'table-section',
      role: 'region',
    });
  const $content = $('<div>').addClass('flex-grid');
  const $printLink = $('<a>', {
    text: 'printer friendly version',
    href: `./printer-friendly/?id=${id}`,
  });

  $content.append($quickItems, $tableSection);
  $('main').append($optionBar, $content, $printLink);

  function buildOptionBar() {
    const $optionBar = $('<section>',
      {
        class: 'option-bar flex-grid',
        role: 'region',
      });
    const $newEntryButton = $('<div>')
      .addClass('col js-new-entry-button')
      .append('<button class="accent"> Add Item');

    const $emptyCol = $('<div>').addClass('col');
    const $mainListButton = $('<div>').addClass('col js-back');
    $mainListButton.append('<button> Back');
    const $saveListButton = $('<div>').addClass('col js-save');
    $saveListButton.append('<button> Save');

    $optionBar.append($newEntryButton, $emptyCol, $mainListButton, $emptyCol.clone(), $saveListButton);
    return $optionBar;
  }

  function buildQuickItems() {
    const $quickItems = $('<section>', {
      class: 'quick-items',
      role: 'region',
    })
      .append($('<div>').text('Quick Add'));
    const items = ['Water', 'Clothes', 'Socks', 'Food', 'Swimsuit', 'Phone-charger', 'First-aid Kit'];
    items.forEach(function(item) {
      const $newButton = $('<button>',
        {
          alt: `Add ${item}`,
          class: `js-quick-item quick-${item.toLocaleLowerCase()}`,
        })
        .data('item', item);
      $quickItems.append($newButton);
    });
    return $quickItems;
  }
}

function getAndDisplayData(id) {
  getData(id)
    .then((data) => {
      currentList.id = data.id;
      currentList.items = data.items;
      currentList.name = data.name;
      return currentList;
    })
    .then(displayData);
}

function getData(id) {
  return packingApi.getById(id);
}

function displayData(data) {
  const $title = $('<h2>').text(data.name);
  const $table = $('<table>')
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
    const $newRow = $('<tr>').data('id', item._id)
      .append(
        $('<td>').addClass('td-check')
          .append(
            $('<button>', {
              'class': 'check js-check-entry',
              'aria-label': 'check',
            })
          ),
        $('<td>').text(item.item),
        $('<td>').text(`${item.packed} / ${item.toPack}`).addClass('td-packed'),
        $('<td>').addClass('td-delete')
          .append(
            $('<button>', {
              'class': 'delete js-delete-entry',
              'aria-label': 'delete',
            })
          )
      );

    if (item.packed >= item.toPack) {
      $newRow.addClass('green');
    }

    $table.append($newRow);
  });

  $('.table-section').append($title, $table);
}

function buildListeners(list) {
  const $main = $('main');
  $main.off();
  $('body').off();

  buildModalListeners(list);

  $main.on('click', '.js-back', function() {
    packingApi.updatedById(currentList.id, currentList);
    const {loadManager} = require('./lists-manager');
    loadManager();
  });

  $main.on('click', '.js-check-entry', function() {
    const $row = $(this).closest('tr');
    const item = currentList.items.filter((item) => item._id === $row.data('id'))[0];

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
  });

  $main.on('click', '.js-delete-entry', function() {
    const $row = $(this).closest('tr');
    currentList.items = currentList.items.filter((item) => item._id !== $row.data('id'));
    $row.remove();
  });

  $main.on('click', '.js-save', function() {
    packingApi.updatedById(currentList.id, currentList);
  });

  $('main').on('click', '.js-quick-item', function() {
    const newItem = $(this).data('item');
    let hasItem = false;

    currentList.items.forEach((item) => {
      if (item.item === newItem) {
        item.toPack++;
        hasItem = true;
      }
    });

    if (!hasItem) {
      addNewEntry(currentList, newItem);
    }

    saveAndUpdate(currentList);
  });
}

module.exports = {loadPlanner};
