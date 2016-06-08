var _ = require('underscore');
var io = require('socket.io')
module.exports = function(http) {
    var io = require('socket.io')(http);

    var devices = {};
    var Device = require('./models/device');
    var User = require('./models/user');
    var Notification = require('./models/notification');
    // var notificationSender = require('./notificationSender');
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
             var criticalLevel = data.critical;
             var logObj = {did: did, critical: criticalLevel, log: data.log, timestamp: Date.now()};

             Device.findOneAndUpdate(
                    {did:did},
                    {$push: {"logs": logObj}},
                    {safe: true, upsert: true, new : true},
                    function(err, model) {
                        if (err) {console.log(err); }
                    }
            );
                    
            User.find({}, function (err, users) {
                _.forEach(users, function (user) {
                    if (user.notifyConfig[criticalLevel]) {
                        switch(user.notifyConfig[criticalLevel].kind) {
                            case 'popup':
                                console.log("popup case: " + user.notifyConfig[criticalLevel].dst);
                                // notificationSender.sendPopup(user.notifyConfig[criticalLevel].dst, logObj);
                                break;

                            case 'email':
                                notificationSender.sendEmail(user.notifyConfig[criticalLevel].dst, logObj);
                                break;

                            case 'sms':
                                notificationSender.sendSMS(user.notifyConfig[criticalLevel].dst, logObj);
                                break;

                            default:

                        }
                    }
                })                  
            });
            control.emit('device-log', logObj);

        })
    });

//POPUP CASE
// var notification = {type: 'criticalLog', did: did, message: data.log, username: user.username};
//                     new Notification(notification).save(function (err, model) {
//                         if (err) {
//                             console.log(err);
//                         }
//                         console.log('Added notification for user', user.username);
//                         control.emit('notification-new', model);
//                     });

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


        console.log('control connected');
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
