var app = angular.module('Persica');
app.service('ticketService', ['$http', 'socketService', function ($http, socketService) {
	var tickets = {};
	var observers = [];

	var notify_observers = function (){
		_.forEach(observers, function(observer) {
			observer();
		})
	};

	$http.get('/ticket').then(function(response) {
		// Success
		var ticketList = response.data;
		_.forEach(ticketList, function (ticket) {
			tickets[ticket.tid] = _.extend(tickets[ticket.tid] || {}, ticket);
		});
		notify_observers();
	}, function (response) {
		// Error
	});

 //    socketService.on('device-new', function(device) {
 //    	devices[device.did] = _.extend(devices[device.did] || {}, device);
 //        devices[device.did].lastOnline = 'Device has not been online yet.';
	// 	notify_observers();
 //    });

 //   socketService.on('device-update', function(updatedDevice) {
 //        devices[updatedDevice.did] = updatedDevice;
 //        notify_observers();
 //    });

	this.tickets = tickets;
	this.observers = observers;

    this.newTicket = function(ticket, success, fail) {
        $http.post('/ticket', {
            did: ticket.did,
            title: ticket.title,
            description: ticket.description,
            issuedBy: ticket.issuedBy
        }).then(success, fail);
    }

}]);