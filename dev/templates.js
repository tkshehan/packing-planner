const defaultTemplates = {
  'None': [],
  'Beach': [
    {item: 'towel'},
    {item: 'sunscreen'},
    {item: 'water'},
    {item: 'swimsuit'},
  ],
  'Camping': [
    {item: 'tent'},
    {item: 'bug-spray'},
    {item: 'sleeping-bag'},
    {item: 'flashlight'},
    {item: 'fire starter'},
    {item: 'toiletries'},
    {item: 'food'},
    {item: 'first-aid kit'},
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