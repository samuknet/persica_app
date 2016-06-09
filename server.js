// Dependencies
var express = require('express');
 
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('express-jwt');

// Configs
var config = require('./config/secret');
var db = require('./config/db');

// Connect to the DB
mongoose.connect(db.url);

// Auth logic
var passport = require('passport');
require('./app/models/user');
require('./config/passport');

// Initialize the Express App
var app = express();
var http = require('http').Server(app);

// Configure 

// To expose public assets to the world
app.use(express.static(__dirname + '/web/public'));

// Throw in passport middleware
app.use(passport.initialize());

// log every request to the console
app.use(morgan('dev'));

// For parsing HTTP responses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var ioService = require('./app/sockets')(http);

// Authenticating routes
app.use(jwt({ secret: config.super_secret}).unless({path: config.unprotected}));

// Api endpoints 
require('./app/routes/api')(app, ioService);

// Express Routes

require('./app/routes/routes')(app);

// Start the app with listen and a port number
http.listen(3000, function() {
	console.log('Listening on port 3000');
});
