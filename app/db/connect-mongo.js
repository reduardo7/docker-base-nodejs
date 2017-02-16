const config = require('config');
const mongoClient = require('mongodb').MongoClient;

const config_db = config.get('db.mongo');
const mongoUrl = `mongodb://${config_db.connection.host}:${config_db.connection.port}/${config_db.connection.database}`;

console.log(`Connecting to MongoDB ${mongoUrl}`);

function connect(onConnect) {
  console.log('Waiting for MongoDB server...');

  mongoClient.connect(mongoUrl, (err, db) => {
    if (err) {
      setTimeout(() => connect(onConnect), config_db.check.interval * 1000);
    } else {
      onConnect(db);
    }
  });
}

module.exports = connect;
