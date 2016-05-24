// Export the controller
var app = angular.module('myApp', []);

// Defining wrapper Routes for our API
app.controller('appCtrl', function($scope, socket) {
    $scope.devices = {};
});

app.controller('cmdCtrl', function ($scope, socket) {
    $scope.cmd = 'red';
    $scope.deviceTargets = '';
    socket.on('device-connected', function(data) {
        $scope.devices[data.did] = data;
    });
    socket.on('device-disconnected', function(data) {
        delete $scope.devices[data.did];
    })
    $scope.sendCmd = function() {
        if ($scope.deviceTargets.$pristine || ($scope.deviceTargets == '')) {
            console.log('normal');
            return socket.emit('cmd', {cmd: $scope.cmd});
        }

        var devices = {};
        $scope.deviceTargets.split(',').forEach(function(did) {
          devices[did] = true;
        });
        console.log(devices);

        socket.emit('cmd', {cmd: $scope.cmd, devices: devices});
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