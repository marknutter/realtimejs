var ws = require('ws'),
format = require('util').format,
wss = new ws.Server({port: 8080}),
_ = require('underscore');

var connections = [];

module.exports.onConnect = function() {};
module.exports.onMessage = function() {};
module.exports.onClose = function() {};

wss.on('connection', function(ws) {
  connections.push(ws);



  var connection = {
    ws: ws,
    onMessage: function() {},
    onClose: function() {}
  }


  ws.on('message', function(message) {
    console.log('received: %s', message);
    module.exports.onMessage(JSON.parse(message), ws);

  });

  ws.on('close', function() {
    connections.splice(connections.indexOf(ws), 1);
    module.exports.onClose(ws);
  });

  module.exports.all = function() {
    return connections;
  }

  module.exports.onConnect(ws);

});