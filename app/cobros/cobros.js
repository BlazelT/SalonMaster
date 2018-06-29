/**
 * Created by M on 28-08-2017.
 */
'use strict';

angular.module('myApp.cobros', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/cobros', {
            templateUrl: 'cobros/cobros.html',
            controller: 'cobrosCtrl'
        });
    }])

    .controller('cobrosCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$mdDialog', '$http', '$filter',
        function ($scope, $firebaseObject, $firebaseArray, $mdDialog, $http, $filter) {

            var user = window.currentAppSalon;
            var usuarioLogeado = "";
            $scope.products = [];
            // console.log('usuario : ' + user);

            firebase.database().ref('trabajadoras/').child(user.$id || user.uid || 'offline').once('value', function (snapshot) {
                var exists = (snapshot.val() !== null);
                // console.log(exists);

                if (exists == true) {
                    var ref = firebase.database().ref('/trabajadoras/').child(user.$id || user.uid);
                    var usersLocal = $firebaseObject(ref);
                    usersLocal.$loaded().then(function () {
                        // se asigna la informacion de usuario de la bd a la variable.

                        usuarioLogeado = usersLocal;

                        //console.log(usuarioLogeado);
                        // Todas Las Boletas
                        $scope.allBoletas = [];
                        // Se filtra para que solamente se traiga las ordenes que han sido realizadas.
                        var buscarBoletaCreada = firebase.database().ref().child('boletaCreada');
                        //se transforma en un array
                        var buscarBoletaCreadaER = $firebaseArray(buscarBoletaCreada);
                        //se espera a que carguen todas las filas para continuar
                        buscarBoletaCreadaER.$loaded().then(function () {
                            // Asigno todas las boletas a la variable $scope.allBoletas
                            $scope.allBoletas = buscarBoletaCreadaER;

                            // itero en cada una de las boletas recibidas.
                            $scope.allBoletas.forEach(function (x) {

                                //si no ha sido pagada
                                if (x.pagado != true) {

                                    // creo un array de ordedes a partir de la boleta obtenida
                                    $scope.ordenes = Object.keys(x.ordenes);

                                    //  se generan las variables a utilizar en el proceso de ordenes
                                    x.totalAPagar = 0;
                                    x.totalNoRealizado = 0;
                                    x.ordenesRealizadas = [];
                                    x.ordenesNORealizadas = [];
                                    // por cada orden se realiza una nueva iteración
                                    $scope.ordenes.forEach(function (j) {
                                        // se obtiene la dirección en Firebase del nodo correspondiente a la orden
                                        var traerOrdenes = firebase.database().ref().child('ordenes/' + j);
                                        //se tranforma en objeto javascript desde firebase
                                        var traerOrdenesER = $firebaseObject(traerOrdenes);
                                        //se espera a que este completamente cargado
                                        traerOrdenesER.$loaded().then(function () {

                                            if (traerOrdenesER.realizado != false) {
                                                //filtro que si ya ha sido paga quite.
                                                // se agrega a ordenes realizadas para la separación
                                                x.ordenesRealizadas.push(traerOrdenesER);
                                                x.totalAPagar += traerOrdenesER.valor;

                                            } else {
                                                // se agrega a ordenes no realizadas para la separación
                                                x.ordenesNORealizadas.push(traerOrdenesER);
                                                x.totalNoRealizado += traerOrdenesER.valor;


                                            }


                                        });

                                    });

                                    //lo agrego a productos que es
                                    $scope.products.push(x);
                                }
                            });

                            console.log($scope.products);
                            //  $scope.ordenes = Object.keys($scope.allBoletas.ordenes);



                        });



                    });
                } else {
                    window.currentApp = "";
                    usuarioLogeado = "";
                    $('.codigoAcceder').text("acceder");
                    console.log(window.currentApp + " NO ENTRE");

                };

            });


            $(servicios).removeClass("active");
            $(ordenes).removeClass("active");
            $(cobros).addClass("active");
            $(pagos).removeClass("active");
            $(administrar).removeClass("active");
            $(dashboard).removeClass("active");
            $(clientes).removeClass("active");

            //Acción click  Boton Pagar Orden
            $scope.pagarOrdenes = function (product) {
                //var productosSelecionados = [];
                // products.forEach(function (x) {
                // if(x.cantidad === 1){
                // productosSelecionados.push(x);
                // }
                //  });
                //  if(productosSelecionados.length != 0){
                //console.log(productosSelecionados);

                $mdDialog.show({
                    controller: dialogPagarServiciosController,
                    templateUrl: 'dialogPagarServicio',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    locals: {

                        product: product,
                    }
                });
                //}else
                //{*/
                //  alert('Entro' + product.cantidad);

            };

            function dialogPagarServiciosController($scope, $mdDialog, $timeout, $q, $log, product) {

                $scope.fechaHoy = obtenerFechaHoy();
                $scope.checkDescuento = false;
                $scope.mensajeValidacion = "";


                console.log($scope.fechaPago);
                console.log(product.nombre + product.$id);
                //   $scope.productosSelecionados = [];
                //  $scope.productosSelecionados = productosSelecionados;
                $scope.numero = 0;
                $scope.nombre = "";
                $scope.checkDescuento = false;
                $scope.checkGiftCard = false;
                $scope.checkEfectivo = false;
                $scope.modalNombreboleta = product.nombre;
                $scope.modalFechaboleta = product.fechaInicioOrden;
               
                $scope.modalIdBoleta = product.$id;
                $scope.modalServiciosRelizados = product.ordenesRealizadas;
                $scope.modalServiciosNoRealizados = product.ordenesNORealizadas;
                $scope.modalTotalAPagar = product.totalAPagar;
                $scope.montoIngresado = '';
                $scope.modalVuelto = '';
                $scope.formaDePago = 'Efectivo';
                $scope.montoDescuento = '';
                $scope.montoDescuentoGiftCard = '';
                $scope.idTrabajadora = product.idTrabajadora;
                $scope.mail = product.mail;
                $scope.referencia = product.referencia;
                $scope.cantidad = 0;
                $scope.invertido = 0;
                $scope.montoPie = '';

                $scope.modalDescripcionError = "";
                var buscarClientes = firebase.database().ref().child('clientes');
                var buscarClientesER = $firebaseArray(buscarClientes);
                buscarClientesER.$loaded().then(function () {
                    $scope.clientes = buscarClientesER;
                });
                /**
                                if ($scope.mail != "")
                                {
                                  //  EnviarMailCompra(product.nombre,product.mail,product.telefono);
                                    console.log("//Aqui debe enviar un correo electronico");
                                }else
                                {
                                    $mdDialog.hide();
                
                                }
                
                */
                $scope.validarValor = function (campo) {
                    if (isNaN(campo) ||
                        campo == null ||
                        campo <= 0 ||
                        campo == '') {
                        return 0;
                    }
                    return campo;

                }

                $scope.calcularVuelto = function () {

                    $scope.montoDescuento = $scope.checkDescuento ? $scope.montoDescuento : NaN;
                    $scope.montoDescuentoGiftCard = $scope.checkGiftCard ? $scope.montoDescuentoGiftCard : NaN;
                    $scope.montoEfectivo = $scope.checkEfectivo ? $scope.montoEfectivo : NaN;


                    $scope.modalVuelto = - $scope.modalTotalAPagar + $scope.validarValor($scope.montoIngresado)
                        + $scope.validarValor($scope.montoDescuento)
                        + $scope.validarValor($scope.montoDescuentoGiftCard)
                        + $scope.validarValor($scope.montoEfectivo);










                    /*



                    /*
       
            if(isNaN($scope.montoDescuento) || 
            $scope.montoDescuento==null || 
            $scope.montoDescuento <=0) {
            if( isNaN($scope.montoDescuentoGiftCard) ||
             $scope.montoDescuentoGiftCard ==null || 
             $scope.montoDescuentoGiftCard  <=0){

                    $scope.modalVuelto =   -$scope.modalTotalAPagar +$scope.montoIngresado;
                    console.log($scope.modalVuelto,"lechedetoro");
                    console.log($scope.montoIngresado);
                    if($scope.modalVuelto < 0)
                    {
                        $scope.modalVuelto = '';

                    }
                    return;
            }}

            if(isNaN($scope.montoIngresado) ||
             $scope.montoIngresado==null || 
             $scope.montoIngresado <=0 ){
                if( isNaN($scope.montoDescuentoGiftCard) ||
                $scope.montoDescuentoGiftCard ==null || 
                $scope.montoDescuentoGiftCard  <=0){

                $scope.modalVuelto =  - $scope.modalTotalAPagar +$scope.montoDescuento;
                console.log($scope.modalVuelto);
                console.log($scope.modalTotalAPagar);
                if($scope.modalVuelto < 0)
                {
                    $scope.modalVuelto = '';

                }
                return;
            }}
             if(isNaN($scope.montoIngresado) ||
             $scope.montoIngresado==null || 
             $scope.montoIngresado <=0 ){
             if(isNaN($scope.montoDescuento) || 
            $scope.montoDescuento==null || 
            $scope.montoDescuento <=0) {
            $scope.modalVuelto =   -$scope.modalTotalAPagar +$scope.montoDescuentoGiftCard;
                  console.log($scope.modalVuelto);
                  console.log($scope.modalTotalAPagar);
                  if($scope.modalVuelto < 0)
                  {
                      $scope.modalVuelto = '';

                  }
                  return;
            }}
            if(isNaN($scope.montoIngresado) ||
             $scope.montoIngresado==null || 
             $scope.montoIngresado <=0 ){
             $scope.modalVuelto =   -$scope.modalTotalAPagar + $scope.montoDescuentoGiftCard +$scope.montoDescuento;
             if($scope.modalVuelto < 0)
             {
                 $scope.modalVuelto = '';

             }
             return;
             }
             if(isNaN($scope.montoDescuento) || 
             $scope.montoDescuento==null || 
             $scope.montoDescuento <=0){
             $scope.modalVuelto =   -$scope.modalTotalAPagar + $scope.montoDescuentoGiftCard +$scope.montoIngresado;
             if($scope.modalVuelto < 0)
             {
                 $scope.modalVuelto = '';

             }
             return;
             }
             if( isNaN($scope.montoDescuentoGiftCard) ||
             $scope.montoDescuentoGiftCard ==null || 
             $scope.montoDescuentoGiftCard  <=0){
             $scope.modalVuelto =   -$scope.modalTotalAPagar + $scope.montoDescuento + $scope.montoIngresado;
             if($scope.modalVuelto < 0)
             {
                 $scope.modalVuelto = '';

             }
             return;
            }
             if($scope.montoDescuentoGiftCard>0&&$scope.montoDescuento>0&&$scope.montoIngresado>0){   
                $scope.modalVuelto =   -$scope.modalTotalAPagar + $scope.montoDescuento + $scope.montoIngresado +$scope.montoDescuentoGiftCard;
                if($scope.modalVuelto < 0)
                {
                    $scope.modalVuelto = '';

                }
                return;}
                
                  */
                }


                //  console.log(product);
                //  console.log( $scope.modalFechaboleta);
                //  console.log($scope.modalTotalAPagar);
                //  console.log($scope.formaDePago);
                //  console.log(usuarioLogeado.id);

                $scope.ConfirmarPago = function () {
                    $scope.debe = false;
                    if (isNaN($scope.montoIngresado) || $scope.montoIngresado == null || $scope.montoIngresado == "") {
                        $scope.montoIngresado = 0;

                    }

                    if (isNaN($scope.montoEfectivo) || $scope.montoEfectivo == null || $scope.montoEfectivo == "") {
                        $scope.montoEfectivo = 0;

                    }
                    if (isNaN($scope.montoDescuento) || $scope.montoDescuento == null || $scope.montoDescuento == "") {
                        $scope.montoDescuento = 0;

                    }
                    if (isNaN($scope.montoDescuentoGiftCard) || $scope.montoDescuentoGiftCard == null || $scope.montoDescuentoGiftCard <= 0) {
                        $scope.montoDescuentoGiftCard = 0;
                    }
                    if ($scope.modalTotalAPagar > ($scope.montoIngresado + $scope.montoDescuento + $scope.montoDescuentoGiftCard + $scope.montoEfectivo)) {
                        $scope.modalDescripcionError = "Monto Entregado por Cliente  debe ser mayor a total a pagar";
                        console.log('No puedo cobrar ' + $scope.modalDescripcionError);
                        return;

                    }
                    $scope.modalServiciosRelizados.forEach(function (a) {
                    $scope.clientes.forEach(function (b) {

                        if (b.$id == a.idCliente) {
                            if(b.debe == true){
                                $scope.debe = true;  
                            }

                        }
                    });
                });

                if($scope.debe == true &&$scope.formaDePago=="Transferencia" ){
                    $scope.modalDescripcionError = "Cliente no ha pagado transferencia y esta solicitando otra";
                        console.log('No puedo cobrar ' + $scope.modalDescripcionError);
                        return;
                }

                    // Pasamos la boleta a pagada
                    // $scope.fechaHoy = new Date().getDate()+ '' + (new Date().getMonth()+1) + '' + new Date().getFullYear() ;
                    $scope.fechaHoy = obtenerFechaHoy();

                    //actualizo las ordenes que se realizaron
                    $scope.modalServiciosRelizados.forEach(function (x) {
                  

                        //actualizo las boletasCreadas
                        firebase.database().ref('boletaCreada/' + $scope.modalIdBoleta + '/ordenes/' + x.id).update
                            ({
                               
                                FormaDePago: $scope.formaDePago,
                              
                                pagado: true,
                                //   idOrden :x.id,
                                valor: x.valor,

                                //   idServicio:x.id
                            }
                            );
                        //actualizo el detalle de las ordenes

                        firebase.database().ref('/ordenes/' + x.id).update
                            ({
                              
                                FormaDePago: $scope.formaDePago,
                              
                                pagado: true,
                                procesofinalizado: true,
                                fechaPago: new Date().getTime(),
                                //   idOrden :x.id,
                                // valor : x.valor,
                                //   idServicio:x.id
                            }
                            );


                        $scope.clientes.forEach(function (y) {

                            if (y.$id == x.idCliente) {

                                $scope.cantidad = y.totalCantidadServicios;
                                $scope.invertido = y.totalInvertido;
                            }
                        });

                        firebase.database().ref('clientes/' + x.idCliente).update
                            ({
                                debe:$scope.formaDePago=="Transferencia"?true:false,
                                totalCantidadServicios: $scope.cantidad + 1,
                                totalInvertido: $scope.invertido + x.valor,
                                ultimaAtencion: obtenerFechaHoy()

                            }
                            );
                        var servCliente = firebase.database().ref('clientes/' + x.idCliente + '/servicios/').push().key;
                        firebase.database().ref('clientes/' + x.idCliente + '/servicios/' + servCliente).set(
                            {

                                categoria: x.categoria,
                                descripcion: x.descripcion,
                                nombre: x.nombre,
                              
                                FormaDePago: $scope.formaDePago,
                             
                                idTrabajadora: x.idTrabajadora,
                                nombreTrabajadora: x.nombreTrabajadora,
                                psDescuento: x.psDescuento,
                                valor: x.valor,
                                fechaDia: obtenerFechaHoy(),
                                fechaRealizado: x.fechaRealizado
                            }
                        );

                    });

                    //actualizo las ordenes que no se realizaron

                    $scope.modalServiciosNoRealizados.forEach(function (x) {


                        //actualizo el detalle de las ordenes

                        firebase.database().ref('/ordenes/' + x.id).update
                            ({
                                eliminado: true,
                                procesofinalizado: true,
                                fechaPago: new Date().getTime(),
                                // no se realizo por ende se elimino.

                            }
                            );


                    });


                    firebase.database().ref('boletaCreada/' + $scope.modalIdBoleta).update({
                        pagado: true,
                        fechaPago: new Date().getTime(),
                        MontoIngresado: $scope.montoIngresado,
                        MontoCobrado: $scope.modalTotalAPagar,
                        MontoVuelto: $scope.modalVuelto,
                        FormaDePago: $scope.formaDePago,
                        checkDescuento: $scope.checkDescuento,
                        checkGiftCard: $scope.checkGiftCard,
                        checkEfectivo: $scope.checkEfectivo,
                        IdTrabajadora: usuarioLogeado.id,
                        NombreTrabajadoraCobro: usuarioLogeado.name,
                        diaBoleta: $scope.fechaHoy,
                        descuento: $scope.montoDescuento,
                        montoGiftCard: $scope.montoDescuentoGiftCard,
                        montoIngresado: $scope.montoIngresado,
                        montoEfectivo: $scope.montoEfectivo,

                    });

                    $mdDialog.hide();
                    location.reload(true);

                }

                //   $scope.idBoleta =  firebase.database().ref().child('boletaCreada/').push().key;
                //   console.log( $scope.idBoleta);


                /**
                
                
                                });**/

                $scope.cerrarVentana = function () {

                    console.log('cerrar ventana ')
                    $mdDialog.hide();
                }

                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();

                };


            };
            //HELPERS*****************************************************************************

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



            var trabajadoras = firebase.database().ref('/trabajadoras/');
            var trabajadorasQR = $firebaseArray(trabajadoras);
            trabajadorasQR.$loaded().then(function () {
                $scope.trabajadorasQR = trabajadorasQR;

            });

            $scope.getNameTrabajadora = function (idTrabajadora) {
                var keyTrabajadora = idTrabajadora;
                return $filter('filter')($scope.trabajadorasQR, { $id: keyTrabajadora })[0].name;
            };

            //HELPERS*****************************************************************************

            /*
            $scope.pagoExacto = function () {
 consoe.log('entre al pago exacto');
                $scope.montoIngresado = $scope.modalTotalAPagar;

            };
**/


            /*
            
                        function EnviarCorreoCompra(pnom,pmai,pfon) {
                            console.log("entre al envio");
            // using $timeout to make sure all changes are applied before reading visibleStart() and visibleEnd()
            
                                var params = {
                                    nom: pnom,
                                    mai: pmai,
                                    fon: pfon
            
            
                                }
            
            
                                $http.post("http://www.manosya.cl/php/enviarcorreo.php", params)
                                    .success(function(data, status, headers, config,response) {
                                    console.log(status);
                                    console.log(data);
                                        console.log(headers);
                                        console.log(config);
                                        console.log(response);
                                 //   $scope.respuestacorreo = data;
            
                                }).
                                   error(function(data, status, headers, config,response) {
                                  console.log("Request failed" + response);
                                    console.log(status);
                                    console.log(data);
                                    console.log(headers);
                                    console.log(config);
                                    console.log(response);
            
                    });;
            
                        }
            
             */

        }]);



