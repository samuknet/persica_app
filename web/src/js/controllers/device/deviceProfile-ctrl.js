/**
 * Device Profile Controller
 */
angular
    .module('Persica')
    .controller('DeviceProfileCtrl', ['$scope', '$stateParams', '$http', 'deviceService', DeviceProfileCtrl]);

function DeviceProfileCtrl($scope, $stateParams, $http, deviceService) {
    var did = $stateParams.did;
    var device_observer = function() {
        $scope.device = deviceService.devices[did];
    };

    deviceService.observers.push(device_observer);
    device_observer();
    
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
}

/**
 * Device Cmds Controller
 */
angular
    .module('Persica')
    .controller('DeviceCmdsCtrl', ['$scope', '$stateParams', 'deviceService', DeviceCmdsController]);

function DeviceCmdsController($scope, $stateParams, deviceService) {
    var did = $stateParams.did;
    var cmds_observer = function() {
        $scope.cmds = deviceService.devices[did] ? deviceService.devices[did].cmds : [];
    };
    $scope.device = deviceService.devices[did];

    $scope.sendCmd = function(cmd) {
        deviceService.sendCommand(did, cmd);
    };

    deviceService.observers.push(cmds_observer);
    cmds_observer();
}