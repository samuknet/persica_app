/**
 * Device Profile Controller
 */
angular
    .module('Persica')
    .controller('DeviceProfileCtrl', ['$scope', '$stateParams', '$uibModal', 'deviceService', DeviceProfileCtrl]);

function DeviceProfileCtrl($scope, $stateParams, $uibModal, deviceService) {
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

    $scope.openRaiseTicketModal = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/templates/modals/raiseTicketModal.html',
            controller: 'RaiseTicketModalCtrl',
            resolve:  {
                did: function() {
                    return did;
                }
            }
        });
    }
}

angular
  .module('Persica')
  .controller('TimeCtrl', ['$scope', '$stateParams', '$timeout', 'deviceService', TimeCtrl]);

function TimeCtrl($scope, $stateParams, $timeout, deviceService) {
    var did = $stateParams.did;

    var updateConnectionTimes = function() {
        $scope.establishTime = deviceService.devices[did] ? deviceService.devices[did].establishTime : 0;

        $scope.lastOnline = deviceService.devices[did] ? deviceService.devices[did].lastOnline : 0;
    };
    deviceService.observers.push(updateConnectionTimes);
    updateConnectionTimes();

    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000; //ms

    var tick = function() {
            var upTime = Math.floor((Date.now() - $scope.establishTime)/1000);
            var timeVars = ['sec', 'min', 'hour', 'day'];

            var stringTime = '';
            for (var k = 0; k < timeVars.length; k++) {
                if (upTime>0) {
                    var up = upTime%60
                    var word = timeVars[k] + ( up!==1 ? 's': '');
                    stringTime = up + ' ' + word + ', ' + stringTime;
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
        $scope.cmds = deviceService.devices[did] ? deviceService.devices[did].cmds : [];
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
    .controller('DeviceVarsCtrl', ['$scope', '$stateParams', '$uibModal', 'deviceService', DeviceVarsCtrl]);

function DeviceVarsCtrl($scope, $stateParams, $uibModal, deviceService) {
    var did = $stateParams.did;

    $scope.openGraphModal = function(varName) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/templates/modals/deviceVariableGraphModal.html',
            controller: 'DeviceVariableGraphModalCtrl',
            resolve: {
                did: function() {
                    return did;
                },
                varHandle: function () {
                    return varName;
                }
            }
        });
    };

    var vars_observer = function() {
        var device = deviceService.devices[did];
        $scope.liveVars = device ? device.liveVars : {};
    }
    deviceService.observers.push(vars_observer);
    vars_observer();
}

/* Controller for the graph modal for a device variable */
angular.module('Persica').controller('DeviceVariableGraphModalCtrl', ['$scope', '$uibModalInstance', '$http', 'deviceService', 'did', 'varHandle', function($scope, $uibModalInstance, $http, deviceService, did, varHandle) {
    $scope.varHandle = varHandle;
    var varUpdates = deviceService.devices[did].varUpdates;
        varUpdates = _.filter(varUpdates, function (update) { return update.handle === varHandle; });
    $scope.data = [_.pluck(varUpdates, 'value')];
    $scope.labels = _.pluck(varUpdates, 'timestamp');
    $scope.series = [varHandle];
    $scope.options = {
      
      showScale: false,
      showTooltips: true,
      pointDot: false,
      datasetStrokeWidth: 1,
      pointDotRadius: 1,
    };
    $scope.close = function() {
        $uibModalInstance.close();
    }
}]);

/* Controller for the graph modal for a device variable */
angular.module('Persica').controller('DeviceLogsCtrl', ['$scope', '$stateParams', 'deviceService', function($scope, $stateParams, deviceService) {
    var did = $stateParams.did;
    $scope.test = '';
    // Styles for each critical value
    $scope.criticalStyles = [{
        'background-color': '#FFFFFF'
    }, {
        'background-color': '#F5FAA0'
    }, {
        'background-color': '#FAD173'
    }, {
        'background-color': '#FAB005'
    }, {
        'background-color': '#FA8405'
    }, {
        'background-color': '#FA3A05'
    }];
    var logs_observer = function() {
        $scope.logs = deviceService.devices[did] ? deviceService.devices[did].logs : [];
    };

    deviceService.observers.push(logs_observer);
    logs_observer();
}]);


/* Controller for the graph modal for a device variable */
angular.module('Persica').controller('DaemonCtrl', ['$scope', '$stateParams', '$document', 'deviceService', 'daemonService', function($scope, $stateParams, $document, deviceService, daemonService) {
    var did = $stateParams.did;
    $scope.did = did;
}]);