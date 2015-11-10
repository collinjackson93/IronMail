var forever = require('forever-monitor');

var child = new (forever.Monitor)('index.js', {
  minUptime: 2000 // app must be running 2 seconds before it gets restarted
});

child.start();
