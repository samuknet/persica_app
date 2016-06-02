angular.module('Persica').service('notificationService', ['$http', 'socketService', function ($http, socketService) {
	
	var observers = [];
	var notifications = [];

	var notifyObservers = function (){
		_.forEach(observers, function(observer) {
			observer();
		});
	}

	var getNotifications = function(user) {

		$http.get('/notification/' + user.username).then(function(response) {
			// Success

			_.forEach(response.data, function(notification) {
				notifications.push(notification);
			})
			console.log(notifications);
			notifyObservers();
			
		}, function (error) {
			console.log("Error when getting notifications: " + error);
		});
	}


	socketService.on('notification-new', function (notification) {
		
		notifyObservers();
	});

	this.notifications = notifications;
	this.getNotifications = getNotifications;
	this.observers = observers;
}]);