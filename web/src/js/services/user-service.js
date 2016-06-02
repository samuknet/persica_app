var app = angular.module('Persica');
app.service('userService', ['$window', '$http', 'socketService', 'notificationService', function ($window, $http, socketService, notificationService) {
    var observers = [];
	var notify_observers = function (){
		_.forEach(observers, function(observer) {
			observer();
		})
	};



    this.authorizeUser = function (user) {
        notificationService.getNotifications(user);
        $http.defaults.headers.common.Authorization = 'Bearer ' + user.token;
        $window.localStorage['persica-user'] = JSON.stringify(user);

        this.currentUser = user;
    }

    this.currentUser = {};
    this.observers = observers;

}]);