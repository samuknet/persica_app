var io = require('socket.io-client');
var options = {
    transports: ['websocket'],
    'force new connection': true
};
var c = io.connect('ws://129.31.236.67:5000', options);
c.on('connect', function() {
	console.log('Connected');
});

