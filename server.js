let app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    express = require("express");

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/static'));

http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket){
    let name = socket.id;
    console.log('Connect id ' + name);

    socket.on('room', function(room){
        console.log('enter at room ' + room);
        socket.join(room);
        io.in(room).emit('chat message', `User ${name} joined in ${room}`);
    });

    socket.on('chat message', function(data){
        console.log("message " + data.room + " " + data.msg);
        io.in(data.room).emit('chat message', data.msg);
    });

    socket.on('leave', function (room) {
        socket.leave(room);
    })

});