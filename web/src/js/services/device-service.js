var app = angular.module('Persica');
app.service('deviceService', ['$http', 'socketService', function ($http, socketService) {
	var devices = {};
	var observers = [];

	var notify_observers = function (){
		_.forEach(observers, function(observer) {
			observer();
		})

	}

	$http.get('/device').then(function(response) {
		// Success
		var deviceList = response.data;
		_.forEach(deviceList, function (device) {
			devices[device.did] = _.extend(devices[device.did] || {}, device);
		});
		notify_observers();
	}, function (response) {
		// Error
	});
	socketService.on('device-connected', function(device) {
		devices[device.did] = _.extend(devices[device.did] || {}, device);
		devices[device.did].online = true;
		notify_observers();

    });

    socketService.on('device-disconnected', function(device) {
		devices[device.did] = _.extend(devices[device.did] || {}, device);
		devices[device.did].online = false;
		notify_observers();

        
    });

    socketService.on('device-new', function(device) {
    	devices[device.did] = _.extend(devices[device.did] || {}, device);
		notify_observers();

		
    });

	this.devices = devices;
	this.observers = observers;

}]);