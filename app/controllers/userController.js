'use strict'

var User = require('../models/database').models.user;

	exports.list_all_users = function(req, res) {
		User.find({}, function(err, users) {
			if(err)
				res.json({
					message: 'could not list users',
					err: err
				});
			else
				res.json(users);
		});
	};

	exports.create_user = function(req, res) {
		var newUser = new User(req.body);

		newUser.save(function(err, user) {
			if(err)
				res.json({
					message: 'could not find user',
					err: err
				});
			else
				res.json(user);
		});
	};

	exports.read_user = function(req, res) {
		User.findOne({ username: req.params.userId }, function(err, user) {
			if(err)
				res.json({
					message: 'could not find user',
					err: err
				});
			else
				res.json(user);
		});
	};

	exports.update_user = function(req, res) {
		User.findOneAndUpdate({username: req.params.userId},
			req.body, { new: true }, function(err, user) {
				if(err)
					res.json({
						message: 'could not update',
						err: err
					});
				else
					res.json(user);
			});
	};

	exports.delete_user = function(req, res) {
		User.remove({username: req.params.userId }, function(err, user) {
			if(err)
				res.json({
					message: 'could not delete user',
					err: err
				});
			else
				res.json({message: 'user deleted' });
		});
	};