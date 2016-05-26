/**
 * Alerts Controller
 */
angular
    .module('Persica')
    .controller('DeviceProfileCtrl', ['$scope', '$stateParams', '$http', DeviceProfileCtrl]);

function DeviceProfileCtrl($scope, $stateParams, $http) {
    $http.get('/device?did=' + $stateParams.did).then(function(response) {
        // Success
        var deviceInfo = _.first(response.data);
        $scope.did = deviceInfo.did;
        $scope.alias = deviceInfo.alias;
        $scope.description = deviceInfo.description;
    }, function (response) {
        // Error
    });
}