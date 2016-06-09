/**
 * Device Profile Controller
 */
angular
    .module('Persica')
    .controller('GroupProfileCtrl', ['$scope', '$stateParams', '$http', 'deviceService', GroupProfileCtrl]);

function GroupProfileCtrl($scope, $stateParams, $http, deviceService) {
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
  .controller('OnlineDeviceCtrl', ['$scope', '$stateParams', '$timeout', 'deviceService', OnlineDeviceCtrl]);

function OnlineDeviceCtrl($scope, $stateParams, $timeout, deviceService) {

}

/**
 * Device Cmds Controller
 */
angular
    .module('Persica')
    .controller('GroupCmdsCtrl', ['$scope', '$stateParams', 'deviceService', GroupCmdsCtrl]);

function GroupCmdsCtrl($scope, $stateParams, deviceService) {
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
    .controller('GroupLogsCtrl', ['$scope', '$stateParams', '$uibModal', 'deviceService', GroupLogsCtrl]);

function GroupLogsCtrl($scope, $stateParams, $uibModal, deviceService) {
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
