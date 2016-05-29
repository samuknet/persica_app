angular.module('Persica')
       .service('loginModalService', ['$rootScope', '$uibModal', function ($rootScope, $uibModal) {
  function assignCurrentUser (user) {
    $rootScope.currentUser = user;
    return user;
  }

  return function() {
    var instance = $uibModal.open({
      templateUrl: 'templates/modals/loginModal.html',
      controller: 'LoginModalCtrl',
      backdrop: 'static',
      keyboard: false
    });

    return instance.result.then(assignCurrentUser);
  };
}]);