const Sequelize = require('sequelize');
const express = require('express');
const app = express();
const config = require('config');
const co = require('co');
const mysql = require('mysql');

const config_db = config.get('db');

function connectToDB(onConnect) {
  console.log('Waiting for MySQL server...');

  var connection = mysql.createConnection(config_db.connection);
  connection.connect();

  connection.query('SELECT 1 AS solution', (err, rows, fields) => {
    if (err) {
      setTimeout(() => connectToDB(onConnect), config_db.check.interval * 1000);
    } else {
      console.log('MySQL connected!');
      onConnect.apply();
    }
  });

  connection.end();
};

connectToDB(() => {
  console.log('Starting app...');
  const sequelize = new Sequelize(config_db.connection.database, config_db.connection.user, config_db.connection.password, { host: config_db.connection.host });

  const City = sequelize.define('city', {
    name: { type: Sequelize.STRING, allowNull: false },
    order: { type: Sequelize.INTEGER, field: 'order_', allowNull: false }
  });
  City.sync().then(() => {
    City.create({ order: 13, name: 'General Roca' });
  });

  app.get('/', (req, res) => {
    co(function* () {
      let json = {};

      json.city = yield City.findAll({ order: [[ 'order', 'ASC' ], [ 'name', 'ASC' ]] });

      res.type('application/json');
      res.send(JSON.stringify(json));
    });
  });

  app.listen(3000, () => {
    console.log('App started!');
  });
});
