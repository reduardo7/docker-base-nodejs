const express = require('express');
const app = express();
const connect = require('./db/connect-mongo.js');

connect((db) => {
  console.log('Starting app...');

  var collection = db.collection('city');

  collection.save({ name: 'General Roca' }, { w:1 }, (err, result) => {
    if (err) return console.error(err);
    console.log('Init DB data', result.ops[0]);
  });

  app.get('/', (req, res) => {
    var collection = db.collection('city');
    collection.find({}).toArray((err, result) => {
      res.type('application/json');
      res.send(JSON.stringify(result));
    });
  });

  app.listen(3000, () => {
    console.log('App started!');
  });
});
