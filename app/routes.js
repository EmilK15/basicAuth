'use strict';

var express = require('express');
var apiRoutes = express.Router();
var app = express();

var controller = require('./controllers/');
var db = require('./models/database').models;

app.use('/api', apiRoutes);

var passport = require('passport');
//changed to db.model for createConnection from mongoose
var auth = require('./auth')(passport, db.user, db.admin);

app.all('/*', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-type, Accept, X-Access-Token, X-Key');
	next();
});

var ensureAuthorized = function(req, res, next) {
	if(req.isAuthenticated())
		return next();
	else
		res.redirect('/');
}

var pwPassportA = function(req, res, next) {
	if(!req.body.password)
		req.body.password = req.body.passwordA;
	return next();
}

app.get('/', function(req, res) {
	if(req.user)
		if(req.user.isAdmin)
			res.redirect('/api/admin');
		else
			res.redirect('/api/user');
	else
		res.render('index', { message: req.flash('message')[0] });
});

apiRoutes.post('/registerUser', passport.authenticate('registerUser', {
	successRedirect: '/api/user',
	failureRedirect: '/',
	failureFlash: true
}));

apiRoutes.post('/loginUser', passport.authenticate('loginUser', {
	successRedirect: '/api/user',
	failureRedirect: '/',
	failureFlash: true
}));

apiRoutes.post('/registerAdmin', pwPassportA, passport.authenticate('registerAdmin', {
	successRedirect: '/api/admin',
	failureRedirect: '/',
	failureFlash: true
}));

apiRoutes.post('/loginAdmin', passport.authenticate('loginAdmin', {
	successRedirect: '/api/admin',
	failureRedirect: '/',
	failureFlash: true
}));

apiRoutes.route('/user/:username')
	.get(controller.userController.read_user)
	.post(controller.userController.create_user)
	.put(controller.userController.update_user)
	.delete(controller.userController.delete_user);

apiRoutes.route('/users')
	.get(controller.userController.list_all_users);

apiRoutes.get('/user', ensureAuthorized, function(req, res) {
	res.render('user', { username: req.user.username });
});

apiRoutes.route('/admin/:username')
	.get(controller.adminController.read_admin)
	.post(controller.adminController.create_admin)
	.put(controller.adminController.update_admin)
	.delete(controller.adminController.delete_admin);

apiRoutes.get('/admin', ensureAuthorized, function(req, res) {
	res.render('admin.ejs', { username: req.user.username });
});

apiRoutes.get('/logout', ensureAuthorized, function(req, res) {
	req.logout();
	req.session.destroy();
	res.redirect('/', { LogoutMessage: 'You have successfully logged out.'});
});

app.use(function(req, res) {
	res.status(404).send({ url: req.originalUrl + ' not found ' });
});

module.exports = app;