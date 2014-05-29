var Q = require('q'),
MongoClient = require('mongodb').MongoClient,
permit = require('./permit'),
_ = require('underscore');


function exec(message, ws) {
	var deferred = Q.defer();
	MongoClient.connect('mongodb://127.0.0.1:27017/' + message.app, function(err, db) {

		switch(message.action) {
			case "addToCollection":
				addToCollection(db, message, ws, deferred);
				break;
			case "query":
				query(db, message, ws, deferred);
				break;
		}

	});
	return deferred.promise;
};


function addToCollection(db, message, ws, deferred) {
	console.log("addToCollection::message::", message, "::message.location::", message.location);
	db.collection(message.location).insert(message, function(err, docs) {
		permit.getRecipients(message)
		.then(function(recipients) {
			console.log("broadcasting message::", message, "::recipients::", recipients.length);
			broadcast(message, recipients);
			deferred.resolve();
		}, function() {
			deferred.reject();
		})

	});
}


function broadcast(message, recipients) {
	console.log("starting broadcast")
	_.each(recipients, function(recipient) {
		console.log("broadcasting")
		recipient.send(JSON.stringify(message));
	})
}

function query(db, message, ws, deferred) {
	console.log("querying::", message.location)
	db.collection(message.location).find().toArray(function(err, results) {
		_.each(results, function(message) {
			console.log("returning message:: ", message);
			ws.send(JSON.stringify(message));
		});
		deferred.resolve();
	})


}

exports.exec = exec;