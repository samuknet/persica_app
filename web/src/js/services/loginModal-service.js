angular.module('Persica')
       .service('loginModalService', ['$rootScope', '$uibModal', function ($rootScope, $uibModal) {
  return function() {
    var instance = $uibModal.open({
      templateUrl: 'templates/modals/loginModal.html',
      controller: 'LoginModalCtrl',
      backdrop: 'static',
      keyboard: false
    });

    return instance.result;;
  };
}]);