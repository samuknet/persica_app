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
  .controller('OnlineDeviceCtrl', ['$scope', '$stateParams', '$state', '$timeout', 'groupService', 'deviceService', OnlineDeviceCtrl]);

function OnlineDeviceCtrl($scope, $stateParams, $state, $timeout, groupService, deviceService) {
    var gid = $stateParams.gid;
    
    var group_devices_observer = function() {
        $scope.devices = []
        if (groupService.groups[gid]) {
            _.forEach(groupService.groups[gid].dids, function(did) {

                if (deviceService.devices[did]) {
                    $scope.devices.push(deviceService.devices[did]);
                }
                

          });

        }
    };
        $scope.navigateToDevice = function(did) { // Called when device table row is clicked
        // Navigate to device profile page
        $state.go('device', {did: did});
    };

    groupService.observers.push(group_devices_observer);
    deviceService.observers.push(group_devices_observer);
    group_devices_observer();
}

/**
 * Device Cmds Controller
 */
angular
    .module('Persica')
    .controller('GroupCmdsCtrl', ['$scope', '$stateParams', 'deviceService', 'groupService', GroupCmdsCtrl]);

function GroupCmdsCtrl($scope, $stateParams, deviceService, groupService) {
    var gid = $stateParams.gid;
    var cmds_observer = function() {
        $scope.cmds = [];
        var dids = groupService.groups[gid] ? groupService.groups[gid].dids : [];

        _.forEach(dids, function (did) {
            var currDeviceCmds = deviceService.devices[did] ? deviceService.devices[did].cmds : null;
            if (currDeviceCmds) {
                $scope.cmds = $scope.cmds.concat(currDeviceCmds);
            }
        });
    };

    $scope.groupCmd = function(cmd) {
        groupService.groupCommand(gid, cmd);
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

angular.module('Persica').controller('GroupLogsCtrl', ['$scope', '$stateParams', 'groupService', 'deviceService', function($scope, $stateParams, groupService, deviceService) {
    var gid = $stateParams.gid;
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
        $scope.logs = [];
        var dids  = groupService.groups[gid] ? groupService.groups[gid].dids : [];
        _.forEach(dids, function(did) {
            if (deviceService.devices[did] && deviceService.devices[did].logs) {
                $scope.logs = $scope.logs.concat(_.map(deviceService.devices[did].logs, function(log) {
                    return _.extend(log, {did: did});
                }));
            }
        });
    };

    deviceService.observers.push(logs_observer);
    logs_observer();
}]);
