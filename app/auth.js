'use strict'

var localStrategy = require('passport-local').Strategy;

module.exports = function(passport, User, Admin) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		Admin.findById(id, function(err, admin) {
			if(err || !admin) {
				User.findById(id, function(err, user) {
					done(err, user);
				});
			} else
				done(err, admin);
		}); 
	});

	passport.use('login', new localStrategy({
	passReqToCallback: true},
	function(req, username, password, done) {
		User.findOne({ username }, function(err, user) {
			if(err || !user) {
				Admin.findOne({ username }, function(err, admin) {
					if(err || !admin)
						return done(null, false, req.flash('message', 'admin not found'));
					else {
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
											console.log('Update error for lockout values ' + err.message);
										else
											return done(null, admin);
									});	
								}								
							} else {
								if(admin.lockUntil)
									return done(null, false, req.flash('message', 'You have been locked out, please try again soon'));
								admin.incLoginAttempts(function(err) {
									if(err)
										return done(err);
								});
								if(admin.lockUntil)//if its locked notify the user once it is
									return done(null, false, req.flash('message', 'You have been locked for 1 hour'));
								return done(null, false, req.flash('message', 'Invalid credentials'));	
							}
						});
					}
				})
			} else {
				user.comparePassword(password, function(err, isMatch) {
					if(err)
						return done(null, false, req.flash('message', 'Invalid credentials'));
					if(isMatch) {
						if(!user.lockUntil) {
							var updates = {
								$set : { loginAttempts: 0},
								$unset: { lockUntil: 1}
							};
							user.update(updates, function(err, status) {
								if(err)
									console.log('Update error for lockout values ' + err.message);
								else
									return done(null, user);
							});
						}
					} else {
						if(user.lockUntil)
							return done(null, false, req.flash('message', 'You have been locked out, please try again soon'));
						user.incLoginAttempts(function(err) {
							if(err)
								return done(err);
						});
						if(user.lockUntil)
							return done(null, false, req.flash('message', 'You have been locked for 1 hour'));
						return done(null, false, req.flash('message', 'Invalid credentials'));
					}
				});
			}
		});
	}));

	passport.use('registerUser', new localStrategy({
		passReqToCallback: true},
		function(req, username, password, done) {
			if(!username || !password || !req.body.email){
				return done(null, false, req.flash('message', 'not all values passed in'));
			} else {
				Admin.findOne({ username, email: req.body.email }, function(err, admin) {
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
						return done(null, false, req.flash('message', 'Email or Username in use already'));
					}
				});
			}
		}));

	passport.use('registerAdmin', new localStrategy({
		passwordField: 'passwordA',
		passReqToCallback: true},
		function(req, username, password, done) {
			if(!username || !password || !req.body.email) {
				return done(null, false, req.flash('message', 'not all values passed in'));
			} else {
				User.findOne({ email: req.body.email, username }, function(err, user){
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
		}));
}