var app = angular.module('Persica');
app.service('userService', ['$window', '$http', 'socketService', function ($window, $http, socketService) {
    var observers = [];
	var notify_observers = function (){
		_.forEach(observers, function(observer) {
			observer();
		})
	};

	socketService.on('user-notification', function(notification) {
        this.currentUser = this.currentUser || {notifcations: []};
        this.currentUser.notifications = this.currentUser.notifications || [];
        this.currentUser.notifications.push(notification);
		notify_observers();
    });

    this.authorizeUser = function (user) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + user.token;
        $window.localStorage['persica-user'] = JSON.stringify(user);
        this.currentUser = _.extend(this.currentUser || {notifications: []}, user);
    }

    this.currentUser = {};
    this.observers = observers;

}]);