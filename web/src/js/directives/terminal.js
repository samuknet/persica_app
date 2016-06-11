angular.module('Persica').directive('terminal', ['daemonService', function(daemonService) {
  return {
    template: '<div></div>',
    link: function(scope, element) {
    	element = element[0];
	    daemonService.connectToDaemon(scope.did, element);
    },
    scope: {
    	did: "@did"
    }
  };
}]);