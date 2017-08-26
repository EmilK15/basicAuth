'use strict';

var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./app/config/config');
var flash = require('connect-flash');
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var passport = require('passport');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')(expressSession);
var routes = require('./app/routes');
var server = require('http').Server(app);

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(expressSession({
	 store: new mongoStore({ url: config.database }),
	 secret: config.secret,
	 saveUninitialized: false,
	 resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', routes);

server.listen(port);