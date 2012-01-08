var port        = 3333;
var connections = 0;
var players     = {}

var app = require('express').createServer();
var io  = require('socket.io').listen(app);

app.listen(port);

console.log ('Server started, port: ' + port);

app.get ('/', function (req, res) {
    res.sendfile(__dirname + '/pong.html');
});

app.get ('/pong.js', function (req, res) {
    res.sendfile(__dirname + '/pong.js');
});

app.dynamicHelpers({
    scripts: function() {
        //scripts to load on every page
        return ['./pong.js'];
    }
});

io.sockets.on ('connection', function (socket) {
    socket.emit('Server ready');
    
    connections++
    players[connections] = socket;
    
    socket.on('disconnect', function () {
        connections--;
    });

    if (connections == 2) {
        players[connections - 1].emit('Start Game');
    }     

    socket.on('Transfer ball', function (ball) {
       console.log(ball);
       socket.broadcast.emit('Ball', ball);
    });
});

