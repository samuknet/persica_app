angular.module('Persica').service('notificationService', ['$http', 'pageVisibilityService', 'webNotification', 'socketService', function ($http, pageVisibilityService, webNotification, socketService) {
	var notifications =[];
	var observers = [];
	var visible = true;


	var notifyObservers = function (){
		_.forEach(observers, function(observer) {
			observer();
		});
	}

	this.getNotifications = function(user) {
		$http.get('/notification/' + user.username).then(function(response) {
			// Success
			notifications  = notifications.concat(response.data);
			notifyObservers();
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