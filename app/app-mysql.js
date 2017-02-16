const Sequelize = require('sequelize');
const express = require('express');
const app = express();
const config = require('config');
const co = require('co');
const connect = require('./db/connect-mysql.js')

const config_db = config.get('db.mysql');

connect(() => {
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
