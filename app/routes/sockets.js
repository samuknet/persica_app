var _ = require('underscore');

module.exports = function(app, io) {
	var devices = {};

	var control = io.of('/control');
	var device = io.of('/device');

	device.on('connection', function (socket) {
		var did = socket.handshake.query.did;
		devices[did] = socket;
		control.emit('device-connected', {did: did, status: 'green'});
		
		socket.emit('hello', {data: 'here is the data'});

		socket.on('disconnect', function() {
			delete devices[did];
			control.emit('device-disconnected', {did: did});
		});
	});

	control.on('connection', function (socket) {
		socket.on('cmd', function (data) {
			device.emit('cmd', {cmd: data.cmd});
		});

		_.forEach(devices, function (socket, did) {
			// control.emit('device-connected', {did: did, status: 'green'});
		});

	});
}