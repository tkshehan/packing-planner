const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PackList} = require('../models/pack-list-model');

router.get('/', (req, res) => {
  PackList.findOne()
    .then(list => {
      console.log(list);
      res.json(list)
    })
});

router.get('/:id', (req, res) => {
  PackList.findById(req.params.id)
    .then(list => res.json(list.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Could not retrieve List'});
    });
});

router.post('/', (req, res) => {
  const requiredField = 'name';
  if (!(requiredField in req.body)) {
    const message = 'Missing name in request body';
    console.error(message);
    return res.status(400).send(message);
  }

  PackList
    .create({
      name: req.body.name,
      items: req.body.items,
    })
    .then(packList => res.status(201).json(packList.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
    })
});

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'items'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  PackList
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .then(updatedList => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong'}))
});

router.delete('/:id', (req, res) => {
  PackList.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'Pack List Deleted'});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: 'Something went wrong'});
    });
});

module.exports = router;