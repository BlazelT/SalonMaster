/**
 * Created by M on 25-09-2017.
 */
'use strict';

angular.module('myApp.dashboard.dashboardAdministradorDIA', ['ngRoute', 'myApp.servicios'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboard/administrador', {
            templateUrl: 'dashboard/administrador/dashboardAdministradorDIA.html',
            controller: 'dashboardAdministradorDIACtrl'
        });
    }])

    .controller('dashboardAdministradorDIACtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$mdDialog', '$http', '$filter',
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
                   


                    if ((x.pagado == true) & (x.diaBoleta == obtenerFechaHoy())) {
                        //      console.log($scope.ordenes);
                 

                        switch (x.FormaDePago) {
                            case 'Efectivo':

                               $scope.resumenDia.totalEfectivo += x.montoIngresado;
                               $scope.resumenDia.totalEfectivo+= x.montoEfectivo;
                               $scope.resumenDia.totalGiftCard+=x.montoGiftCard;
                               $scope.resumenDia.totalDescuento+=x.descuento;
                              break;
                            case 'TarjetaCredito':
                                //Sentencias ejecutadas cuando el resultado de expresion coincide con valor2
                                $scope.resumenDia.totalCredito += x.montoIngresado;
                                $scope.resumenDia.totalEfectivo+= x.montoEfectivo;
                                $scope.resumenDia.totalGiftCard+=x.montoGiftCard;
                                $scope.resumenDia.totalDescuento+=x.descuento;
                                // $scope.resumenDia.totalEfectivo += traerOrdenesER.montoEfectivo;
                                break;
                            case 'TarjetaDebito':
                                //Sentencias ejecutadas cuando el resultado de expresion coincide con valor2
                                $scope.resumenDia.totalDebito += x.montoIngresado;
                                $scope.resumenDia.totalEfectivo+= x.montoEfectivo;
                                $scope.resumenDia.totalGiftCard+=x.montoGiftCard;
                                $scope.resumenDia.totalDescuento+=x.descuento;
                                // $scope.resumenDia.totalEfectivo += traerOrdenesER.montoEfectivo;
                                break;
                            case 'GiftCard':
                                $scope.resumenDia.totalGiftCard += x.montoIngresado;
                                $scope.resumenDia.totalDescuento+=x.descuento;
                            default:
                                //Sentencias_def ejecutadas cuando no ocurre una coincidencia con los anteriores casos
                                break;
                        }
                        $scope.ordenes = Object.keys(x.ordenes);

                        //   console.log($scope.ordenes);

                        x.ordenesRealizadas = [];
                        $scope.ordenes.forEach(function (j) {
                            var traerOrdenes = firebase.database().ref().child('ordenes/' + j);
                            var traerOrdenesER = $firebaseObject(traerOrdenes);
                            traerOrdenesER.$loaded().then(function () {
                                //console.log(traerOrdenesER);
                                //validacion para traer
                                $scope.perdidaSueldo = 0;
                                if (traerOrdenesER.realizado != false) {
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
                                    console.log(traerOrdenesER, "ordenes");

                                   
                                  



                                    $scope.resumenDiaGanancia.totalDia += (traerOrdenesER.valor * Math.abs($scope.getPorcentaje(traerOrdenesER.categoria, traerOrdenesER.idTrabajadora) - 100) / 100);
                                    if (traerOrdenesER.categoria != 14) {
                                        $scope.resumenDia.serviciosRealizados++;

                                    }

                                    for (var i = 0; $scope.trabajadoras.length > i; i++) {

                                        if (traerOrdenesER.idTrabajadora == $scope.trabajadoras[i].$id) {
                                            if (isNaN($scope.trabajadoras[i].total) || $scope.trabajadoras[i].total == null) {
                                                $scope.trabajadoras[i].total = (traerOrdenesER.psDescuento * $scope.getPorcentaje(traerOrdenesER.categoria, traerOrdenesER.idTrabajadora) / 100);


                                            }
                                            else {
                                                $scope.trabajadoras[i].total += (traerOrdenesER.psDescuento * $scope.getPorcentaje(traerOrdenesER.categoria, traerOrdenesER.idTrabajadora) / 100);
                                            }
                                        }
                                    }



                                    for (var i = 0; i < $scope.clientesAtendidos.length; i++) {
                                        if ($scope.clientesAtendidos[i] != traerOrdenesER.nombreCliente) {
                                            $scope.clientesAtendidos[i] = traerOrdenesER.nombreCliente;
                                            $scope.resumenDia.clientesAtendidos++;
                                        }
                                    }

                                    for (var i = 0; $scope.trabajadoras.length > i; i++) {

                                        if (isNaN($scope.trabajadoras[i].total) || $scope.trabajadoras[i].total == null) {
                                        } else {
                                            if ($scope.trabajadoras[i].sueldoBase > $scope.trabajadoras[i].total) {
                                                $scope.perdidaSueldo += -$scope.trabajadoras[i].total + $scope.trabajadoras[i].sueldoBase;
                                                $scope.trabajadoras[i].perdida = $scope.trabajadoras[i].sueldoBase - $scope.trabajadoras[i].total;



                                            } else {
                                                $scope.trabajadoras[i].perdida = 0;
                                            }
                                        }
                                    }

                                    $scope.totalGananciaDia = $scope.resumenDiaGanancia.totalDia - $scope.perdidaSueldo -$scope.resumenDia.totalGiftCard -$scope.resumenDia.totalDescuento;

                                }


                            });

                        });

                    }


                }
                );/*
              if((($scope.getSueldo($scope.usuarioLogeado))>=$scope.resumenDia.totalDia)&&$scope.resumenDia.serviciosRealizados>0){
                $scope.resumenDia.totalDia=$scope.getSueldo($scope.usuarioLogeado);
            
            }

            
    */


                console.log(user.uid);
                console.log($scope.getSueldo(user.uid));
                $scope.resumenDia.totalDiaConBase = $scope.getSueldo(user.uid);
                if ($scope.resumenDia.totalDiaConBase >= $scope.resumenDia.totalDia && $scope.resumenDia.serviciosRealizados > 0) {
                    $scope.resumenDia.totalDiaConBase = $scope.resumenDia.totalDia;
                }
                console.log($scope.resumenDia.totalDiaConBase);
            });

            $scope.getSueldo = function (trabajadora) {
                firebase.database().ref().child('trabajadoras').child(trabajadora).on('value', function (snapshot) {
                    $scope.b = snapshot.val().sueldoBase;
                });
                return $scope.b;
            }
            $scope.getPorcentaje = function (categoria, trabajadora) {

                firebase.database().ref().child('trabajadoras/' + trabajadora + '/servicios/' + categoria).on('value', function (snapshot) {
                    $scope.a = snapshot.val();

                });
                return $scope.a;
            };


            $scope.doPrimaryAction = function (event) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('Primary Action')
                        .textContent('Primary actions can be used for one click actions')
                        .ariaLabel('Primary click demo')
                        .ok('Awesome!')
                        .targetEvent(event)
                );
            };

            $scope.doSecondaryAction = function (event) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('Promociones')
                        .textContent('Aquí informaremos como hacer una promoción')
                        .ariaLabel('Secondary click demo')
                        .ok('Neat!')
                        .targetEvent(event)
                );
            };

            $scope.doSecondaryAction = function (event) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('Promociones')
                        .textContent('Aquí informaremos como hacer una promoción')
                        .ariaLabel('Secondary click demo')
                        .ok('Neat!')
                        .targetEvent(event)
                );
            };


            $scope.showPrompt = function (ev) {
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

                $mdDialog.show(confirm).then(function (result) {
                    console.log(result);
                    $scope.status = ' : ¡Gracias por tu Aporte!';


                    //actualizo las boletasCreadas
                    firebase.database().ref('sugerencias/' + (user.$id || user.uid) + '/' + new Date().getTime()).update
                        ({
                            id: (user.$id || user.uid),
                            mensaje: result

                        }
                        );


                }, function () {
                    $scope.status = ' : Estaremos atentos ';
                });
            };



            //HELPERS*****************************************************************************

            $scope.modificar = function(tableData){

            console.log(tableData);
            var confirm = $mdDialog.confirm()
            .title('¿Ha pagado la transferencia el cliente?')
            .ok('Lo pagó !')
            .cancel('Cancelar');
            
          
            
            $mdDialog.show(confirm).then(function() {
                if(tableData.debe ==true){
                    firebase.database().ref('clientes/'+tableData.$id).update
                    ({
                       
                      debe: false
                     
                        });
                      
                   
                }else{
                    firebase.database().ref('clientes/'+tableData.$id).update
                    ({
                       
                      debe: true
                     
                        });
                }
              });
               
            };
            


            //
            function obtenerFechaHoy() {
                var dia = new Date().getDate();
                var mes = new Date().getMonth() + 1; // por alguna razón trae el mes anterior
                var ano = new Date().getFullYear();

                var diafinal;
                var mesfinal;
                if (mes < 10) {
                    mesfinal = '0' + mes;
                } else {
                    mesfinal = mes;

                }

                if (dia < 10) {
                    diafinal = '0' + dia;
                } else {
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