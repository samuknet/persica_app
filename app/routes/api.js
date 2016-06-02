// Module for API Routes (serving JSON)


module.exports = function(router, ioService) {

    var mongoose = require('mongoose'),
        Device = require('../models/device'),
        User = require('../models/user'),
        Notification = require('../models/Notification'),
        passport = require('passport'),
        jwt = require('express-jwt'),
        auth = jwt({secret: 'SECRET', userProperty: 'payload'}),
        _ = require('underscore');


    router.post('/device', function (req, res) {
        var did = req.body.did,
            alias = req.body.alias,
            description = req.body.description;
        var device = {did: did, alias: alias, description: description};
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
        User.find(function(err, models) {
            if (err) {
                res.send({message: 'Error while getting users'});
            } else {
                res.send(models);
            }
        });
    });

    router.get('/device', function (req, res) {
        var did = req.query.did,
            searchObj = did ? {did: did} : {};
        Device.find(searchObj, function(err, devices) {
            if (err) {
                res.send({message: 'Error occured while getting devices.'});
            } else {
                _.forEach(devices, function (device) {
                    device.cmds = [];
                });
                res.send(devices);
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

        user.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    return res.status(406).json({message:'Username already in use.'});
                }
                return next(err)
            }

            return res.json({
                username: user.username,
                token: user.generateJWT()
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
                    token: user.generateJWT()
                });
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });
}