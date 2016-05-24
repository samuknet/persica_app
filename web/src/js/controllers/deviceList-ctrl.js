/**
 * Device List Controller
 */

var app = angular.module('Persica');

app.controller('DeviceListCtrl', ['$scope', 'deviceService', '$uibModal', DeviceListCtrl]);

function DeviceListCtrl($scope, deviceService, $uibModal) {
    $scope.devices = deviceService.devices;

    $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/templates/modals/newDeviceModal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

};

    
}
app.controller('ModalInstanceCtrl', ['$scope', function($scope) {
	$scope.test='hi';
}]);