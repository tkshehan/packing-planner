const defaultTemplates = {
  'None': [],
  'Beach': [
    {item: 'Towel'},
    {item: 'Sunscreen'},
    {item: 'Water'},
    {item: 'Swimsuit'},
  ],
  'Camping': [
    {item: 'Tent'},
    {item: 'Bug-spray'},
    {item: 'Sleeping-bag'},
    {item: 'Flashlight'},
    {item: 'Fire starter'},
    {item: 'Toiletries'},
    {item: 'Food'},
    {item: 'First-aid Kit'},
  ],
}

let templates = loadTemplates() || defaultTemplates;

function loadTemplates() {
  return JSON.parse(localStorage.getItem('templates'));
}

function saveTemplates(templates) {
  templates.None = [];
  localStorage.setItem('templates', JSON.stringify(templates));
}

function resetTemplates() {
  templates = defaultTemplates;
}

module.exports = {templates, saveTemplates, resetTemplates};