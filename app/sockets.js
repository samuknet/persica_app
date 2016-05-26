var _ = require('underscore');
var io = require('socket.io')
module.exports = function(http) {
    var io = require('socket.io')(http);

    var devices = {};

    var control = io.of('/control');
    var device = io.of('/device');

    device.on('connection', function (socket) {
        var did = socket.handshake.query.did;
        devices[did] = socket;
        control.emit('device-connected', {did: did, status: 'green'});

        socket.on('disconnect', function() {
            delete devices[did];
            control.emit('device-disconnected', {did: did});
        });
    });

    control.on('connection', function (socket) {
        socket.on('cmd', function (data) {
            /*
                data of form:
                {
                    cmd: '...',
                }
            */

            // TODO: Implement groups here
            device.emit('cmd', {cmd: data.cmd});
        });
        

        _.forEach(devices, function (socket, did) {
            control.emit('device-connected', {did: did, status: 'green'});
        });

    });

    return {
        newDevice: function (device) {
            control.emit('device-new', device);
        }
    };
}