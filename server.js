var connect = require('connect');
var modRewrite = require('connect-modrewrite');

var app = connect()
  .use(modRewrite([
  	'^/test/proxy/(.*)$ http://nodejs.org/$1 [P]'
  	//'^/package/(.*)$ http://wellcomelibrary.org/package/$1 [P]'
  ]))
  .use(connect.logger('dev'))
  .use(connect.static(__dirname))
  .listen(3000)