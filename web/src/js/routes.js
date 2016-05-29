'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('Persica').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html',
                data: {requireLogin: true}            
            })
            .state('tables', {
                url: '/tables',
                templateUrl: 'templates/tables.html'
            })
            .state('device', {
                url: '/device/:did',
                templateUrl: 'templates/device.html',
                data: {requireLogin: true}
            });
    }
]);

angular.module('Persica').run(['$rootScope', '$state', '$http', 'loginModalService', function ($rootScope, $state, $http, loginModalService) {
    $rootScope.user = {};
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
            event.preventDefault();
            loginModalService()
            .then(function (user) {
                console.log(user);
                $http.defaults.headers.common.Authorization = 'Bearer ' + user.token;
                $state.go(toState.name, toParams);   
            })
            .catch(function(err) { // Hopefully defunct as modal handles everything
                // There was a horrible error
                console.log('An error occured.');
            });
        }
        // Otherwise just carry on as normal
    });

}]);