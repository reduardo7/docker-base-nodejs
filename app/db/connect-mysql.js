const config = require('config');
const mysql = require('mysql');

const config_db = config.get('db');

function connect(onConnect) {
  console.log('Waiting for MySQL server...');

  var connection = mysql.createConnection(config_db.connection);
  connection.connect();

  connection.query('SELECT 1 AS solution', (err, rows, fields) => {
    if (err) {
      setTimeout(() => connect(onConnect), config_db.check.interval * 1000);
    } else {
      console.log('MySQL connected!');
      onConnect.apply();
    }
  });

  connection.end();
}

module.exports = connect;
