var _ = require('underscore');
var io = require('socket.io')
module.exports = function(http) {
    var io = require('socket.io')(http);

    var devices = {};
    var Device = require('./models/device');
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
                control.emit('device-register-cmd', {did: did, cmd: cmd.cmd});
                devices[did].cmds.push(cmd.cmd);
            }
        });

        socket.on('disconnect', function() {
            delete devices[did];
            control.emit('device-disconnected', {did: did, cmds: []});
        });


        socket.on('device-updateVariable', function(data) {
            var updateObj = {handle: data.handle, value: data.value, timestamp : Date.now() }
            Device.findOneAndUpdate(
                    {did:did},
                    {$push: {"varUpdates": updateObj}},
                    {safe: true, upsert: true, new : true},
                    function(err, model) {
                        console.log(err);
                    }
            );
            console.log("var updated", updateObj)

            control.emit('control-updateVariable', updateObj)
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

            if (devices[data.did]) {
                devices[data.did].emit('cmd', {cmd:data.cmd});
            } else { // If no specific device specified then send to all devices
                device.emit('cmd', {cmd: data.cmd});
            }
        });

        socket.on('control-chat-msg', function (msg) {
            // msg.from, msg.msg
            control.emit('control-chat-msg', msg);
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