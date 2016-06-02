angular
    .module('Persica')
    .controller('DashboardHeaderCtrl', ['$scope', 'deviceService', DashboardHeaderCtrl]);

function DashboardHeaderCtrl($scope, deviceService) {
	var devices_observer = function() {
        $scope.deviceCount = Object.keys(deviceService.devices).length;
    };
    

    deviceService.observers.push(devices_observer);
    devices_observer();
}