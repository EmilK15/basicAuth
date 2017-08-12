'use strict';

var express = require('express');
var apiRoutes = express.Router();
var app = express();
var db = require('./models/database').models;

var controller = require('./controllers/');

app.use('/api', apiRoutes);

app.all('/*', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-type, Accept, X-Access-Token, X-Key');
	next();
});

apiRoutes.route('/user/:userId')
	.get(controller.userController.read_user)
	.post(controller.userController.create_user)
	.put(controller.userController.update_user)
	.delete(controller.userController.delete_user);

apiRoutes.route('/users')
	.get(controller.userController.list_all_users);

apiRoutes.route('/admin/:userId')
	.get(controller.adminController.read_admin)
	.post(controller.adminController.create_admin)
	.put(controller.adminController.update_admin)
	.delete(controller.adminController.delete_admin);

app.use(function(req, res) {
	res.status(404).send({ url: req.originalUrl + ' not found ' });
});

module.exports = app;