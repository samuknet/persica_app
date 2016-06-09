/**
 * Settings Modal Controller
 */

angular.module('Persica')
    .controller('SettingsModalCtrl', ['$scope', '$http', '$uibModal', '$uibModalInstance', 'userService' ,SettingsModalCtrlf]);

function SettingsModalCtrlf($scope, $http, $uibModal, $uibModalInstance, userService) {
    var errorMsg = function(msg) {
        $scope.alertClass = 'alert alert-danger';
        $scope.alertMsg = msg;
    };

    var infoMsg = function (msg) {
        $scope.alertClass = 'alert alert-info';
        $scope.alertMsg = msg;
    };
    console.log(userService.currentUser)
    if (userService.currentUser.notifyConfig.length != 6) {
        $scope.levels = [{}, {}, {}, {}, {}, {}];
    } else {
        $scope.levels = userService.currentUser.notifyConfig;
    }
    
    $scope.updateNotificationSettings = function () {
        userService.updateNotificationSettings({notifyConfig : $scope.levels}).then(function (data) {
            $uibModalInstance.close();
            }, function(err) {
                errorMsg("The backend connection threw an uknown error.")
            });
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    }


    

}

