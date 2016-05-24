var app = angular.module('Persica');
app.service('deviceService', ['socketService', function (socketService) {
	var devices = {};
	socketService.on('device-connected', function(device) {
        devices[device.did] = device;
    });

    socketService.on('device-disconnected', function(device) {
        delete devices[device.did];
    });
	this.devices = devices;
}]);