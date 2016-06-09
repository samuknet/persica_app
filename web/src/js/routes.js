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
            })
            .state('group', {
                url: '/group/:gid',
                templateUrl: 'templates/group.html',
                data: {requireLogin: true}
            });

        $httpProvider.interceptors.push(['$injector', function($injector) {
            var requestInterceptor = {
                request: function(config) {            
                    return config;
                },
                response: function(response) {
                    if (response.status === 401) {
                        
                    }
                    return response;
                }
            };
            return requestInterceptor;
        }]);
    }
]);

angular.module('Persica').run(['$window', '$rootScope', '$state', '$http', 'userService', 'loginModalService', function ($window, $rootScope, $state, $http, userService, loginModalService) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {        
        var storedToken = $window.localStorage['persica-token'];
        
        var requireLogin = toState.data.requireLogin;
        if (storedToken && !userService.currentUser) {
            // The case we need to fill in the user in scope
            userService.authorizeUser(storedToken);
            return;
        } else if (requireLogin && !userService.currentUser) {
            event.preventDefault();
            loginModalService()
            .then(function (token) {
                userService.authorizeUser(token).then(function () {
                    $state.go(toState.name, toParams);   
                });
            })
            .catch(function(err) { // Hopefully defunct as modal handles everything
                // There was a horrible error
                console.log('An error occured.');
            });
        }
    });

}]);