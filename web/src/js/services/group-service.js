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
			groups[group.gid] = _.extend(groups[group.gid] || {}, group);
		});
		notify_observers();
	}, function (response) {
		// Error
	});

    socketService.on('group-new', function(group) {
    	groups[group.gid] = _.extend(groups[group.gid] || {}, group);
		notify_observers();
    });

    socketService.on('group-update', function(updatedGroup) {
        // Group is the updated group
        groups[group.gid] = _.extend(groups[group.gid] || {}, updatedGroup);
        notify_observers();
    });

	this.groups = groups;
	this.observers = observers;

    this.newGroup = function(group, success, fail) {
        $http.post('/group', {
            name: group.name,
            description: group.description
        }).then(success, fail);
    }

    this.addDeviceToGroup = function (group, device, success, fail) {
        $http.put('/group/' + group.gid + '/add/' + device.did).then(success, fail);
    }

	// Sends a command to all devices in a given group
	this.groupCommand = function (gid, cmdName) {
		socketService.emit('group-cmd', {gid: gid, cmd: cmdName})
	};

}]);