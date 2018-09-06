const {loadManager} = require('./lists-manager');

$(startUp);

function startUp() {
  const {loadLanding} = require('./landing.js');
  loadLanding();
}