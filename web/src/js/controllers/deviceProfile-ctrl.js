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
        $scope.cmds = deviceService.devices[did] ? deviceService.devices[did].cmds : ['hi'];
    };
    $scope.device = deviceService.devices[did];

    $scope.sendCmd = function(cmd) {
        deviceService.sendCommand(did, cmd);
    };

    deviceService.observers.push(cmds_observer);
    cmds_observer();
}
