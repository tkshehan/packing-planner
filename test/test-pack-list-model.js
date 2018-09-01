const chai = require('chai');
const chaitHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {PackList} = require('../models/pack-list-model');

chai.use(chaitHttp);

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

describe('PackList Schema', function() {
  seedPackList().then(function(res) {
    console.log(res.map((item) => item.serialize()));
  });
});