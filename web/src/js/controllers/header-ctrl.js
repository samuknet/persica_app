/**
 * HeaderController
 */

angular.module('Persica')
    .controller('HeaderCtrl', ['$scope','notificationService', HeaderCtrl]);

function HeaderCtrl($scope, notificationService) {
    $scope.notifications = [];
    var notifications_observer = function() {
        $scope.notifications = notificationService.notifications;
    };

    $scope.dismissNotification = function (not) {notificationService.deleteNotification(not);};

    notificationService.observers.push(notifications_observer);
    notifications_observer();
}