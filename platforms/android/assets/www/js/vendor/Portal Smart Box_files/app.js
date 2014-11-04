'use strict';


// Declare app level module which depends on filters, and services
angular.module('portalSMB', [
    'ngRoute',
    'ngTouch',
    'portalSMB.filters',
    'portalSMB.services',
    'portalSMB.directives',
    'portalSMB.controllers',
    'ng-iscroll',
    'LocalStorageModule'
]).
        config(['$routeProvider', function($routeProvider) {
                $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'homeCtrl'});
                $routeProvider.when('/networkUpgrade', {templateUrl: 'partials/networkUpgrade.html', controller: 'networkUpgradeCtrl'});
                $routeProvider.when('/fileSystem', {templateUrl: 'partials/fileSystem.html', controller: 'fileSystemCtrl'});
                $routeProvider.when('/VOB', {templateUrl: 'partials/VOB.html', controller: 'VOBCtrl'});
                $routeProvider.when('/WiFi', {templateUrl: 'partials/WiFi.html', controller: 'WiFiCtrl'});
                $routeProvider.when('/connectionsMaps', {templateUrl: 'partials/connectionsMaps.html', controller: 'connectionsMapsCtrl'});
                $routeProvider.when('/boxOperations', {templateUrl: 'partials/boxOperations.html', controller: 'boxOperationsCtrl'});
                $routeProvider.otherwise({redirectTo: '/'});
            }],
                ['localStorageServiceProvider', function(localStorageServiceProvider) {
                        localStorageServiceProvider.setPrefix('portalSMBPrefix');
                        // localStorageServiceProvider.setStorageCookieDomain('example.com');
                        // localStorageServiceProvider.setStorageType('sessionStorage');
                    }],
                ['$locationProvider', function($locationProvider){
                        $locationProvider.html5Mode(true);
                }]);
