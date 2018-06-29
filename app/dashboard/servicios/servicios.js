/**
 * Created by M on 25-09-2017.
 */
'use strict';

angular.module('myApp.servicios', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/dashboard/servicios', {
            templateUrl: 'dashboard/servicios/servicios.html',
            controller: 'serviciosCtrl'
        });
    }])
    .controller('serviciosCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$mdDialog', '$http',
        function($scope,$firebaseObject, $firebaseArray, $mdDialog,$http) {


        }]);