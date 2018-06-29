/**
 * Created by M on 28-08-2017.
 */
'use strict';

angular.module('myApp.pagos', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pagos', {
            templateUrl: 'pagos/pagos.html',
            controller: 'pagosCtrl'
        });
    }])

    .controller('pagosCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$mdDialog',
        function($scope ,$firebaseObject, $firebaseArray,$mdDialog) {

          
            var user = window.currentAppSalon ;
            var usuarioLogeado = "";
            $scope.resumenDia = { 

                 totalTransbank : 0,
                 totalDebito : 0,
                 totalCredito :0,
                 totalEfectivo :0,
                 totalDia : 0

            };
            $scope.products=[];
            // console.log('usuario : ' + user);
           
        
            firebase.database().ref('trabajadoras/').child(user.$id || user.uid || 'offline').once('value', function(snapshot) {
                var exists = (snapshot.val() !== null);
                // console.log(exists);

                if (exists == true) {
                    var ref = firebase.database().ref('/trabajadoras/').child(user.$id || user.uid);
                    var usersLocal = $firebaseObject(ref);
                  //  var fechaHoy = new Date().getDate()+ '' + (new Date().getMonth() + 1) + '' + new Date().getFullYear() ;
                 //   var fechaHoy = obtenerFechaHoy();

                 //   console.log(fechaHoy)
                    usersLocal.$loaded().then(function () {
                       // var fechaHoy = obtenerFechaHoy();
                        // se asigna la informacion de usuario de la bd a la variable.

                        usuarioLogeado = usersLocal;
                        $scope.usuarioLogeado = usuarioLogeado;
                        //console.log(usuarioLogeado);

                        $scope.allBoletas=[];
                        // Se filtra para que solamente se traiga las ordenes que han sido realizadas.
                       // var buscarBoletaCreada = firebase.database().ref().child('boletaCreada').orderByChild('diaBoleta').equalTo(fechaHoy);
                      //  console.log(fechaHoy);

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
                                    x.totalAPagar = 0;
                                    x.ordenesRealizadas = [];
                                    $scope.ordenes.forEach(function (j) {
                                        var traerOrdenes = firebase.database().ref().child('ordenes/' + j);
                                        var traerOrdenesER = $firebaseObject(traerOrdenes);
                                        traerOrdenesER.$loaded().then(function () {
                                            //console.log(traerOrdenesER);
                                            //validacion para traer
                                            if (traerOrdenesER.realizado != false) {
                                                //filtro que si ya ha sido paga quite. esribe en la boleta.

                                                x.ordenesRealizadas.push(traerOrdenesER);
                                                x.totalAPagar += traerOrdenesER.valor;
                                              

                                            }


                                        });

                                    });

                                    //lo agrego a boletas
                                    $scope.products.push(x);


                                    switch (x.FormaDePago) {
                                        case 'Efectivo':
                                       
                                        $scope.resumenDia.totalEfectivo = x.MontoCobrado;   
                                          break;
                                        case 'TarjetaCredito':
                                          //Sentencias ejecutadas cuando el resultado de expresion coincide con valor2
                                          $scope.resumenDia.totalCredito += x.MontoCobrado;    
                                       
                                          break;
                                          case 'TarjetaDebito':
                                          //Sentencias ejecutadas cuando el resultado de expresion coincide con valor2
                                          $scope.resumenDia.totalDebito += x.MontoCobrado;      
                                         
                                          break;
                                      
                                        default:
                                          //Sentencias_def ejecutadas cuando no ocurre una coincidencia con los anteriores casos
                                          break;
                                      }



                                }
                            });
                            //Actualiza el valor total resumen
                            $scope.resumenDia.totalTransbank = $scope.resumenDia.totalDebito + $scope.resumenDia.totalCredito ;
                            $scope.resumenDia.totalDia = $scope.resumenDia.totalTransbank + $scope.resumenDia.totalEfectivo ;
                            
                            console.log($scope.products);
                            //  $scope.ordenes = Object.keys($scope.allBoletas.ordenes);



                        });



                    });
                } else {
                    window.currentApp = "";
                    usuarioLogeado = "";
                 //   $('.codigoAcceder').text("acceder");
                    console.log(window.currentApp + " NO ENTRE");

                };

            });
    var buscarTrabajadoras = firebase.database().ref().child('trabajadoras');
            var buscarTrabajadorasER = $firebaseArray(buscarTrabajadoras);
            buscarTrabajadorasER.$loaded().then(function () {
                $scope.trabajadoras = buscarTrabajadorasER;
                console.log($scope.trabajadoras);


            });

            $scope.TrabajadoraName = function(x){
    
          firebase.database().ref().child('trabajadoras').child(x).on('value',function(snapshot){
  $scope.a = snapshot.val().name;
  
          });
  return $scope.a;     
            };


            $scope.pagarOrdenes = function (product) {

                $mdDialog.show({
                    controller: dialogPagarServiciosController,
                    templateUrl: 'dialogPagarServicio',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals : {

                        product : product,
                    }
                });


            };


            $scope.cerrarDia = function () {

                        var confirm = $mdDialog.confirm()
                            .title('¿Desea cerrar el día?')
                            .ok('Cerrar día')
                            .cancel('Seguir vendiendo');


                            $mdDialog.show(confirm).then(function() {
   


             //   var fechaHoy = new Date().getDate()+ '' + (new Date().getMonth() + 1) + '' + new Date().getFullYear() ;

                var buscarOrdendesdelDia = firebase.database().ref().child('ordenes');

                var buscarBoletasDelDia = firebase.database().ref().child('boletaCreada');

                var fechaCierre = obtenerFechaHoy();




                //jornada
               // var buscarOrdendesHistoricas = firebase.database().ref().child();


                //  console.log(buscarOrdendesdelDiaER);

                //mover las ordenes a ordenes historicas

                var seMovioaHistorico = false;
                buscarOrdendesdelDia.once('value', function(snapshot) {
                //    console.log(snapshot.val());
                 //   console.log('entre a buscarOrdendesdelDia');

                    var buscarOrdendesHistoricas = firebase.database().ref().child('jornadas/' +fechaCierre+'/ordenes/');
                    console.log(buscarOrdendesHistoricas);
                        buscarOrdendesHistoricas.update(snapshot.val()); //se copia en el historico
                    console.log('se copio las boletas historicas');
                        seMovioaHistorico = true;
                        console.log('Se mueve las ordenes a historicas');

                        if (seMovioaHistorico) {   // se quitan las ordenes del dia.
                            console.log('Se limpian las Ordendes del dia');
                            var ordenActual = firebase.database().ref().child('ordenes/');
                        //    console.log('Se limpia orden' + ordenActual );
                            ordenActual.remove();
                        }


                });


                //mover las boletas a historicas

                seMovioaHistorico = false;
                buscarBoletasDelDia.once('value', function(snapshot) {
                        console.log(snapshot.val());
                       console.log('entre a buscarBoletasDelDia');
                    var buscarBoletasHistoricas= firebase.database().ref().child('jornadas/' +fechaCierre+'/boletas/' );
                    buscarBoletasHistoricas.update(snapshot.val());
                    seMovioaHistorico = true;
                    console.log('Se mueve las boletas a historicas');

                    if(seMovioaHistorico)
                    {   // se quitan las oredenes del dia.
                        console.log('Se limpian las boletas del dia');

                         var boletaActual = firebase.database().ref().child('boletaCreada/');
                         boletaActual.remove();
                    }

                    //reinicio todo
                    $scope.products=[];



                });



                /*
                buscarOrdendesdelDiaER.forEach(function (x) {



                    buscarOrdendesHistoricas.update({
                        realizado : boolean
                    });

                });
*/
                    //mover las ordenes a ordenes historicas






//HELPERS*****************************************************************************






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

            //HELPERS*****************************************************************************

            $scope.numberwithCommas = function (x) {
                //   console.log(x);
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            function dialogPagarServiciosController($scope, $mdDialog,$timeout, $q, $log, product) {

                $scope.mensajeValidacion = "";


              //  $scope.fechaPago = new Date().getDate()+ '' + (new Date().getMonth()  + 1) + '' + new Date().getFullYear() ;
               // console.log( $scope.fechaPago );
                console.log(product.nombre + product.$id );
                //   $scope.productosSelecionados = [];
                //  $scope.productosSelecionados = productosSelecionados;
                $scope.numero = 0;
                $scope.nombre =  "";

              
                $scope.fechaPago = product.fechaPago;
                    $scope.modalNombreboleta = product.nombre;
                $scope.modalFechaboleta = product.fecha;
                $scope.modalIdBoleta = product.$id;
                $scope.modalServiciosRelizados = product.ordenesRealizadas;
                $scope.modalTotalAPagar = product.totalAPagar;
                $scope.montoIngresado = product.MontoIngresado;
                $scope.modalVuelto = product.MontoVuelto   ;
                $scope.formaDePago = product.FormaDePago;
                $scope.numero = product.numero;
                $scope.mail = product.mail;
               
                $scope.nombreTrabajadora = product.NombreTrabajadoraCobro;

                $scope.fechaInicioOrden = product.fechaInicioOrden;


                $scope.calcularVuelto = function () {

                    $scope.modalVuelto = $scope.montoIngresado -  $scope.modalTotalAPagar;
                    if($scope.modalVuelto < 0)
                    {
                        $scope.modalVuelto = '';

                    }
                }


                console.log(product);
                console.log(   $scope.modalFechaboleta);
                console.log($scope.modalTotalAPagar);









                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();

                };


            };

            $(servicios).removeClass( "active" );
            $(ordenes).removeClass( "active" );
            $(cobros).removeClass( "active" );
            $(pagos).addClass( "active" );
            $(administrar).removeClass( "active" );
            $(dashboard).removeClass( "active" );
            $(clientes).removeClass( "active" );


        }]);



