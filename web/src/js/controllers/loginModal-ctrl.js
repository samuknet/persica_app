/**
 * Login Modal Controller
 */

angular.module('Persica')
    .controller('LoginModalCtrl', ['$scope', '$http', '$uibModal', '$uibModalInstance', LoginModalCtrl]);

function LoginModalCtrl($scope, $http, $uibModal, $uibModalInstance) {
    var errorMsg = function(msg) {
        $scope.alertClass = 'alert alert-danger';
        $scope.alertMsg = msg;
    };

    var infoMsg = function (msg) {
        $scope.alertClass = 'alert alert-info';
        $scope.alertMsg = msg;
    };

    infoMsg('Please login.');

    $scope.login = function (username, password) {
        $http.post('/login', {username: username, password:password}).then(function (response) {
            $uibModalInstance.close(response.data.token);
        }, function (response) {
           $scope.alertClass='alert alert-danger';                             
            if (response.status === 401) {
               errorMsg('Tom I know this is you.  Go to Bellushis instead.');
            } else {
                if (response.data.message) {
                    errorMsg(response.data.message);
                } else {
                    errorMsg('An unknown error occured while logging in.');
                }
            } 
        }); 
    };

    $scope.openRegisterModal = function() {
         var modal = $uibModal.open({
          templateUrl: 'templates/modals/registerModal.html',
          controller: 'RegisterModalCtrl',
         });
         modal.result.then(function(user) {
            infoMsg('Account created successfully.  Username is ' + user.username +'.');
             // We can close the login modal once registering is complete, as we have a token.
             $uibModalInstance.close(user);
         });
    };
}

