let app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    express = require("express"),
    secret_key = 'ababagalamaga';

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/static'));

http.listen(3000, function() {
    console.log('listening on *:3000');
});

let usersData = {};

io.on('connection', function(socket) {
    let userName = socket.id.substr(1, 4);
    usersData[userName] = socket.id;

    socket
        /*
        This callback join user to chat and send info message
        @param {string} name of room
        * */
        .on('join_room', function(room) {
            socket.join(room);
            io.in(room).emit('server_message', `User ${userName} joined in ${room}`);
        })
        /*
         This callback send message to all user in chat
         @param {object} info about user, room and text message
         * */
        .on('chat_message', function(data) {
            io.in(data.room).emit('chat_message', data);
        })
        /*
         This callback disconnect user from room, and send info message
         @param {string} name of room
         * */
        .on('leave_room', function (room) {
            socket.leave(room);
            io.in(room).emit('server_message', `User ${userName} leave ${room}`);
        })
        /*
         This callback send private message to destination user and sender
         @param {object} info about sender, recipient and text message
         * */
        .on('private_message', function (data) {
            io.to(usersData[data.toUser]).emit('chat_message', data);
            io.to(usersData[data.userName]).emit('chat_message', data);
        })
        /*
         This callback send message to all users when php script is run
         @param {object} message and secret key
         * */
        .on('message_from_php', function (data) {
            if (data.key === secret_key) {
                for (let user in usersData) {
                    socket.broadcast.to(usersData[user]).emit('server_message', data.msg);
                }
            }
        });
});