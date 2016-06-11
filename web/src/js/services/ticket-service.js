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

    socketService.on('ticket-new', function(ticket) {
    	tickets[ticket.tid] = _.extend(tickets[ticket.tid] || {}, ticket);
		notify_observers();
    });

    socketService.on('ticket-update', function(updatedTicket) {
        tickets[updatedTicket.tid] = updatedTicket;
        notify_observers();
    });

    socketService.on('ticket-resolve', function(resolvedTicket) {
        delete tickets[resolvedTicket.tid];
        notify_observers();
    });

	this.tickets = tickets;
	this.observers = observers;

    this.newTicket = function(ticket, success, fail) {
        $http.post('/ticket', {
            did: ticket.did,
            title: ticket.title,
            description: ticket.description,
            issuedBy: ticket.issuedBy
        }).then(success, fail);
    };

    this.updateTicket = function(ticket, success, fail) {
        $http.put('/ticket', ticket).then(success, fail);
    };

    this.postComment = function (tid, comment, success, fail) {
        $http.post('/ticket/' + tid + '/comment', comment).then(success, fail);
    }

    this.resolveTicket = function(ticket, success, fail) {
        $http.delete('/ticket/'+ticket.tid).then(success, fail);
    };

}]);