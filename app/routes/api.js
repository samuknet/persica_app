// Module for API Routes (serving JSON)


module.exports = function(router, ioService) {

    var mongoose = require('mongoose'),
        Device = require('../models/device'),
        Group = require('../models/group'),
        User = require('../models/user'),
        Notification = require('../models/notification'),
        passport = require('passport'),
        jwt = require('express-jwt'),
        decode = require('jsonwebtoken').decode,
        auth = jwt({secret: 'SECRET', userProperty: 'payload'}),
        _ = require('underscore');


    router.get('/group', function (req, res) {
        Group.find({}, function (err, groups) {
            if (err) {
                res.status(406).json({message: 'Could not get groups'});
            } else {
                res.send(groups);
            }
        });
    });

    router.get('/group/:gid', function (req, res) {
        var gid = req.params.gid;
            
        if (!gid) {
            res.status(406).json({message: 'Group id not specified'})
        }

        Group.findOne({gid: gid}, function(err, group) {
            if (err) {
                res.status(406).json({message: 'Error occured while getting group width id ' + gid + '.'});
            } else {
                res.send(group);
            }
        });
    });

    router.post('/group', function (req, res) {
        var name = req.body.name,
            description = req.body.description;

        var group = {name: name, description: description};
        new Group(group).save(function (err, groupDocument) {
            if (err) {
                res.status(406).json({message: err.message});
            } else {
                ioService.newGroup(groupDocument);
                res.status(201).json(groupDocument);
            }
        });
    });

    router.put('/group/:gid/add/:did', function(req, res) {
        var gid = req.params.gid,
            did = req.params.did;

        Group.findOneAndUpdate(
            {gid: gid},
            {$push: {dids: did}},
            {safe: true, upsert: true},
            function(err, group) {
                if (err) {
                    res.status(406).json({message: err.message});
                } else {
                    res.send(group);
                    ioService.deviceAddedToGroup(group);
                }
            }
        );
    });


    router.get('/device', function (req, res) {
        var did = req.query.did,
            searchObj = did ? {did: did} : {};
        Device.find(searchObj, function(err, devices) {
            if (err) {
                res.status(406).json({message: 'Error occured while getting devices.'});
            } else {
                var connectedDevices = ioService.getDevices();
                _.forEach(connectedDevices, function(connectedDevice, did) {
                    _.forEach(devices, function(device, i) {

                        if (device.did == connectedDevice.device.did) {
                            devices[i] = connectedDevice.device;
                            
                        }
                    })
                });

                res.send(devices);
            }
        });
    });

    router.post('/device', function (req, res) {
        var did = req.body.did,
            alias = req.body.alias,
            description = req.body.description,
            gid = req.body.gid;
        var device = {did: did, alias: alias, description: description, gid: gid};
        new Device(device).save(function(err, product) {
            if (err) {
                res.status(406).json({message: err.message});
            } else {
                ioService.newDevice(device);
                res.status(201).json({message: 'Device added.'});                
            }
        }); 
    });

    router.get('/user', function (req, res) {
        var token = req.headers.authorization.split(' ')[1];
        var username = decode(token).username

       User.findOne({username: username}, function (err, user) {
            if (err) {
                res.status(406).json({message: err.message});
            } else {
                res.status(200).json(user);
            }
       }); 
    });

    router.put('/user/:username', function(req, res) {
        var updateUser = req.body;
        var data = {notifyConfig: updateUser.notifyConfig};
        var query = {username: req.params.username};

        User.update(query, data, {}, function(err, oldUser) {
            if (err) {
                res.status(406).json({message: err.message});
            } else {
                res.status(201).json({message: "User updated."});
            }
        });
    });

    router.get('/notification/:username', function (req, res) {
        var username = req.params.username;
        Notification.find({username: username}, function (err, nots) {
            if (err) {
                return res.status(501).json({message: 'An error occured fetching notifications for ' + username});
            }

            res.json(nots);
        });      
    });

    router.delete('/notification/:id', function (req, res) {
        var id = req.params.id;
        Notification.find({_id: id}).remove().exec(function(err, numRemoved) {
            if (err) {
                return res.status(501).json({message: 'Error occured deleting'});
            }

            if (numRemoved === 0) {
                return res.status(406).json({message: 'Notifcation specified could not be deleted'});
            } else {
                return res.status(200).json({message: 'Notification deleted successfully'});
            }
        });
    });

    router.get('/device/variable', function (req, res) {
        var did = req.query.did,
            varName = req.query.varName;
            searchObj = did ? {did: did} : {};
        Device.findOne(searchObj, function(err, device) {
            if (err) {
                res.send({message: 'Error occured while getting devices.'});
            } else {
               
                var filteredVariables = _.filter(device.varUpdates, function (varUpdate) {
                    return varName === varUpdate.handle;
                });

                res.send(filteredVariables);
            }
        });
    });

    router.post('/register', function(req, res, next) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                message: 'Please fill out all fields'
            });
        }

        var user = new User();

        user.username = req.body.username;

        user.setPassword(req.body.password)

        user.save(function(err, user) {
            if (err) {
                if (err.code === 11000) {
                    return res.status(406).json({message:'Username already in use.'});
                }
                return next(err)
            }
            return res.json({
                username: user.username,
                token: user.generateJWT(),
                notifyConfig: user.notifyConfig
            })
        });
    });

    router.post('/login', function(req, res, next) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                message: 'Please fill out all fields'
            });
        }

        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }

            if (user) {
                return res.json({
                    username: req.body.username,
                    token: user.generateJWT(),
                    notifyConfig: user.notifyConfig
                });
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });
}
