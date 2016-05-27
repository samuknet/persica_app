// Module for API Routes (serving JSON)


module.exports = function(router, ioService) {

    var mongoose = require('mongoose'),
        Device = require('../models/device'),
        User = require('../models/user'),
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


    router.post('/user', function (req, res) {
        var username = req.body.username,
            hash = req.body.hash,
            salt = req.body.salt;

        new User({username: username, hash: hash, salt: salt}).save( function (err, product, numAffected) {
            if (err) {
                switch(err.code) {
                    case 11000:
                        res.status(406).json({message:'Username already in use.'});
                        break;
                    default:
                        res.status(406).json({message:'Unknown error occurred while adding user.'})
                }
            } else {
                res.status(201).json({message: 'User added.'});
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
                    token: user.generateJWT()
                });
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });
}