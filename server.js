// Dependencies
var express = require('express');


var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

// Configs
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

var ioService = require('./app/sockets')(app, io);

// Api endpoints 
require('./app/routes/api')(app);

// Express Routes

require('./app/routes/routes')(http, ioService);
require('./app/routes/sockets')(app, io);

// Start the app with listen and a port number
http.listen(3000, function() {
	console.log('Listening on port 3000');
});