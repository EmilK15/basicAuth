'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var config = require('./app/config/config');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./app/routes');
var server = require('http').Server(app);

app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));

app.use('/', routes);

server.listen(port);