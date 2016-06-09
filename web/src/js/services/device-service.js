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
        console.log(device);
		devices[device.did] = _.extend(devices[device.did] || {}, device);
		devices[device.did].online = true;
        devices[device.did].establishTime = Date.now();
		notify_observers();
    });

    socketService.on('device-disconnected', function(device) {
		devices[device.did] = _.extend(devices[device.did] || {}, device);
		devices[device.did].online = false;
		notify_observers();
    });

    socketService.on('device-new', function(device) {
    	devices[device.did] = _.extend(devices[device.did] || {}, device);
        devices[device.did].lastOnline = "Device has not been online yet.";
		notify_observers();
    });

    socketService.on('device-register-cmd', function (register) {
    	devices[register.did] = _.extend(devices[register.did] || {}, {did: register.did});
    	if (devices[register.did].cmds) {
            devices[register.did].cmds.push(register.cmd);
        } else {
            devices[register.did].cmds = [register.cmd];
        }
    	notify_observers();
    });

    socketService.on('device-updateVariable', function(updateObj) {
    	var variable = {
    		value : updateObj.value,
    		timestamp : updateObj.timestamp
    	};
    	var device = devices[updateObj.did]
    	device.liveVars = device.liveVars || {}
    	device.liveVars[updateObj.handle] = variable
    	notify_observers()
    });

    socketService.on('device-log', function(updateObj) {
    	var log = {
    		did: updateObj.did,
    		critical : updateObj.critical,
    		log: updateObj.log,
    		timestamp : updateObj.timestamp
    	};

    	var device = devices[updateObj.did]
    	device.logs = device.logs || [];
    	device.logs.push(log);
    	notify_observers()
    });


	this.devices = devices;
	this.observers = observers;

    this.newDevice = function(device, success, fail) {
        $http.post('/device', {
            did: device.did,
            alias: device.alias,
            description: device.description,
            group: device.group
        }).then(success, fail);
    }

	this.sendCommand = function (did, cmdName) {
		socketService.emit('cmd', {did: did, cmd: cmdName});
	};

}]);