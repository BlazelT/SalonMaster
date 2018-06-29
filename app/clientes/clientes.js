'use strict';

angular.module('myApp.clientes', ['ngRoute'])  

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/clientes', {
    templateUrl: 'clientes/clientes.html',
    controller: 'clientesCtrl'
  });
}])

.controller('clientesCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$mdDialog',
    function($scope ,$firebaseObject, $firebaseArray,$filter,$mdDialog) {
       
        var user = window.currentAppSalon ;
        $scope.user= user;

        $scope.editListing = false;
       console.log(user);

        $(servicios).removeClass( "active" );
        $(ordenes).removeClass( "active" );
        $(cobros).removeClass( "active" );
        $(pagos).removeClass( "active" );
        $(administrar).removeClass( "active" );
        $(dashboard).removeClass( "active" );
        $(clientes).addClass( "active" );

        var buscarClientes = firebase.database().ref().child('clientes');
        var buscarClientesER = $firebaseArray(buscarClientes);
        buscarClientesER.$loaded().then(function () {
                       $scope.clientes = buscarClientesER;
       });

       var buscarCategorias = firebase.database().ref().child('categorias');
       var buscarCategoriasER = $firebaseArray(buscarCategorias);
       buscarCategoriasER.$loaded().then(function () {
                      $scope.categorias = buscarCategoriasER;
      });

       $scope.seleccionarCliente = function ()
       {
         
           
       /*   //llenar datos
        $scope.clientes.forEach(function (x) {
        firebase.database().ref('clientes/'+x.$id).update({
            debe:false
             });
            });
           */
        $scope.clientes.forEach(function (x) {
           $scope.editListingClientes = true;
               if(x.nombre === $scope.selected.originalObject.nombre){
                 //$scope.clienteSeleccionadaAutocomplete = x;
                 $scope.seleCliente = x;
               }
           });
           console.log($scope.seleCliente);
       };



       $scope.guardarNota = function(){
       
console.log($scope.seleCliente.nota);
        firebase.database().ref('clientes/'+$scope.seleCliente.$id).update
        ({
           
          nota: $scope.seleCliente.nota
         
            });
            console.log($scope.seleCliente);
       };

       $scope.numberwithCommas = function (x) {
        //   console.log(x);
           return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
       }
    }]);