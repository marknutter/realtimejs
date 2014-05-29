var fs = require('fs');

module.exports.run = function (worker) {
    // Get a reference to our raw Node HTTP server
    var httpServer = worker.getHTTPServer();
    // Get a reference to our WebSocket server

    var wsServer = worker._server;

    /*
        We're going to read our main HTML file and the socketcluster-client
        script from disk and serve it to clients using the Node HTTP server.
    */

    var htmlPath = __dirname + '/index.html';
    var clientPath = __dirname + '/../node_modules/socketcluster-client/socketcluster.js';

    var html = fs.readFileSync(htmlPath, {
        encoding: 'utf8'
    });

    var clientCode = fs.readFileSync(clientPath, {
        encoding: 'utf8'
    });

    /*
        Very basic code to serve our main HTML file to clients and
        our socketcluster-client script when requested.
        It may be better to use a framework like express here.
        Note that the 'req' event used here is different from the standard Node.js HTTP server 'request' event
        - The 'request' event also captures SocketCluster-related requests; the 'req'
        event only captures the ones you actually need. As a rule of thumb, you should not listen to the 'request' event.
    */
    httpServer.on('req', function (req, res) {
        if (req.url == '/socketcluster.js') {
            res.writeHead(200, {
                'Content-Type': 'text/javascript'
            });
            res.end(clientCode);
        } else if (req.url == '/') {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(html);
        }
    });

    var activeSessions = {};

    /*
        In here we handle our incoming WebSocket connections and listen for events.
        From here onwards is just like Socket.io but with some additional features.
    */
    wsServer.on('connection', function (socket) {
        // Emit a 'greet' event on the current socket with value 'hello world'
        socket.emit('greet', 'hello world');

        /*
            Store that socket's session for later use.
            We will emit events on it later - Those events will
            affect all sockets which belong to that session.
        */
        activeSessions[socket.session.id] = socket.session;
    });

    wsServer.on('disconnection', function (socket) {
        console.log('Socket ' + socket.id + ' was disconnected');
    });

    wsServer.on('sessiondestroy', function (ssid) {
        delete activeSessions[ssid];
    });

    setInterval(function () {
        /*
            Emit a 'rand' event on each active session.
            Note that in this case the random number emitted will be the same across all sockets which
            belong to the same session (I.e. All open tabs within the same browser).
        */
        for (var i in activeSessions) {
            activeSessions[i].emit('rand', Math.floor(Math.random() * 100));
        }
    }, 1000);
};