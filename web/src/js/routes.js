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

        $httpProvider.interceptors.push(['$injector', function($injector) {
            // var $state = $injector.get('$state');
            var requestInterceptor = {
                request: function(config) {            
                    return config;
                },
                response: function(response) {
                    if (response.status === 401) {
                        $injector.invoke(function($state) {
                            // $state.go('index');
                        });
                    }
                    return response;
                }
            };
            return requestInterceptor;
        }]);
    }
]);

angular.module('Persica').run(['$window', '$rootScope', '$state', '$http', 'userService', 'loginModalService', function ($window, $rootScope, $state, $http, userService, loginModalService) {
    $rootScope.user = {};
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var storedUser;
        try {
            storedUser = JSON.parse($window.localStorage['persica-user']);
        } catch (err) {
            storedUser = false;
        }
        
        var requireLogin = toState.data.requireLogin;
        if (storedUser && storedUser.token && typeof $rootScope.currentUser === 'undefined') {
            // The case we need to fill in the user in scope
            userService.authorizeUser(storedUser);
            return;
        } else if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
            event.preventDefault();
            loginModalService()
            .then(function (user) {
                userService.authorizeUser(user);                
                $state.go(toState.name, toParams);   
            })
            .catch(function(err) { // Hopefully defunct as modal handles everything
                // There was a horrible error
                console.log('An error occured.');
            });
        }
    });

}]);