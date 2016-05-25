/**
 * Dashboard Controller
 */

angular
    .module('Persica')
    .controller('DashboardCtrl', ['$scope', 'deviceService', DashboardCtrl]);

function DashboardCtrl($scope, deviceService, $uibModal) {

	var devices_observer = function() {
		$scope.deviceCount = Object.keys(deviceService.devices).length;
	}

    deviceService.observers.push(devices_observer)
}

