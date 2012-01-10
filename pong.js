var playGround = {
  width: $(window).width(), 
  height: $(window).height()
};

var ball = {
  x: 250, 
  y: 250, 
  radius: 10,
  color: 'red'
};

var rect = {
  x: 10,  
  y: 10,  
  width: 10, 
  height: 100
};

var dx = 1; //Math.floor(Math.random() * 5);
var dy = 1; //Math.floor(Math.random() * 5);

var paper;
var circle;
var rectangle;
var id;

var socket = io.connect ('http://localhost');

function moveBall() {
    circle.cx = ball.x;
    circle.cy = ball.y;

    ball.x = circle.cx + dx;
    ball.y = circle.cy + dy;
		
    circle.animate({cx: ball.x, cy: ball.y});
  
    if (ball.x + ball.radius >= playGround.width) {
        circle.remove();
        clearInterval(id);
        socket.emit ('Transfer ball', ball);
    }
  
	if (ball.x - ball.radius < 0) {
	    dx = -dx;
	}
  
    //up and down bordersi detection
	if ((ball.y + ball.radius >= playGround.height) || 
        (ball.y - ball.radius) < 0) {
	    dy = -dy;
	}
  
    //collison detection
    if ((ball.x - ball.radius <= rect.x + rect.width) && 
        (ball.y + ball.radius > rect.y) && 
        (ball.y + ball.radius < rect.y + rect.height)) {
        dx = -dx;
    }
}

function initPlayer () {
    rectangle = paper.rect(rect.x, rect.y, rect.width, rect.height); 
    rectangle.attr ('fill', "black");
  
    var dragRectStart = function () {
        rect.y = this.y = this.attr("y");
    }

    var dragRect = function (dx, dy) {
        if (this.y + dy + rect.height >= playGround.height) {
            this.attr ({y: (playGround.height - rect.height)});
        }
        else if (this.y + dy < 0) {
            this.attr ({y: 0});
        }
        else {
            this.attr ({y: this.y + dy});
        }
    
        rect.y = this.attr("y");
    }
  
    var dragRectEnd = function () {
        rect.y = this.attr("y");
    }     
  
    rectangle.drag(dragRect, dragRectStart, dragRectEnd);
}

function startGame () {
    circle = paper.circle(ball.x, ball.y, ball.radius);
    circle.attr ('fill', ball.color);
    
    id = setInterval('moveBall()', 2);
}

socket.on ('Server ready', function () {
    paper = new Raphael('container', playGround.width, playGround.height);
    initPlayer(); 
});

socket.on('Start Game', function () {
    startGame();
});
 
socket.on ('Ball', function (s) {
    ball.x = s.x;
    ball.y = s.y;
  
    dx = -dx; 
    dy = -dy;
  
    startGame();
});

socket.on('Game Over', function () {
    clearInterval(id);
    alert('The oponent has left. Game Over!');
    circle.remove()
});

socket.on('Game Full', function () {
   alert('The game is full! Try again later.');
});

function adjustPlayGroundSize() {
    playGround.width  = $(window).width();
    playGround.height  = $(window).height();
}

$(window).resize(function() {
    adjustPlayGroundSize();
});

