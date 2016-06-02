var _ = require('underscore');
var io = require('socket.io')
module.exports = function(http) {
    var io = require('socket.io')(http);

    var devices = {};
    var Device = require('./models/device');
    var User = require('./models/user');
    var Notification = require('./models/Notification');
    var control = io.of('/control');
    var device = io.of('/device');

    device.on('connection', function (socket) {
        var did = socket.handshake.query.did;
        devices[did] = {socket: socket, device: {did: did, cmds : []}};
        devices[did].device.cmds = [];
        devices[did].device.liveVars = {};
        devices[did].device.establishTime = Date.now();

        control.emit('device-connected', devices[did].device);
        

        socket.on('device-register-cmd', function (cmd) {
            // cmd.cmd
            // check if command already registered

            if (!_.contains(devices[did].device.cmds, cmd.cmd)) {
                control.emit('device-register-cmd', {did: did, cmd: cmd.cmd});
                devices[did].device.cmds.push(cmd.cmd);
            }
        });

        socket.on('disconnect', function() {
            var lastOnline = Date.now();
            delete devices[did];
            Device.findOneAndUpdate(
                    {did:did},
                    {"lastOnline": lastOnline},
                    function(err, model) {
                        if (err) {
                            console.error(err);
                        }
                    }
            );

            control.emit('device-disconnected', {did: did, cmds: [], lastOnline: lastOnline});
        });


        socket.on('device-updateVariable', function(data) {

            var updateObj = {did:did, handle: data.handle, value: data.value, timestamp : Date.now() }
            Device.findOneAndUpdate(
                    {did:did},
                    {$push: {"varUpdates": updateObj}},
                    {safe: true, upsert: true, new : true},
                    function(err, model) {

                        console.log(err);
                    }
            );

            devices[did].device.liveVars[data.handle] = updateObj;
            control.emit('device-updateVariable', updateObj)
        });

        socket.on('device-log', function (data) {
            // data has a log property and critical property which is a number
             var logObj = {did: did, critical: data.critical, log: data.log, timestamp: Date.now()};

             Device.findOneAndUpdate(
                    {did:did},
                    {$push: {"logs": logObj}},
                    {safe: true, upsert: true, new : true},
                    function(err, model) {
                        if (err) {console.log(err); }
                    }
            );
             if (data.critical == 5) { // The case that we send must send a notification
                var bulk = User.initializeOrderedBulkOp();
                bulk.find({}).update({}, function (err, model) {
                    var notification = {type: 'criticalLog', did: did, message: data.log, username: model.username};
                    new Notification(notification).save(function (err, model) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    console.log('Added notification for user', model.username);
                    
                });
                control.emit('notification-new', {type: 'criticalLog', did: did, message: data.log});
             }
            control.emit('device-log', logObj);

        })
    });

    control.on('connection', function (socket) {
        socket.on('cmd', function (data) {
            /*
                data of form:
                {
                    cmd: '...',
                }
            */
            device.emit('cmd', {cmd: data.cmd});
            if (data.did) {
                // devices[data.did].socket.emit('cmd', {cmd:data.cmd});
            } else { // If no specific device specified then send to all devices

            }
        });

        socket.on('control-chat-msg', function (msg) {
            // msg.from, msg.msg
            control.emit('control-chat-msg', msg);
        });


        
        _.forEach(devices, function (obj, did) {
            console.log('emitting device connected event', devices[did].device);
            control.emit('device-connected', devices[did].device);
        });
    });

    return {
        newDevice: function (device) {
            control.emit('device-new', device);
        }
    };
}