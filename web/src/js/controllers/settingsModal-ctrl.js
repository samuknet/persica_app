/**
 * Settings Modal Controller
 */

angular.module('Persica')
    .controller('SettingsModalCtrl', ['$scope', '$http', '$uibModal', '$uibModalInstance', 'userService' ,SettingsModalCtrlf]);

function SettingsModalCtrlf($scope, $http, $uibModal, $uibModalInstance, userService) {
    var errorMsg = function(msg) {
        $scope.alertClass = 'alert alert-danger';
        $scope.alertMsg = msg;
    };

    var infoMsg = function (msg) {
        $scope.alertClass = 'alert alert-info';
        $scope.alertMsg = msg;
    };
    $scope.levels = userService.currentUser.notifyConfig;

}

