/**
 * Alerts Controller
 */
angular
    .module('Persica')
    .controller('AlertsCtrl', ['$scope', AlertsCtrl]);

function AlertsCtrl($scope) {
    $scope.alerts = [];

    $scope.addSuccess = function(msg) {
        $scope.alerts.push({
            type: 'success',
            msg: msg
        });
    }

    $scope.addWarning = function(msg) {
        $scope.alerts.push({
            type: 'danger',
            msg: msg
        });
    };

    $scope.closeAlert = function() {
        $scope.alerts.splice(0, 1);
    };
    
    $scope.addAlert = function() {
        $scope.alerts.push({
            msg: 'Another alert!'
        });
    };

}