'use strict';

angular.module('myApp.sugerencias', [
    'ngRoute'
   

])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/sugerencias', {
            templateUrl: 'sugerencias/sugerencias.html',
            controller: 'sugerenciasCtrl'
        });
    }])

    .controller('sugerenciasCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$mdDialog', '$http','$filter',
        function($scope,$firebaseObject, $firebaseArray, $mdDialog,$http,$filter) {

            var user = window.currentAppSalon ;
            var usuarioLogeado = "";
         
     
          $scope.usuarioLogeado = user;
          
        
            $scope.usuario= $firebaseObject(firebase.database().ref().child('trabajadoras').child($scope.usuarioLogeado.uid));
           

            var buscarTrabajadoras = firebase.database().ref().child('trabajadoras');
            var buscarTrabajadorasER = $firebaseArray(buscarTrabajadoras);
            buscarTrabajadorasER.$loaded().then(function () {   
              $scope.trabajadoras = buscarTrabajadorasER;
                console.log($scope.trabajadoras);
            });   

            var sugerencias = firebase.database().ref().child('sugerencias');
            var sugerenciasER = $firebaseArray(sugerencias);
            sugerenciasER.$loaded().then(function () {   
              $scope.sugerencias = sugerenciasER;
                console.log($scope.sugerencias);
            });   
 

            $scope.showPrompt = function(ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.prompt()
                    .title('¿Que Sugerencia te gustaria realizar?')
                    .textContent('Cada observación puede ser util! animate y escribe')
                    .placeholder('Sugerencia')
                    .ariaLabel('Sugerencia')
                    .initialValue('')
                    .targetEvent(ev)
                    .ok('Comentar!')
                    .cancel('Quizás en otra ocasión');

                $mdDialog.show(confirm).then(function(result) {
                    console.log(result);
                    $scope.status = ' : ¡Gracias por tu Aporte!';


           //actualizo las boletasCreadas
                    firebase.database().ref('sugerencias').push
                    ({
                        id: (user.$id || user.uid),
              nombre: $scope.TrabajadoraName(user.uid),
                            mensaje : result,
                            fecha: new Date().getTime()

                        }
                    );


                }, function() {
                    $scope.status = ' : Estaremos atentos ';
                });
            };

       

  //HELPERS*****************************************************************************
  $scope.TrabajadoraName = function(x){
    
    firebase.database().ref().child('trabajadoras').child(x).on('value',function(snapshot){
$scope.b = snapshot.val().name;

    });
return $scope.b;     
      };

      $scope.modificar = function(tableData){

        console.log(tableData);
        var confirm = $mdDialog.confirm()
        .title('¿Desea eliminar la sugerencia?')
        .ok('Eliminar !')
        .cancel('Cancelar');
        
      
        
        $mdDialog.show(confirm).then(function() {
        
                firebase.database().ref().child('sugerencias/'+tableData.$id).remove();
              
                  
       
            
          });
           
        };

 function obtenerFechaHoy() {
                var dia =new Date().getDate();
                var mes = new Date().getMonth() + 1; // por alguna razón trae el mes anterior
                var ano = new Date().getFullYear();

                var diafinal;
                var mesfinal;
                if(mes < 10)
                {
                    mesfinal = '0' + mes ;
                }else
                {
                    mesfinal = mes;

                }

                if(dia < 10)
                {
                    diafinal = '0' + dia ;
                }else
                {
                    diafinal = dia;

                }

                console.log('esto es un intento de fecha =' + diafinal + mesfinal + ano);

                return diafinal + mesfinal + ano;
            }

          
            $scope.numberwithCommas = function (x) {
                //   console.log(x);
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }]);