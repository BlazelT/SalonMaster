'use strict';

angular.module('myApp.view1', ['ngRoute'])  

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$firebaseObject', '$firebaseArray','$filter', '$mdDialog','LogFlaite',
    function($scope ,$firebaseObject, $firebaseArray,$filter,$mdDialog,LogFlaite) {

        var user = window.currentAppSalon ;
        var usuarioLogeado = "";
     
        $(servicios).addClass( "active" );
        $(ordenes).removeClass( "active" );
        $(cobros).removeClass( "active" );
        $(pagos).removeClass( "active" );
        $(administrar).removeClass( "active" );
        $(dashboard).removeClass( "active" );
        $(clientes).removeClass( "active" );
        
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
    $scope.categoriaSeleccion = '';
    $scope.seleCliente= '';
    $scope.nombreClienteAutocomplete= '';
        var buscarCategorias= firebase.database().ref().child('categorias');
        var buscarCategoriasER = $firebaseArray(buscarCategorias);
        buscarCategoriasER.$loaded().then(function () {
            $scope.ListaCategorias = buscarCategoriasER;
            console.log($scope.ListaCategorias);
        });



    $scope.products = [];
    $scope.productsFinales= [];
    $scope.allProducts =[];
    $scope.totalAPagar = 0;

    var buscarproducts = firebase.database().ref().child('servicios');
    var buscarproductsER = $firebaseArray(buscarproducts);
    buscarproductsER.$loaded().then(function () {
        $scope.allProducts = buscarproductsER;
        $scope.allProducts.forEach(function (x) {
            $scope.productsFinales.push({
                categoria : x.categoria,
                cantidad : 0,
                nombre:x.nombre,
                valor:x.valor,
                descripcion:x.descripcion,
                id: x.$id,
                total:0,
                psDescuento:x.psDescuento
                
            })
        });
       
        $scope.products =   $scope.productsFinales;
        console.log($scope.productsFinales);
        //     document.getElementById('BarraCargando').style.display = 'none';
    });



        $scope.sumarDisminuir = function (product)
        {
            if(product.cantidad == 1)
            {
                $scope.disminuir(product);

            }else
            {
                $scope.aumentar(product);
            }

        }


        $scope.aumentar = function (product) {
            
            if( product.cantidad == 0)
            {
                console.log("Aumento")
                product.cantidad += 1;
                product.total =  product.valor;

                //   $scope.totalAPagar = 0;
               // $scope.products.forEach(function (productos) {
                $scope.totalAPagar = $scope.totalAPagar + product.total;
                    //});

            }

        }

        //helper
       

        //helper
        $scope.disminuir = function (product) {
            if(product.cantidad == 0){
                console.log("no se puede disminuir menos");
            }else{
                console.log("Lo quito")
                product.cantidad -= 1;

                product.total =  product.valor;

                    console.log(product.total);

                //$scope.totalAPagar = 0;
                $scope.sumarestas = 0;
                console.log('total a pagar :' + $scope.totalAPagar);
             //   $scope.products.forEach(function (productos) {
                    console.log('menos :' + product.total  );
                $scope.totalAPagar = $scope.totalAPagar - product.total;

            //    });
                console.log('total despues de restar pagar :' + $scope.totalAPagar);

            }

        };

        $scope.asignar = function (products) {
            var productosSelecionados = [];
            products.forEach(function (x) {
                if(x.cantidad === 1){
                    productosSelecionados.push(x);
                    console.log(x);
                }
            });
           if(productosSelecionados.length != 0){
               console.log(productosSelecionados);
               $mdDialog.show({
                   controller: dialogComprarServiciosController,
                   templateUrl: 'dialogComprarServicios',
                   parent: angular.element(document.body),
                   clickOutsideToClose:true,
                   locals : {
                       productosSelecionados : productosSelecionados,
                   }
               });
           }else
           {
               alert('Debe seleccionar al menos un servicio');
           }



        };
        $scope.agregarCliente = function(){
            $mdDialog.show({
                controller: dialogAgregarClienteController,
                templateUrl: 'dialogAgregarCliente',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
              
            });
            };
            function dialogAgregarClienteController($scope,$mdDialog,$timeout,$q,$log){
                console.log("asda");
                $scope.numero;
            $scope.nombre;
            $scope.mail;
            $scope.cumpleMes=1;
            $scope.cumpleDia=1;
            $scope.cumple="";
            var buscarClientes = firebase.database().ref().child('clientes');
 var buscarClientesER = $firebaseArray(buscarClientes);
 buscarClientesER.$loaded().then(function () {
                $scope.clientes = buscarClientesER;
});

$scope.Mes = [ 1,2,3,4,5,6,7,8,9,10,11,12];
                $scope.Dia = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
              

$scope.pushCliente = function(nombre,numero,mail, cumpleDia,cumpleMes){

    
    $scope.mensajeValidacionCliente = "";
    $scope.nombreExiste=false;
   
    $scope.cumple = cumpleDia + '/'+cumpleMes;
   
    nombre = angular.lowercase(nombre);
    
    $scope.clientes.forEach(function (p) {
      
        if(p.nombre === nombre && nombre !=""){
         
            $scope.nombreExiste=true;
            console.log("foreach");
            alert('Nombre de cliente ocupado');
            $scope.nombre="";}
});

    if(nombre !=null && $scope.nombreExiste===false){
     if(mail==null){
         mail="Sin Definir";
     }
     if(numero==null){
        numero="Sin Definir";
    }
        firebase.database().ref().child('clientes/').push({nombre:nombre,numero:numero,mail:mail,cumple:$scope.cumple,totalCantidadServicios:0,totalInvertido:0,nota:''});
        $mdDialog.hide();
            }else{
                $scope.mensajeValidacionCliente = "Debe completar al menos el nombre";}
        };
    };
        function dialogComprarServiciosController($scope, $mdDialog,$timeout, $q, $log, productosSelecionados) {
            $scope.existe=true;
            $scope.clienteSeleccionadoCombo;
            $scope.mensajeValidacion = "";

            $scope.dia = new Date().getDate();

            $scope.productosSelecionados = [];
            $scope.productosSelecionados = productosSelecionados;
           
            $scope.idBoleta =  firebase.database().ref().child('boletaCreada/').push().key;
            console.log( $scope.idBoleta);

var buscarClientes = firebase.database().ref().child('clientes');
 var buscarClientesER = $firebaseArray(buscarClientes);
 buscarClientesER.$loaded().then(function () {
                $scope.clientes = buscarClientesER;
				
				
				
			
});
               // console.log($scope.clientes);
				//var clientesnuevos = $scope.clientes;
                var buscarCategorias = firebase.database().ref().child('categorias');
                var buscarCategoriasER = $firebaseArray(buscarCategorias);
                buscarCategoriasER.$loaded().then(function () {
                    $scope.categorias = buscarCategoriasER;
                    
    
    
                });
      
            var buscarTrabajadoras = firebase.database().ref().child('trabajadoras');
            var buscarTrabajadorasER = $firebaseArray(buscarTrabajadoras);
            buscarTrabajadorasER.$loaded().then(function () {
                $scope.trabajadoras = buscarTrabajadorasER;
                console.log($scope.trabajadoras);


            });


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
//HELPER*****

            //HELPERS*****************************************************************************
            

$scope.seleccionarCliente = function ()
{
    
$scope.clientes.forEach(function (x) {
        if(x.nombre === $scope.selected.originalObject.nombre){
          $scope.seleCliente = x;
        }
    });

   
    
    
};
$scope.TrabajadoraName = function(x){
    
    firebase.database().ref().child('trabajadoras').child(x).on('value',function(snapshot){
$scope.b = snapshot.val().name;

    });
return $scope.b;     
      };
 
            $scope.finalizar = function () {
                var nombreTrabajadora = "";
                try
                {       
                
               
                    $scope.fechaPago = obtenerFechaHoy();
    
                    if($scope.seleCliente.nombre != ""){
    
                        $scope.productosSelecionados.forEach(function (x) {
                            console.log(x);
                            console.log(x.idTrabajadora);
                            console.log(x.psDescuento, "lol");
                           nombreTrabajadora= $scope.TrabajadoraName(x.idTrabajadora);
                           console.log(nombreTrabajadora);
                        
                            if(isNaN(x.psDescuento) || x.psDescuento == null){
                                console.log(x.psDescuento, "lol in nan or null");
                                x.psDescuento=x.valor;
                            }
                            console.log(x.psDescuento, "lol after nan or null");
                            if($scope.seleCliente.nombre!=""&&x.idTrabajadora!=""){
    
                            var idOrden =   firebase.database().ref().child('ordenes/').push().key;
                            console.log(idOrden);
                            firebase.database().ref('boletaCreada/'+$scope.idBoleta+'/ordenes/'+ idOrden).set(
                                {
                                    pagado:false,
                                    idTrabajadora: x.idTrabajadora,
                                    nombreTrabajadora:nombreTrabajadora,
                                    idServicio:x.id,
                                    id : idOrden,
                                    categoria:x.categoria,
                                    psDescuento:x.psDescuento
    
                                });
    
    
                            LogFlaite.Debug('se crea ordenes '+$scope.idBoleta ,'view1-finalizar');



                            firebase.database().ref('ordenes/'+idOrden).set({
                                cantidad: x.cantidad,
                                descripcion:x.descripcion,
                                idServicio:x.id,
                                idTrabajadora: x.idTrabajadora,
                                nombreTrabajadora:nombreTrabajadora,
                                id : idOrden,
                                nombre: x.nombre,
                                total: x.total,
                                valor: x.valor,
                                idCliente:$scope.seleCliente.$id,
                                nombreCliente:$scope.seleCliente.nombre,
                                numeroCliente: $scope.seleCliente.numero,
                                idBoletaComun : $scope.idBoleta,
                                pagado:false,
                                realizado:false,
                                eliminado :false,
                                procesofinalizado : false,
                                fecha:new Date().getTime(),
                                diaBoleta: $scope.fechaPago,
                                mail :$scope.seleCliente.mail,
                                categoria : x.categoria,
                                psDescuento:x.psDescuento
                         
    
                            });
                        }else{  
                            
                            $scope.mensajeValidacion = "Debe ingresar un Nombre";

                        }
    
                        });
                        LogFlaite.Debug('se crea boletaCreada '+$scope.idBoleta ,'view1-finalizar');


                        firebase.database().ref('boletaCreada/'+$scope.idBoleta).update({
                            diaBoleta:$scope.fechaPago,
                            pagado:false,
                            nombre :$scope.seleCliente.nombre,
                            numero :$scope.seleCliente.numero,
                            mail :$scope.seleCliente.mail,
                            idCliente:$scope.seleCliente.$id,
                            fechaInicioOrden : new Date().getTime(),
                           
    
    
                        });
    
                        $mdDialog.hide();
                        location.reload(true);
    
    
                    }else{
    
                        $scope.mensajeValidacion = "Debe ingresar un Nombre";
    
    
                    }
                  
                    LogFlaite.Debug('terminar proceso ' ,'view1-finalizar');

                }
                catch(ex)
                {
                    LogFlaite.Error('excepcion : ' +ex,'view1-finalizar');
                }

               

            };

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();

            };


        };

        $scope.numberwithCommas = function (x) {
         //   console.log(x);
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }


           ;
            $scope.filterEventsByText = function () {
                console.log("hooola");

                $scope.products = $filter('filter')( $scope.productsFinales, {categoria: $scope.categoriaSeleccion});
                console.log( $scope.products);
                console.log( $scope.productsFinales);

            };

        $scope.sacarFiltro = function () {
            console.log("hooola");

            $scope.categoriaSeleccion = '';

        };




}]);