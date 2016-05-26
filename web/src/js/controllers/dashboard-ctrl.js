/**
 * Dashboard Controller
 */

angular
    .module('Persica')
    .controller('DashboardCtrl', ['$scope', 'deviceService', DashboardCtrl]);

function DashboardCtrl($scope, deviceService, $uibModal) {

	var devices_observer = function() {
		$scope.deviceCount = Object.keys(deviceService.devices).length;
	};

	$scope.labels = ["22nd January 2016", "15th March 2016", "7th April 2016"];
    $scope.upTime = [50 , 20, 60];
    $scope.uptimePairs = [[100, 150], [180, 300], [350, 410]];
    $scope.averageUpTime = calcAverageUpTime($scope.uptimePairs);

	function calcAverageUpTime(uptimePairs) {
		var sum = 0
		for (i = 0; i < uptimePairs.length; i++) {
			var startTime = uptimePairs[i][0];
			var endTime = uptimePairs[i][1];
			var upTime = endTime - startTime;
			sum = sum + upTime;
		}
		var averageUpTime = sum / uptimePairs.length;
		return averageUpTime;
	}
    deviceService.observers.push(devices_observer);
}

