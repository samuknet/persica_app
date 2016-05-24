/**
 * Dashboard Controller
 */
angular
    .module('Persica')
    .controller('deviceListCtrl', ['$scope', 'deviceService', DeviceListCtrl]);

function DeviceListCtrl($scope, deviceService) {
    $scope.devices = deviceService.devices;
    console.log($scope.devices);
   
}