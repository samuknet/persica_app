var app = angular.module('Persica');
app.service('groupService', ['$http', 'socketService', function ($http, socketService) {
	var groups = {};
	var observers = [];

	var notify_observers = function (){
		_.forEach(observers, function(observer) {
			observer();
		})
	};

	$http.get('/group').then(function(response) {
		// Success
		var groupList = response.data;
		_.forEach(groupList, function (group) {
			groups[group.gid] = _.extend(groups[group.did] || {}, group);
		});
		notify_observers();
	}, function (response) {
		// Error
	});

    socketService.on('group-new', function(group) {
    	groups[group.did] = _.extend(groups[group.did] || {}, group);
		notify_observers();
    });

    // not sure if needed
    // socketService.on('device-connected', function(device) {
    //     devices[device.did] = _.extend(devices[device.did] || {}, device);
    //     devices[device.did].online = true;
    //     devices[device.did].establishTime = device.establishTime;
    //     notify_observers();
    // });

    // not sure if needed
    // socketService.on('device-disconnected', function(device) {
    //     devices[device.did] = _.extend(devices[device.did] || {}, device);
    //     devices[device.did].online = false;
    //     notify_observers();
    // });

    // not sure if needed
    // socketService.on('device-register-cmd', function (register) {
    // 	devices[register.did] = _.extend(devices[register.did] || {}, {did: register.did});
    // 	devices[register.did].cmds.push(register.cmd);
    // 	notify_observers();
    // });

    // not sure if needed
    // socketService.on('device-updateVariable', function(updateObj) {
    // 	var variable = {
    // 		value : updateObj.value,
    // 		timestamp : updateObj.timestamp
    // 	};
    // 	var device = devices[updateObj.did]
    // 	device.liveVars = device.liveVars || {}
    // 	device.liveVars[updateObj.handle] = variable
    // 	notify_observers()
    // });

    // not sure if needed
    // socketService.on('device-log', function(updateObj) {
    // 	var log = {
    // 		did: updateObj.did,
    // 		critical : updateObj.critical,
    // 		log: updateObj.log,
    // 		timestamp : updateObj.timestamp
    // 	};

    // 	var device = devices[updateObj.did]
    // 	device.logs = device.logs || [];
    // 	device.logs.push(log);
    // 	notify_observers()
    // });


	this.groups = groups;
	this.observers = observers;

    this.newGroup = function(group, success, fail) {
        $http.post('/group', {
            name: group.name,
            description: group.description
        }).then(success, fail);
    }

	// Sends a command to all devices in a given group
	this.groupCommand = function (gid, cmdName) {
		socketService.emit('group-cmd', {gid: gid, cmd: cmdName})
	};

}]);