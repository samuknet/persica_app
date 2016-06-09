/**
 * Device List Controller
 */

var app = angular.module('Persica');

app.controller('DeviceListCtrl', ['$scope', 'deviceService', '$uibModal', '$state', DeviceListCtrl]);

function DeviceListCtrl($scope, deviceService, $uibModal, $state) {
    $scope.devices = deviceService.devices;
    
    $scope.navigateToDevice = function(did) { // Called when device table row is clicked
        // Navigate to device profile page
        $state.go('device', {did: did});
    };

    $scope.openNewDeviceModal = function () {
	    var modalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: '/templates/modals/newDeviceModal.html',
	      controller: 'NewDeviceModalCtrl'
	    });
    };    
}

app.controller('NewDeviceModalCtrl', ['$scope', '$uibModalInstance', '$http', 'deviceService', function($scope, $uibModalInstance, $http, deviceService) {
    $scope.alertMsg   = 'Device ID and alias required.';
    $scope.alertClass = 'alert alert-info';
    $scope.submit = function() {
        deviceService.newDevice(
            {did: $scope.did, alias: $scope.alias, description: $scope.description},
            function (response) {
                $uibModalInstance.close();
            },
            function (response) {
                $scope.alertMsg = response.data.message;
                $scope.alertClass = 'alert alert-danger';
            });
	};
	$scope.cancel = function() {
		$uibModalInstance.close();
	};
}]);

app.controller('InputDropdownController', ['inputDropdown', function() {
  this.selectedDropdownItem = null;
  this.dropdownItems = ['hello', 'from', 'the', 'other', 'side'];
}]);