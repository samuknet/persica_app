angular
    .module('Persica')
    .controller('DashboardHeaderCtrl', ['$scope', 'deviceService', 'ticketService', DashboardHeaderCtrl]);

function DashboardHeaderCtrl($scope, deviceService, ticketService) {
	var devices_observer = function() {
        $scope.deviceCount = Object.keys(deviceService.devices).length;
    };
    
    var tickets_observer = function() {
    	$scope.unresolvedTicketCount = Object.keys(ticketService.tickets).length;
    };

    deviceService.observers.push(devices_observer);
    devices_observer();


    ticketService.observers.push(tickets_observer);
    tickets_observer();
}