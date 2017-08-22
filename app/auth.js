'use strict'

var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Admin = mongoose.model('Admin');


module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(user, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.serialzeAdmin(function(admin, done) {
		done(null, admin.id);
	});

	passport.deserializeAdmin(function(admin, done) {
		Admin.findById(id, function(err, admin) {
			done(err, admin);
		});
	});

	passport.use('loginUser', new localStrategy({
		passReqToCallback: true},
		function(req, username, password, done) {
			User.findOne({ username }, function userFound(err, user) {
				if(err || !user)
					return done(null, false, req.flash('message', 'User not found'));
				user.comparePassword(password, function(err, isMatch) {
					if(err)
						return done(null, false, req.flash('message', 'Invalid credentials'));
					if(isMatch) {
						if(!user.lockUntil) {
							var updates = {
								$set : { loginAttempts: 0 },
								$unset: { lockUntil: 1 }
							};
							user.update(updates, function(err, status){
								if(err)
									console.log('Update error for timeout values ' + err.message);
								else
									return done(null, user);
							});
						}
					} else {
						if(user.lockUntil)
							return done(null, false, req.flash('message', 'You are locked out, try again soon'));
						else {
							user.incLoginAttempts(function(err) {
								if(err)
									return done(err);
							});
							if(user.lockUntil)//if its locked notify the user once it is
								return done(null, false, req.flash('message', 'You have been locked for 1 hour'));
							return done(null, false, req.flash('message', 'Invalid credentials'));							
						}
					}//end of no match but incremented/locked out
				});
			});
		}
	}));//end of loginUser endpoint

	passport.use('loginAdmin', new localStrategy({
		passReqToCallback: true},
		function(req, username, password, done) {
			Admin.findOne({ username }, function userFound(err, admin) {
				if(err || !admin)
					return done(null, false, req.flash('message', 'Admin user not found'));
				admin.comparePassword(password, function(err, isMatch) {
					if(err)
						return done(null, false, req.flash('message', 'Invalid credentials'));
					if(isMatch) {
						if(!admin.lockUntil) {
							var updates = {
								$set : { loginAttempts: 0 },
								$unset: { lockUntil: 1 }
							};
							admin.update(updates, function(err, status){
								if(err)
									console.log('Update error for timeout values ' + err.message);
								else
									return done(null, admin);
							});
						}
					} else {
						if(admin.lockUntil)
							return done(null, false, req.flash('message', 'You are locked out, try again soon'));
						else {
							admin.incLoginAttempts(function(err) {
								if(err)
									return done(err);
							});
							if(admin.lockUntil)//if its locked notify the user admin once it is
								return done(null, false, req.flash('message', 'You have been locked for 1 hour'));
							return done(null, false, req.flash('message', 'Invalid credentials'));							
						}
					}//end of no match but incremented/locked out
				});
			});
		}
	}));//end of loginAdmin endpoint

	passport.use('registerUser', new localStrategy({
		passReqToCallback: true},
		function(req, username, password, done) {
			if(!username || !password || !req.body.email){
				return done(null, false, req.flash('message', 'not all values passed in'));
			} else {
				Admin.findOne({ email: req.body.email }, function(err, admin){
					if(!admin) {
						var newUser = new User({
							username,
							password,
							email: req.body.email
						});
						newUser.save(function(err) {
						if(err)
							return done(null, false, req.flash('message', 'Username or Email already exists'));
						else
							return done(null, newUser);
						});
					} else {
						return done(null, false, req.flash('message', 'Email in use already'));
					}
				});
			}
		}
	}));

	passport.use('registerAdmin', new localStrategy({
		passReqToCallback: true},
		function(req, username, password, done) {
			if(!username || !password || !req.body.email) {
				return done(null, false, req.flash('message', 'not all values passed in'));
			} else {
				User.findOne({ email: req.body.email }, function(err, user){
					if(!user) {
						var newAdmin = new Admin({
							username,
							password,
							email: req.body.email
						});
						newAdmin.save(function(err){
							if(err)
								return done(null, false, req.flash('message', 'Username or Email already exists'));
							else
								return done(null, newAdmin);
						});
					} else {
						return done(null, false, req.flash('message', 'Email already in use'));
					}
				});
			}
		}
	}));
}