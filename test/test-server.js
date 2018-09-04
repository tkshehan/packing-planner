const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;
const {TEST_DATABASE_URL} = require('../config');
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

function seedPackList() {
  console.info('seeding packlists');
  const seedData = [...Array(10)].map(() => generatePackListData());
  return PackList.insertMany(seedData);
}

function generatePackListData() {
  return {
    name: faker.random.words(3),
    items: [...Array(7)].map(() => {
      return {
        item: faker.random.words(1),
        packed: faker.random.number(1, 5),
        toPack: faker.random.number(6, 10),
      };
    }),
  };
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

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

describe('PackList API Resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedPackList();
  });

  afterEach(function() {
    return tearDownDb();
  })

  after(function() {
    return closeServer();
  });

  describe('GET /pack-lists/:id endpoint');

  describe('POST /pack-lists endpoint');

  describe('DELETE /pack-lists/:id endpoint');

  describe('PUT /pack-lists/:id endpoint');

})