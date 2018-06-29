/**
 * Created by M & Raúl Sandoval  2018
 */
'use strict';

angular.module('myApp.dashboard.dashboardAdministradorMES', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboard/administradorMES', {
            templateUrl: 'dashboard/administrador/dashboardAdministradorMES.html',
            controller: 'dashboardAdministradorMESCtrl'
        });
    }])

    .controller('dashboardAdministradorMESCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$mdDialog', '$http', '$filter',
        function ($scope, $firebaseObject, $firebaseArray, $mdDialog, $http, $filter) {

            var user = window.currentAppSalon;
            var usuarioLogeado = "";

          

            $scope.resumenDia = {

                serviciosRealizados: 0,
                totalDia: 0,
                totalDiaConBase: 0,
                clientesAtendidos: 0,
                totalTransbank: 0,
                totalDebito: 0,
                totalCredito: 0,
                totalEfectivo: 0,
                totalGiftCard: 0,
                totalDescuento:0

            };
            $scope.totalGananciaDia = 0;

            $scope.resumenDiaGanancia = {

                serviciosRealizados: 0,
                totalDia: 0,
                clientesAtendidos: 0
            };
            $scope.servRealizados = [];
            $scope.products = [];
            $scope.clientesAtendidos = [100];

            $scope.usuarioLogeado = user;
            console.log($scope.usuarioLogeado);

            var buscarClientes = firebase.database().ref().child('clientes');
            var buscarClientesER = $firebaseArray(buscarClientes);
            buscarClientesER.$loaded().then(function () {
                           $scope.clientes = buscarClientesER;
           });

            var buscarTrabajadoras = firebase.database().ref().child('trabajadoras');
            var buscarTrabajadorasER = $firebaseArray(buscarTrabajadoras);
            buscarTrabajadorasER.$loaded().then(function () {
                $scope.trabajadoras = buscarTrabajadorasER;
                console.log($scope.trabajadoras);


            });
            var buscarServicios = firebase.database().ref().child('servicios');
            var buscarServiciosER = $firebaseArray(buscarServicios);
            buscarServiciosER.$loaded().then(function () {
                $scope.servicios = buscarServiciosER;
                console.log($scope.servicios);


            });
            var buscarCategorias = firebase.database().ref().child('categorias');
            var buscarCategoriasER = $firebaseArray(buscarCategorias);
            buscarCategoriasER.$loaded().then(function () {
                $scope.categorias = buscarCategoriasER;
            });

            var buscarBoletaCreada = firebase.database().ref().child('jornadas');

            var buscarBoletaCreadaER = $firebaseArray(buscarBoletaCreada);
            console.log(buscarBoletaCreadaER);
            buscarBoletaCreadaER.$loaded().then(function () {
                $scope.alljornadas = buscarBoletaCreadaER;
                 console.log($scope.alljornadas);
                $scope.alljornadas.forEach(function (x) {
                    var a = firebase.database().ref().child('jornadas/' +x.$id+ '/ordenes');
                    var ja = $firebaseArray(a);
                    console.log(x.$id);
    ja.$loaded().then(function () {
 
      
        ja.forEach(function (p) {
          
            if(p.realizado == true){

                  
                for (var i = 0; $scope.trabajadoras.length > i; i++) {

                    if (p.idTrabajadora == $scope.trabajadoras[i].$id) {
    if (isNaN($scope.trabajadoras[i].total) || $scope.trabajadoras[i].total == null) {
                        $scope.trabajadoras[i].total = 1;
                        
                        
    }else{
        $scope.trabajadoras[i].total =  $scope.trabajadoras[i].total +1;
       
    }

                    }
                   
                }

                for (var i = 0; $scope.servicios.length > i; i++) {

                    if (p.descripcion == $scope.servicios[i].descripcion) {
    if (isNaN($scope.servicios[i].total) || $scope.servicios[i].total == null) {
                        $scope.servicios[i].total = 1;
                        
                        
    }else{
        $scope.servicios[i].total =  $scope.servicios[i].total +1;
       
    }

                    }
                   
                }

                for (var i = 0; $scope.categorias.length > i; i++) {

                    if (p.categoria == $scope.categorias[i].id) {
    if (isNaN($scope.categorias[i].total) || $scope.categorias[i].total == null) {
                        $scope.categorias[i].total = 1;
                        
                        
    }else{
        $scope.categorias[i].total =  $scope.categorias[i].total +1;
       
    }

                    }
                   
                }
                  
            }
        })});
                   
            




          
                })
                console.log($scope.trabajadoras);
                console.log($scope.servicios);         

           
                for (var i = 0; $scope.categorias.length > i; i++) {

                    
 
                     
                        
                        
 
        console.log($scope.categorias[i].id,$scope.categorias[i].total)
       
  

                    
                   
                }
                
            });

        }]);