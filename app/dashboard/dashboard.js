/**
 * Created by M on 25-09-2017.
 */
'use strict';

angular.module('myApp.dashboard', [
    'ngRoute',
    'myApp.dashboard.dashboardTrabajadoraDIA',
    'myApp.dashboard.dashboardAdministradorDIA',
    'myApp.dashboard.dashboardAdministradorMES',
   

])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'dashboardCtrl'
        });
    }])

    .controller('dashboardCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$mdDialog', '$http','$filter',
        function($scope,$firebaseObject, $firebaseArray, $mdDialog,$http,$filter) {

            var user = window.currentAppSalon ;
            var usuarioLogeado = "";
            $(servicios).removeClass( "active" );
            $(ordenes).removeClass( "active" );
            $(cobros).removeClass( "active" );
            $(pagos).removeClass( "active" );
            $(administrar).removeClass( "active" );
            $(dashboard).addClass( "active" );
            $(clientes).removeClass( "active" );
            
            $scope.resumenDia = { 
   
              serviciosRealizados:0,
                totalDia : 0,
                totalDiaConBase :0,
                clientesAtendidos:0
           };
           $scope.servRealizados=[];
            $scope.products=[];
            $scope.clientesAtendidos=[100];
            
          $scope.usuarioLogeado = user;
          
        
            $scope.a= $firebaseObject(firebase.database().ref().child('trabajadoras').child($scope.usuarioLogeado.uid));
           

          var buscarTrabajadoras = firebase.database().ref().child('trabajadoras');
          var buscarTrabajadorasER = $firebaseArray(buscarTrabajadoras);
          buscarTrabajadorasER.$loaded().then(function () {   
            $scope.trabajadoras = buscarTrabajadorasER;
              console.log($scope.trabajadoras);
          });   

          var buscarCategorias = firebase.database().ref().child('categorias');
          var buscarCategoriasER = $firebaseArray(buscarCategorias);
          buscarCategoriasER.$loaded().then(function () {
                         $scope.categorias = buscarCategoriasER;
         });
         
          var buscarBoletaCreada = firebase.database().ref().child('boletaCreada');

          var buscarBoletaCreadaER = $firebaseArray(buscarBoletaCreada);
          console.log(buscarBoletaCreadaER);
          buscarBoletaCreadaER.$loaded().then(function () {
              $scope.allBoletas = buscarBoletaCreadaER;
              // console.log($scope.allBoletas);
              $scope.allBoletas.forEach(function (x) {
                  //  console.log(x.ordenes);
                  //si no ha sido pagada y estan en la fecha de hoy
         //         console.log(x.diaBoleta);
           //       console.log(fechaHoy);
                  if((x.pagado == true)&(x.diaBoleta == obtenerFechaHoy())) {
                //      console.log($scope.ordenes);
                      $scope.ordenes = Object.keys(x.ordenes);

                      //   console.log($scope.ordenes);
                     
                      x.ordenesRealizadas = [];
                      $scope.ordenes.forEach(function (j) {
                          var traerOrdenes = firebase.database().ref().child('ordenes/' + j);
                          var traerOrdenesER = $firebaseObject(traerOrdenes);
                          traerOrdenesER.$loaded().then(function () {
                              //console.log(traerOrdenesER);
                              //validacion para traer
                              
                              if (traerOrdenesER.realizado != false&&$scope.usuarioLogeado.uid==traerOrdenesER.idTrabajadora) {
                                  //filtro que si ya ha sido paga quite. esribe en la boleta.
                                /*  $scope.categorias.forEach(function(j){
                                  if(traerOrdenesER.categoria==$scope.categorias.id){

                                    $scope.categorias.forEach(function (j) {
                                        var traerPorcentajes = firebase.database().ref().child('Porcentajes/' + j);
                                        var traerPorcentajesER = $firebaseObject(traerPorcentajes);
                                        traerOrdenesER.$loaded().then(function (){  



                                           });

                                    });
                                  
                                  }
                                  });*/
                                
                                  x.ordenesRealizadas.push(traerOrdenesER);
                                  $scope.servRealizados.push(traerOrdenesER);
                                console.log($scope.servRealizados, "asdasd");
                                  $scope.resumenDia.totalDia  += (traerOrdenesER.psDescuento*$scope.getPorcentaje(traerOrdenesER.categoria,traerOrdenesER.idTrabajadora)/100);
                                 if(traerOrdenesER.categoria != 14){
                                  $scope.resumenDia.serviciosRealizados++;}
                              
                                  for(var i =0;i<$scope.clientesAtendidos.length;i++){
                                      if($scope.clientesAtendidos[i] !=traerOrdenesER.nombreCliente){
                                        $scope.clientesAtendidos[i] = traerOrdenesER.nombreCliente;
                                        $scope.resumenDia.clientesAtendidos++;
                                      }
                                  }
                           console.log($scope.resumenDia.serviciosRealizados);
                                  console.log($scope.resumenDia.totalDia);
                               
                              }


                          });

                      });
                    
                        }


                  }
              );/*
              if((($scope.getSueldo($scope.usuarioLogeado))>=$scope.resumenDia.totalDia)&&$scope.resumenDia.serviciosRealizados>0){
                $scope.resumenDia.totalDia=$scope.getSueldo($scope.usuarioLogeado);
            
            }
    */    console.log(user.uid);
    console.log($scope.getSueldo(user.uid));
    $scope.resumenDia.totalDiaConBase= $scope.getSueldo(user.uid);
    if($scope.resumenDia.totalDiaConBase>=$scope.resumenDia.totalDia&&$scope.resumenDia.serviciosRealizados>0){
        $scope.resumenDia.totalDiaConBase= $scope.resumenDia.totalDia;
    }
    console.log($scope.resumenDia.totalDiaConBase);
          });
      
  $scope.getSueldo = function(trabajadora){
    firebase.database().ref().child('trabajadoras').child(trabajadora).on('value',function(snapshot){
          $scope.b= snapshot.val().sueldoBase;
      });
      return $scope.b;
    }
        $scope.getPorcentaje = function(categoria,trabajadora){
    
            firebase.database().ref().child('trabajadoras/'+trabajadora+'/servicios/' + categoria).on('value',function(snapshot){
    $scope.a = snapshot.val();
   
            });
    return $scope.a;     
              };


                    $scope.doPrimaryAction = function(event) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .title('Primary Action')
                                .textContent('Primary actions can be used for one click actions')
                                .ariaLabel('Primary click demo')
                                .ok('Awesome!')
                                .targetEvent(event)
                        );
                    };

                    $scope.doSecondaryAction = function(event) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .title('Promociones')
                                .textContent('Aquí informaremos como hacer una promoción')
                                .ariaLabel('Secondary click demo')
                                .ok('Neat!')
                                .targetEvent(event)
                        );
                    };

            $scope.doSecondaryAction = function(event) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('Promociones')
                        .textContent('Aquí informaremos como hacer una promoción')
                        .ariaLabel('Secondary click demo')
                        .ok('Neat!')
                        .targetEvent(event)
                );
            };


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
                    firebase.database().ref('sugerencias/'+(user.$id || user.uid)+'/'+ new Date().getTime()).update
                    ({
                        id: (user.$id || user.uid),
                            mensaje : result

                        }
                    );


                }, function() {
                    $scope.status = ' : Estaremos atentos ';
                });
            };

       

  //HELPERS*****************************************************************************

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