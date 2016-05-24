// Module for API Routes (serving JSON)


module.exports = function(router) {

    var mongoose = require('mongoose'),
        Device = require('../models/device'),
        User = require('../models/user'),
        passport = require('passport'),

        jwt = require('express-jwt'),
        auth = jwt({secret: 'SECRET', userProperty: 'payload'});

    router.post('/device', function (req, res) {
        var did = req.body.did,
            alias = req.body.alias,
            description = req.body.description;
        new Device({did: did, alias: alias, description: description}).save();

        res.send('Done');
    });

    router.get('/device', function (req, res) {
        Device.find(function(err, models) {
            res.send(models);
        });
    });

    router.post('/register', function(req, res, next) {
        console.log(req.body.username)
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