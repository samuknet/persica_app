/**
 * Dashboard Controller
 */

angular
    .module('Persica')
    .controller('DashboardCtrl', ['$scope', 'deviceService', DashboardCtrl]);

function DashboardCtrl($scope, deviceService) {
	var devices_observer = function() {
		$scope.deviceCount = Object.keys(deviceService.devices ? deviceService.devices : []).length;
	};

    deviceService.observers.push(devices_observer);
    devices_observer();
}

angular
    .module('Persica')
    .controller('ChatCtrl', ['$scope',  'chatService', ChatCtrl]);
function ChatCtrl($scope, chatService) {
    var chat_observer = function() {
        $scope.messages = chatService.messages;
    };

    $scope.sendMessage = function(from, msg) {
    	chatService.sendMessage({from: from, msg: msg});
    };

    chatService.observers.push(chat_observer);
    chat_observer();
}