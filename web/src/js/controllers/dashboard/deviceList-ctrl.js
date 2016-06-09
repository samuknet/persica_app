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

app.controller('NewDeviceModalCtrl', ['$scope', '$uibModalInstance', '$http', 'deviceService', 'groupService', function($scope, $uibModalInstance, $http, deviceService, groupService) {
    $scope.alertMsg   = 'Device ID and alias required.';
    $scope.alertClass = 'alert alert-info';
    $scope.groups = groupService.groups;
    $scope.submit = function() {
        deviceService.newDevice(
            {did: $scope.did, alias: $scope.alias, description: $scope.description, gid: $scope.gid},
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