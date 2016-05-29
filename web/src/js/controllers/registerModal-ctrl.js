/**
 * Register Modal Controller
 */

angular.module('Persica')
    .controller('RegisterModalCtrl', ['$scope', '$http', '$uibModalInstance', RegisterModalCtrl]);

function RegisterModalCtrl($scope, $http, $uibModalInstance) {
    var errorMsg = function(msg) {
        $scope.alertClass = 'alert alert-danger';
        $scope.alertMsg = msg;
    };

    var infoMsg = function (msg) {
        $scope.alertClass = 'alert alert-info';
        $scope.alertMsg = msg;
    };

    infoMsg('Please register');

    $scope.register = function (username, password, confirmPassword) {

        if (password !== confirmPassword) {
            return errorMsg('Passwords do not match.');
        }

        $http.post('/register', {username: username, password:password}).then(function (response) {
            // If registering was successful then just forward the new user data (including token) to the login modal
            $uibModalInstance.close(response.data);
        }, function (response) {
            if (response.data.message) {
                errorMsg(response.data.message);
            } else {
                errorMsg('An unknown error occured while registering.');
            }
         
        }); 
    };
}

