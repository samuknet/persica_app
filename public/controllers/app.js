// Export the controller
var app = angular.module('myApp', []);

// Defining wrapper Routes for our API
app.controller('appCtrl', function($scope, socket) {
	$scope.devices = {};
});

app.controller('cmdCtrl', function ($scope, socket) {
	$scope.cmd='red';
	socket.on('device-connected', function(data) {
		$scope.devices[data.did] = data;
	});
	socket.on('device-disconnected', function(data) {
		delete $scope.devices[data.did];
	})
	$scope.sendCmd = function() {
		socket.emit('cmd', {cmd: $scope.cmd});
	}
});

app.factory('socket', function ($rootScope) {
	var socket = io('/control');
	return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});