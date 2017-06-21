<?php
use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

require 'vendor/autoload.php';

$secretKey = 'ababagalamaga';

$client = new Client(new Version2X('http://localhost:3000'));

$client->initialize();
$client->emit('message_from_php', ['msg' => 'Hello from php', 'key' => $secretKey]);
$client->close();

