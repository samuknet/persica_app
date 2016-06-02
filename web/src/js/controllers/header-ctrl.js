/**
 * HeaderController
 */

angular.module('Persica')
    .controller('HeaderCtrl', ['$scope', 'userService', HeaderCtrl]);

function HeaderCtrl($scope, userService) {
    $scope.currentUser = userService.currentUser;
    $scope.notifications = [{did: 'test'}];
    var notifications_observer = function() {
        console.log('hh');
        $scope.notifications = userService.currentUser.notifications;
        console.log($scope.notifications);
    };

    userService.observers.push(notifications_observer);
    notifications_observer();
}