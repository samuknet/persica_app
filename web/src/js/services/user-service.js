var app = angular.module('Persica');
app.service('userService', ['$window', '$http', 'socketService', 'notificationService', function ($window, $http, socketService, notificationService) {
    var observers = [];
	var notify_observers = function (){
		_.forEach(observers, function(observer) {
			observer();
		})
	};

    this.authorizeUser = function (token) {
        var self = this;
        $http.defaults.headers.common.Authorization = 'Bearer ' + token;
        return $http.get('/user').then(function(response) {
            var user = response.data;
            notificationService.getNotifications(user);
            $window.localStorage['persica-token'] = token;
            self.currentUser = user;
        }, function(response) {
            console.log('error', response);
        });
       
    }

    this.logout = function() {
        $http.defaults.headers.common.Authorization = null;
        delete $window.localStorage['persica-token'];
        this.currentUser = null;
        $window.location.href = '/';
    }

    this.updateNotificationSettings = function (data) {
       return  $http.put('/user/' + this.currentUser.username, data);

    }

    this.currentUser = {};

    this.currentUser = null;

    this.observers = observers;

}]);