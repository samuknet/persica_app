var app = angular.module('Persica');
app.service('chatService', ['$http', 'socketService', function ($http, socketService) {
	var messages =[];
	var observers = [];
	var notifyObservers = function (){
		_.forEach(observers, function(observer) {
			observer();
		});
	}

	socketService.on('control-chat-msg', function (msg) {
		messages.push(msg);
		notifyObservers();
	});

	this.sendMessage = function (msg) {
		socketService.emit('control-chat-msg', msg);
	}

	this.messages = messages;
	this.observers = observers;
}]);