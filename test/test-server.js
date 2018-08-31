const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;
const {TEST_DATABASE_URL} = require('../config');
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

describe('Connect to Server', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  it('should connect to the root server', function() {
    chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
      });
  });
});