'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PackListSchema = mongoose.Schema({
  name: String,
  items: [{
    item: String,
    packed: Number,
    toPack: Number,
  }],
});

PackListSchema.methods.serialize = function() {
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