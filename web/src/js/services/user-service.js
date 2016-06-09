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

    this.logout = function() {
        $http.defaults.headers.common.Authorization = null;
        $window.localStorage['persica-user'] = null;
        this.currentUser = null;
        $window.location.href = '/';
    }

    this.updateNotificationSettings = function (data) {
       return  $http.put('/user/' + this.currentUser.username, data);

    }

    this.currentUser = {};
    this.observers = observers;

}]);