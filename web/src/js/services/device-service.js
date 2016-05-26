var app = angular.module('Persica');
app.service('deviceService', ['$http', 'socketService', function ($http, socketService) {
	var devices = {};
	var observers = [];

	var notify_observers = function (){
		_.forEach(observers, function(observer) {
			observer();
		})
	};

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
        devices[device.did].establishTime = Date.now();
		notify_observers();

    });

    socketService.on('device-disconnected', function(device) {
		devices[device.did] = _.extend(devices[device.did] || {}, device);
		devices[device.did].online = false;
        devices[device.did].lastOnline = Date.now()
		notify_observers();

        
    });

    socketService.on('device-new', function(device) {
    	devices[device.did] = _.extend(devices[device.did] || {}, device);
		notify_observers();
    });

    socketService.on('device-register-cmd', function (register) {
    	devices[register.did] = _.extend(devices[register.did] || {}, {did: register.did});
    	devices[register.did].cmds.push(register.cmd);
    	notify_observers();
    });

	this.devices = devices;
	this.observers = observers;

	// Sends a command to all connected devices
	this.broadcastCommand = function(cmdName){ 
		socketService.emit('cmd', {cmd: cmdName});
	};

	this.sendCommand = function (did, cmdName) {
		socketService.emit('cmd', {did: did, cmd: cmdName});
	};

	// Sends a command to all devices in a given group
	this.groupCommand = function (groupName, cmdName) {
		// TODO: Not implemented! This is a sample of how we might implement it
		socketService.emit('cmd', {group: groupName, cmd: cmdName})
	};

}]);