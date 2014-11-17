//Autor: Andy Alonzo
//Web: http://soyalonzo.com
//E-mail: andres@alonzoyalonzo.com
//Twitter: @alonzoandy

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , os = require('os')
  , five = require("johnny-five"),
  board,servo,led,sensor;

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
}}}
var port = 3000;
app.listen(port);
if(addresses==[])
{
    console.log("Server running at: http://localhost:"+port);
}
else
{
    console.log("Server running at: http://"+addresses+":"+port);
}

board = new five.Board();
var led = [];
board.on("ready", function() {
    console.log("Board On");
    for (i = 0; i <=13; i++) {
        led[i] = new five.Led(i);
    }
    
});


function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}



io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
    
  socket.on('ledon', function (data) {
    console.log("ON  =>    Led L" + data.led);
     if(board.isReady){    led[data.led].on(); } 
  });

    socket.on('ledoff', function (data) {
    console.log("OFF  =>    Led :" + data.led);
     if(board.isReady){    led[data.led].off(); } 
  });

    socket.on('ledstrobe', function (data) {
    console.log("Strobe   =>    Led: " + data.led+" Delay: "+data.ledDelay);
     if(board.isReady){    led[data.led].strobe(data.ledDelay); } 
  });
    socket.on('ledstop', function (data) {
    console.log("Stop   =>    Led : " + data.led);
     if(board.isReady){    led[data.led].stop(); } 
  });
});

