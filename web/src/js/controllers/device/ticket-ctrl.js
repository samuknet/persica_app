/* Controller for the graph modal for a device variable */
angular.module('Persica').controller('TicketListCtrl', ['$scope', '$stateParams', '$uibModal', 'ticketService', function($scope, $stateParams, $uibModal, ticketService) {
    var did = $stateParams.did;
  
    var tickets_observer = function() {
        $scope.tickets = _.filter(ticketService.tickets, function (ticket) {
            return ticket.did == did;
        });

    };

    $scope.viewTicket = function (ticket) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/templates/modals/ticketModal.html',
            controller: 'TicketModalCtrl',
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


angular.module('Persica').controller('RaiseTicketModalCtrl', ['$scope', '$uibModalInstance', 'userService', 'ticketService', 'did', function ($scope, $uibModalInstance, userService, ticketService, did) {
    var errorMsg = function(msg) {

        $scope.alertClass = 'alert alert-danger';
        $scope.alertMsg = msg;
    };

    var infoMsg = function (msg) {
        $scope.alertClass = 'alert alert-info';
        $scope.alertMsg = msg;
    };

    infoMsg('Please file a ticket.');

    $scope.raiseTicket = function (title, description) {
        var username = userService.currentUser.username;
        ticketService.newTicket({did: did, issuedBy: username, title: title, description: description}, function() {
            $uibModalInstance.close();
        }, function(err) {
            errorMsg(err.message);
        })
    };
}])
angular
    .module('Persica')
    .controller('TicketModalCtrl', ['$scope', '$uibModalInstance', '$http', 'userService', 'deviceService', 'ticketService', 'ids', TicketModalCtrl]);

function TicketModalCtrl($scope, $uibModalInstance, $http, userService, deviceService, ticketService, ids) {
    var errorMsg = function(msg) {

        $scope.alertClass = 'alert alert-danger';
        $scope.alertMsg = msg;
    };

    var infoMsg = function (msg) {
        $scope.alertClass = 'alert alert-info';
        $scope.alertMsg = msg;
    };

    // infoMsg('');

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

    $scope.resolveTicket = function() {
        ticketService.resolveTicket($scope.ticket, function() {
            $uibModalInstance.close();
        }, function() {
            errorMsg('Could not resolve ticket.')
        });
    };
    $scope.getCommentStyles = function(comment) {
        if (comment.author === userService.currentUser.username) {
            return 'pull-right text-right';
        } else {
            return 'pull-left text-left';
        }
    };

    $scope.postComment = function ( message) {
        var username = userService.currentUser.username;
        ticketService.postComment(ids.tid, {author: username, message: message}, function() {
            // On success - comment posted successfuly
        }, function(response) {
            errorMsg(response.data.message);
        });
    }
};
