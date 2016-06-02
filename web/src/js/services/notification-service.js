angular.module('Persica').service('notificationService', ['$http', 'socketService', function ($http, socketService) {
	var notifications =[];
	var observers = [];


	var notifyObservers = function (){
		_.forEach(observers, function(observer) {
			observer();
		});
	}

	this.getNotifications = function(user) {

		$http.get('/notification/' + user.username).then(function(response) {
			// Success
			notifications  = notifications.concat(response);
			notify_observers();
		}, function (error) {
			console.log("Error when getting notifications: " + error);
		});
	}


	socketService.on('notification-new', function (notification) {
		notifications.push(notification);
		notifyObservers();
	});


	this.observers = observers;
}]);