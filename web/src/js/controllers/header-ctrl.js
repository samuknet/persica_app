/**
 * HeaderController
 */

angular.module('Persica')
    .controller('HeaderCtrl', ['$scope','$http', '$state', 'notificationService', 'userService', HeaderCtrl]);

function HeaderCtrl($scope, $http, $state, notificationService, userService) {
    $scope.notifications = [];
    var notifications_observer = function() {
        $scope.notifications = notificationService.notifications;
    };

    $scope.dismissNotification = function (not) {notificationService.deleteNotification(not);};
    $scope.logout = function() {
    	userService.logout();
    	$state.go('index');
    };

   
    notificationService.observers.push(notifications_observer);
    notifications_observer();
}