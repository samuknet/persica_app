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
    
    $scope.labels = ["22nd January 2016", "15th March 2016", "7th April 2016", "ello", "sd", "asd"];
    $scope.upTime = [50 , 20, 60, 20, 10, 40];
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

angular
  .module('Persica')
  .controller('TimeCtrl', ['$scope', '$stateParams', '$timeout', 'deviceService', TimeCtrl]);

function TimeCtrl($scope, $stateParams, $timeout, deviceService) {
    var did = $stateParams.did;

    var updateConnectionTimes = function() {
        $scope.establishTime = deviceService.devices[did] ? deviceService.devices[did].establishTime : 0; // dummy last connected
        $scope.lastOnline = deviceService.devices[did] ? deviceService.devices[did].lastOnline : 0;
    };

    deviceService.observers.push(updateConnectionTimes);
    updateConnectionTimes();

    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000; //ms
    console.log(deviceService.devices[did]);

    var tick = function() {
            var upTime = Math.floor((Date.now() - $scope.establishTime)/1000);

            var timeVars = ['secs', 'mins', 'hours', 'days'];

            var stringTime = '';
            for (var k = 0; k < timeVars.length; k++) {
                if (upTime>0) {
                    stringTime = upTime%60 + ' ' + timeVars[k] + ', ' + stringTime;
                    upTime = Math.floor(upTime/60);
                } else {
                    break;
                }
            } 
            stringTime = stringTime.slice(0, -2);

            $scope.clock = stringTime;
            $timeout(tick, $scope.tickInterval); // reset the timer
    }

    // Start the timer
    $timeout(tick, $scope.tickInterval);
}

/**
 * Device Cmds Controller
 */
angular
    .module('Persica')
    .controller('DeviceCmdsCtrl', ['$scope', '$stateParams', 'deviceService', DeviceCmdsCtrl]);

function DeviceCmdsCtrl($scope, $stateParams, deviceService) {
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

/**
 * Device Cmds Controller
 */
angular
    .module('Persica')
    .controller('DeviceVarsCtrl', ['$scope', '$stateParams', 'deviceService', DeviceVarsCtrl]);

function DeviceVarsCtrl($scope, $stateParams, deviceService) {
    var did = $stateParams.did;

    var vars_observer = function() {
        
        $scope.vars = deviceService.devices[did] ? deviceService.devices[did].vars : [];
        console.log($scope.vars)
    };
    deviceService.observers.push(vars_observer);
    vars_observer();
}