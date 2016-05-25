/**
 * Device List Controller
 */

var app = angular.module('Persica');

app.controller('DeviceListCtrl', ['$scope', 'deviceService', '$uibModal', DeviceListCtrl]);

function DeviceListCtrl($scope, deviceService, $uibModal) {
    $scope.devices = deviceService.devices;

    $scope.openNewDeviceModal = function () {
	    var modalInstance = $uibModal.open({
	      animation: true,
	      templateUrl: '/templates/modals/newDeviceModal.html',
	      controller: 'NewDeviceModalCtrl',
	      resolve: {
	        items: function () {
	          return $scope.items;
	        }
	      }
	    });
    };    
}

app.controller('NewDeviceModalCtrl', ['$scope', '$uibModalInstance', '$http', function($scope, $uibModalInstance, $http) {
    $scope.alertMsg   = 'Device ID and alias required.';
    $scope.alertClass = 'alert alert-info';
    $scope.submit = function() {
		$http.post('/device', {
			did: $scope.did,
			alias: $scope.alias,
			description: $scope.description
		}).then(function (response) {
			// Success
			$uibModalInstance.close();
	    }, function (response) {
		  	// Error
            $scope.alertMsg = response.data.message;
            $scope.alertClass = 'alert alert-danger';
		});
	};
	$scope.cancel = function() {
		$uibModalInstance.close();
	};




}]);