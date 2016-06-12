/* Controller for the graph modal for a device variable */
angular.module('Persica').controller('DashTicketListCtrl', ['$scope', '$stateParams', '$uibModal', 'ticketService', function($scope, $stateParams, $uibModal, ticketService) {
    var tickets_observer = function() {
        $scope.tickets = ticketService.tickets;
    };

    $scope.viewTicket = function (ticket) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/templates/modals/ticketModal.html',
            controller: 'TicketModalCtrl',
            resolve: {
                ids: {
                    did: ticket.did,
                    tid: ticket.tid
                }
            }
        });
    };

    ticketService.observers.push(tickets_observer);
    tickets_observer();
}]);