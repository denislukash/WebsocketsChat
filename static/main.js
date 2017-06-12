"use strict";

$(document).ready(function () {
    let username;
    let roomBefore;
    let socket = io();

    $('[id^=room-]').on('click', function (e) {
        let room = $(this)[0].id;

        $('.panel-heading').find('span').text(`${room}`);

        if (username !== 'undefined') {
            socket.emit('leave', roomBefore);
            $('.message-bubble').remove();
        }
        username = socket.id;
        roomBefore = room;

        // let socket = io.connect();

        socket.emit('room', room);

        socket.on('chat message', function (msg) {
            $('#message').append(`<div class="row message-bubble"><p class="text-muted">${socket.id}</p><span>${msg}</span></div>`);
        });

        $('#enter-message').submit(function (e) {
            let data = {};
            data.msg = $(this)[0].elements.message.value;
            data.room = room;

            socket.emit('chat message', data);
            $(this)[0].elements.message.value = '';
            return false;
        });

        e.stopPropagation();
    });
});
