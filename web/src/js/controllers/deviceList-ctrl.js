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
	$scope.submit = function() {
		$http.post('/device', {
			did: $scope.did,
			alias: $scope.alias,
			description: $scope.description
		}).then(function (response) {
			// Success
			$scope.closeAlert();
			$uibModalInstance.close();
	    }, function (response) {
		  	// Error
		  	$scope.addWarning(response.message);
		});
	};
	$scope.cancel = function() {
		$uibModalInstance.close();
	};

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


}]);