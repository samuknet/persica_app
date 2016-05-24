/**
 * Dashboard Controller
 */
angular
    .module('Persica')
    .controller('serverListCtrl', ['$scope', 'deviceService', ServerListCtrl]);

function ServerListCtrl($scope, deviceService) {
    $scope.devices = deviceService.devices;
    console.log($scope.devices);
   
}