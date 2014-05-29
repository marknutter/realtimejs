


angular.module('nodular', [])

.service('websocket', function() {

	this.ws = new WebSocket("ws://localhost:8080");

})

.controller('main', function($scope, websocket) {

	websocket.ws.onmessage = function(event) {
		alert(event.data);
	}

})