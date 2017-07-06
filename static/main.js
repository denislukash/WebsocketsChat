"use strict";

$(document).ready(function() {

    /**
     * @member {string} user name, with displayed in chat
     */
    let username,
        /**
         * @member {string} when user leave room, this variable contain from which room he leave,
         * for send message in this room about user is leave
         */
        roomBefore,
        /**
         * @member {boolean} this flag shows is message are private, using in submit event
         */
        privateMessage = false,
        /**
         * @member {object} socket.io object for connect
         */
        socket = io('http://localhost:3000');

    /**
     * This callback signed on click on names room, for enter in this room
     *
     * @callback eventCallback
     */
    $('.room').on('click', function (e) {
        let room = $(this).attr('data-id');

        $('.panel-heading').find('span').text(`${room}`);

        if (username) {
            socket.emit('leave_room', roomBefore);
            $('.message-bubble').remove();
        }

        username = socket.id.substr(1, 4);
        roomBefore = room;

        socket.emit('join_room', room);
    });

    socket
        /**
        * This callback signed on event message from server, when user join or leave room,
        * append block of html code with message to chat
        * @param {string} text of message
        */
        .on('server_message', function (msg) {
            $('#message').append(`<div class="row message-bubble">` +
                `<p style="color: aqua">Server message</p>` +
                `<span>${msg}</span></div>`);
        })

        /**
        * This callback signed on event of global message in room,
        * append block of html code with message to chat
        * @param {object} text of message
        */
        .on('chat_message', function (data) {
            $('#message').append(`<div class="row message-bubble">` +
                `<p class="text-success" style="cursor: pointer">` +
                `${data.userName}</p><span>${data.msg}</span></div>`);

        /**
         * This callback signed on event click on user name in chat for start type private message
         */
            $('.text-success').on('click', function (e) {
                $('#enter-message').find('input')
                    .val($(this)[0].innerText + ": ");
                privateMessage = true;
            });
        });

    /**
     * This callback signet on event send message, form data and socket event and send
     * it to node js server
     *
     * @callback eventCallback
     */
    $('#enter-message').submit(function (e) {
        let data = {};
        data.msg = $(this)[0].elements.message.value;
        data.room = roomBefore;
        data.userName = username;

        if (privateMessage) {
            data.toUser = $(this)[0].elements.message.value.split(':')[0];
            socket.emit('private_message', data);
            privateMessage = false;
        } else {
            socket.emit('chat_message', data);
        }

        $(this)[0].elements.message.value = '';

        e.preventDefault();
    });
});
