var app = angular.module('Persica');
app.service('deviceService', ['$http', 'socketService', function ($http, socketService) {
	var devices = {};

	$http.get('/device').then(function(response) {
		// Success
		var deviceList = response.data;
		_.forEach(deviceList, function (device) {
			device.online = false;
			devices[device.did] = device;

		});

	}, function (response) {
		// Error
	});
	socketService.on('device-connected', function(device) {
        if (devices[device.did]) {
        	devices[device.did].online = true;
        } 
    });

    socketService.on('device-disconnected', function(device) {
        if (devices[device.did]) {
        	devices[device.did].online = false;
        }
    });

	this.devices = devices;
}]);