var port         =  3333;
var connections  =  0;
var players      =  [];
var max_players  =  2;

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

io.sockets.on ('connection', function (socket) {
    connections++

    if (connections > max_players) {
        socket.emit('Game Full'); 
    }
    else { 
        socket.emit('Server ready');
        players.push(socket);
    }
   
    socket.on('disconnect', function () {
        connections--;
        
        var index = players.indexOf(this);
        players.splice(index, 1);
        
        if (connections == (max_players - 1)) {
            socket.broadcast.emit('Game Over');
        }
    });
    
    if (connections == 2) {
        players[0].emit('Start Game');
    }     

    socket.on('Transfer ball', function (ball) {
       socket.broadcast.emit('Ball', ball);
    });
});

