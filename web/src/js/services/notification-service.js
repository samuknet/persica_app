angular.module('Persica').service('notificationService', ['$http', '$state', '$notification', 'pageVisibilityService', 'socketService', function ($http, $state, $notification, pageVisibilityService, socketService) {
	$notification.requestPermission();

	var notifications =[];
	var observers = [];
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
			notifyObservers();
			
		}, function (error) {
			console.log("Error when getting notifications: " + error);
		});
	};

	var deleteNotification = function (notification, succ, err) { // id is the mongo entry id of the notication
		$http.delete('/notifcation/'+ notifcation._id, function (response) {
			succ(response.data);
		}, function (error) {
			err(error);
		});
	};

	socketService.on('notification-new', function (notification) {
		var did = notification.did,
			message = notification.message;
		if (!pageVisibilityService.isPageVisible()) { //If page isn't visible then send a web notification
			var n = $notification('Device ' + did + ' Notification', {
			    body: message,
			    icon: 'img/favicon.png'
			 });

			n.$on('click', function() {
				$state.go('device', {did: did});
			})
		}
		notifications.push(notification);
		notifyObservers();
	});

	this.notifications = notifications;
	this.getNotifications = getNotifications;
	this.deleteNotifications = deleteNotifications;
	this.observers = observers;
}]);