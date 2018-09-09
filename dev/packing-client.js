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