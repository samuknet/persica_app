/* Controller for the graph modal for a device variable */
angular.module('Persica').controller('TicketListCtrl', ['$scope', '$stateParams', '$uibModal', 'ticketService', function($scope, $stateParams, $uibModal, ticketService) {
    var did = $stateParams.did;
  
    var tickets_observer = function() {
        $scope.tickets = _.filter(ticketService.tickets, function (ticket, tid) {
            return ticket.did === did;
        });

    };

    $scope.viewTicket = function (ticket) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/templates/modals/ticketModal.html',
            controller: 'TicketModalModalCtrl',
            resolve: {
                ids: {
                    did: did,
                    tid: ticket.tid
                }
            }
        });

    }

    ticketService.observers.push(tickets_observer);
    tickets_observer();
}]);


angular.module('Persica').controller('RaiseTicketModalCtrl', ['$scope', '$uibModalInstance', 'did', function ($scope, $uibModalInstance) {
      var errorMsg = function(msg) {
        $scope.alertClass = 'alert alert-danger';
        $scope.alertMsg = msg;
    };

    var infoMsg = function (msg) {
        $scope.alertClass = 'alert alert-info';
        $scope.alertMsg = msg;
    };

    infoMsg('Please file a ticket.');

    
    $scope.raiseTicket = function (username, title, description) {
        // ticketService.ra
    };
}])