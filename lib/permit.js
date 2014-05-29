var Q = require('q'),
connections = require('./connections'),
MongoClient = require('mongodb').MongoClient;


module.exports.isAllowed = function(message) {
	var deferred = Q.defer();
	MongoClient.connect('mongodb://127.0.0.1:27017/' + message.app, function(err, db) {
		deferred.resolve(true);
	});
	return deferred.promise;
};


module.exports.getRecipients = function(message) {
	var deferred = Q.defer();
	MongoClient.connect('mongodb://127.0.0.1:27017/' + message.app, function(err, db) {
		deferred.resolve(connections.all());
	});
	return deferred.promise;
}