'use strict';

var config = require('../config/config');
var bluebird = require('bluebird');
var Mongoose = bluebird.promisifyAll(require('mongoose'));
Mongoose.Promise = require('bluebird');

let database = Mongoose.connectAsync(config.database, {
	 	useMongoClient: true,
	}).catch(function(err){
		console.log(err);
});

process.on('SIGINT', function() {
	Mongoose.connection.close(function() {
		process.exit(0);
	});
});

module.exports = { 
	database,
	models: {
		user : require('./user'),
		admin: require('./admin')
	}
};