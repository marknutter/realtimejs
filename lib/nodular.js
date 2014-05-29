/**
 * Module dependencies.
 */

var connections = require('./connections'),
    permit = require('./permit'),
    format = require('util').format,
    messenger = require('./messenger'),
    _ = require('underscore');
    connect = require('connect');
    serveStatic = require('serve-static');


/**
 * global onMessage callback
 * @param  {message} message
 * @param  {WebSocket} ws
 * @return {null}
 */
connections.onMessage = function(message, ws) {
  console.log("checking permissions");
  permit.isAllowed(message)
  .then(function() {
    console.log("permitted!");
    messenger.exec(message, ws)
    .then(function() {
      console.log("message saved!")
    })
  }, function() {

  });
};


// serve admin console

var app = connect();
app.use(serveStatic('lib/backend/', {'index': ['index.html', 'app.js']}));
app.listen(3000);