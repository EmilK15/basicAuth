'use strict';

var config = require('../config/config');
var bluebird = require('bluebird');
var Mongoose = bluebird.promisifyAll(require('mongoose'));
Mongoose.Promise = require('bluebird');

Mongoose.createConnectionAsync(config.database)
	.catch(function(err){
		console.log(err);
});

process.on('SIGINT', function() {
	Mongoose.connection.close(function() {
		process.exit(0);
	});
});

module.exports = {
	Mongoose,
	models: {
		user: require('./user'),
		admin: require('./admin')
	}
};