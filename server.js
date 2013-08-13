var connect = require('connect');

var app = connect()
  .use(connect.static(__dirname))
  .listen(3000)