/**
 * Device Profile Controller
 */
angular
    .module('Persica')
    .controller('GroupProfileCtrl', ['$scope', '$stateParams', '$http', 'groupService', GroupProfileCtrl]);

function GroupProfileCtrl($scope, $stateParams, $http, groupService) {
    var gid = $stateParams.gid;
    var group_observer = function() {
        $scope.group = groupService.groups[gid];
    };
    groupService.observers.push(group_observer);
    group_observer();
}

angular
  .module('Persica')
  .controller('OnlineDeviceCtrl', ['$scope', '$stateParams', '$timeout', 'groupService', 'deviceService', OnlineDeviceCtrl]);

function OnlineDeviceCtrl($scope, $stateParams, $timeout, groupService, deviceService) {
    var gid = $stateParams.gid;

    var group_devices_observer = function() {
        $scope.devices = []
        if (groupService.groups[gid]) {
            _.forEach(groupService.groups[gid].dids, function(did) {
            $scope.devices.push(deviceService.devices[did]);

        });
        }

    };

    groupService.observers.push(group_devices_observer);
    group_devices_observer();
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
