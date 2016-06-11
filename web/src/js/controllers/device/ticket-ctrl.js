/* Controller for the graph modal for a device variable */
angular
    .module('Persica')
    .controller('TicketModalCtrl', ['$scope', '$uibModalInstance', '$http', 'deviceService', 'ticketService', 'ids', TicketModalCtrl]);

function TicketModalCtrl($scope, $uibModalInstance, $http, deviceService, ticketService, ids) {
    var errorMsg = function(msg) {
        $scope.alertClass = 'alert alert-danger';
        $scope.alertMsg = msg;
    };

    var infoMsg = function (msg) {
        $scope.alertClass = 'alert alert-info';
        $scope.alertMsg = msg;
    };

    infoMsg('');

    var did = ids.did;
    $scope.tid = ids.tid;

    var ticket_observer = function() {
        $scope.ticket = ticketService.tickets[$scope.tid];
    };

    ticketService.observers.push(ticket_observer);
    ticket_observer();

    $scope.close = function() {
        $uibModalInstance.close();
    };

    $scope.delete = function() {
        ticketService.resolveTicket($scope.ticket, function() {
            $uibModalInstance.close();
        }, function() {
            errorMsg('Could not delete Ticket.')
        });
    };
}]);