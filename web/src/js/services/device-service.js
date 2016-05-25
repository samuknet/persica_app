var app = angular.module('Persica');
app.service('deviceService', ['$http', 'socketService', function ($http, socketService) {
	var devices = {};

	$http.get('/device').then(function(response) {
		// Success
		var deviceList = response.data;
		_.forEach(deviceList, function (device) {
			devices[device.did] = _.extend(devices[device.did], device);
		});

	}, function (response) {
		// Error
	});
	socketService.on('device-connected', function(device) {
		devices[device.did] = _.extend(devices[device.did], device);
		devices[device.did].online = true;
    });

    socketService.on('device-disconnected', function(device) {
		devices[device.did] = _.extend(devices[device.did], device);
		devices[device.did].online = false;
        }
    });

    socketService.on('device-new', function(device) {
    	devices[device.did] = _.extend(devices[device.did], device);
		

    })

	this.devices = devices;
}]);