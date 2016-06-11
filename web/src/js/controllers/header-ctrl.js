/**
 * HeaderController
 */

angular.module('Persica')
   .controller('HeaderCtrl', ['$scope','$state', '$uibModal', 'notificationService', 'userService', HeaderCtrl]);

function HeaderCtrl($scope, $state, $uibModal, notificationService, userService) {

    $scope.notifications = [];
    var user_obs
    var notifications_observer = function() {
        $scope.notifications = notificationService.notifications;
    };
     var users_observer = function() {
        $scope.currentUser = userService.currentUser;
    };

    $scope.dismissNotification = function (not) {notificationService.deleteNotification(not);};
    $scope.logout = function() {
    	userService.logout();
    	$state.go('index');
    };
    $scope.openSettingsModal = function() {
        var instance = $uibModal.open({
          templateUrl: 'templates/modals/settingsModal.html',
          controller: 'SettingsModalCtrl',

        });
    };    



    userService.observers.push(users_observer);
    users_observer();
    notificationService.observers.push(notifications_observer);
    notifications_observer();


}