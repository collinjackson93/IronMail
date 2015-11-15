var mongoose = require('mongoose');

var dbURI = 'mongodb://mongo:27017/';

// Connect to the production or test database
if (process.env.NODE_ENV === 'test') {
  dbURI += 'ironmailtest';
} else {
  dbURI += 'ironmail';
}

// register listeners before calling connect()
mongoose.connection.once('open', function () {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
  console.error('Mongoose connection error: ' + err);
})

mongoose.connect(dbURI);
