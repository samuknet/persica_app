/**
 * Dashboard Controller
 */

angular
    .module('Persica')
    .controller('DashboardCtrl', ['$scope', 'deviceService', 'chatService', DashboardCtrl]);

function DashboardCtrl($scope, deviceService, chatService, $uibModal) {

	var devices_observer = function() {
		$scope.deviceCount = Object.keys(deviceService.devices).length;
	};
    deviceService.observers.push(devices_observer);

    var chat_observer = function() {
        $scope.messages = chatService.messages;
    };
    chatService.observers.push(chat_observer);
}

