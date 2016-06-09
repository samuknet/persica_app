/**
 * HeaderController
 */

angular.module('Persica')
   .controller('HeaderCtrl', ['$scope','$state', '$uibModal', 'notificationService', 'userService', HeaderCtrl]);

function HeaderCtrl($scope, $state, $uibModal, notificationService, userService) {

    $scope.notifications = [];
    var notifications_observer = function() {
        $scope.notifications = notificationService.notifications;
    };

    $scope.dismissNotification = function (not) {notificationService.deleteNotification(not);};
    $scope.logout = function() {
        console.log("logout")

    	userService.logout();
    	$state.go('index');
    };
    $scope.openSettingsModal = function() {
        var instance = $uibModal.open({
          templateUrl: 'templates/modals/settingsModal.html',
          controller: 'SettingsModalCtrl',

        });


    };    

    notificationService.observers.push(notifications_observer);
    notifications_observer();


}