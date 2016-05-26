/**
 * Dashboard Controller
 */

angular
    .module('Persica')
    .controller('DashboardCtrl', ['$scope', 'deviceService', DashboardCtrl]);

function DashboardCtrl($scope, deviceService) {
	var devices_observer = function() {
		$scope.deviceCount = Object.keys(deviceService.devices).length;
	};

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
    deviceService.observers.push(devices_observer);
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

angular
  .module('Persica')
  .controller('TimeCtrl', ['$scope', '$timeout', 'deviceService', TimeCtrl]);

function TimeCtrl($scope, $timeout, deviceService) {
	var updateTimerOnlineStatus = function () {
	 	$scope.online = deviceService.devices[500] ? deviceService.devices[500].online : false; 
	};
    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000; //ms
    $scope.lastConnected = 1464269000000; // dummy last connected

    var tick = function() {
    		var upTime = Math.floor((Date.now() - $scope.lastConnected)/1000);
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


    deviceService.observers.push(updateTimerOnlineStatus);
    updateTimerOnlineStatus();
    // Start the timer
    $timeout(tick, $scope.tickInterval);
}