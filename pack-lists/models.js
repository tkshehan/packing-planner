'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PackListSchema = mongoose.Schema({
  name: {type: String, required: true},
  items: [{
    item: {type: String, required: true},
    packed: {type: Number, default: 0},
    toPack: {type: Number, default: 1},
  }],
});

PackListSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    items: this.items,
  };
}

PackListSchema.methods.summarize = function() {
  let {packed, toPack} = this.items.reduce((accum, item) => {
    accum.packed += item.packed;
    accum.toPack += item.toPack;
    return accum;
  }, {packed: 0, toPack: 0});

  return {
    id: this._id,
    name: this.name,
    packed,
    toPack
  };
}

const PackList = mongoose.model('PackList', PackListSchema);

module.exports = {PackList};