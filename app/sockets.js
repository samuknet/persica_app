var _ = require('underscore');
var io = require('socket.io')
module.exports = function(http) {
    var io = require('socket.io')(http);

    var devices = {};

    var control = io.of('/control');
    var device = io.of('/device');

    device.on('connection', function (socket) {
        var did = socket.handshake.query.did;
        devices[did] = {socket: socket, device: {did: did, cmds : []}};
        devices[did].cmds = [];
        control.emit('device-connected', devices[did].device);

        socket.on('device-register-cmd', function (cmd) {
            // cmd.cmd

            // check if command already registered
            if (!_.contains(devices[did].cmds, cmd.cmd)) {
                control.emit('device-register-cmd', {did: did, cmd: cmd.cmd, cmds: []});
            }
        });

        socket.on('disconnect', function() {
            delete devices[did];
            control.emit('device-disconnected', {did: did, cmds: []});
        });
    });

    control.on('connection', function (socket) {
        socket.join('control-chat');
        socket.on('cmd', function (data) {
            /*
                data of form:
                {
                    cmd: '...',
                }
            */

            if (devices[data.did]) {
                devices[data.did].emit('cmd', {cmd:data.cmd});
            } else { // If no specific device specified then send to all devices
                device.emit('cmd', {cmd: data.cmd});
            }
        });

        socket.on('control-chat-msg', function (msg) {
            // msg.from, msg.msg
            io.sockets.in('control-chat').emit(msg);
        });


        
        _.forEach(devices, function (socket, did) {
            control.emit('device-connected', devices[did].device);
        });
    });

    return {
        newDevice: function (device) {
            control.emit('device-new', device);
        }
    };
}