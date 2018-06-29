'use strict';

angular.module('myApp.adm1', ['ngRoute'])  

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/adm1', {
    templateUrl: 'adm1/adm1.html',
    controller: 'adm1Ctrl'
  });
}])

.controller('adm1Ctrl', ['$scope', '$firebaseObject', '$firebaseArray','$filter', '$mdDialog',
    function($scope ,$firebaseObject, $firebaseArray,$filter,$mdDialog) {
        $scope.seleServicio= '';
        var user = window.currentAppSalon ;
        var usuarioLogeado = "";
        $scope.editListing = false;
       
        $(servicios).removeClass( "active" );
        $(ordenes).removeClass( "active" );
        $(cobros).removeClass( "active" );
        $(pagos).removeClass( "active" );
        $(administrar).addClass( "active" );
        $(dashboard).removeClass( "active" );
        $(clientes).removeClass( "active" );
        
        $scope.mensajeValidacionServicio ="";

        $scope.agregarServicio = function(){
            $mdDialog.show({
                controller: dialogAgregarServicioController,
                templateUrl: 'dialogAgregarServicio',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
              
            });
            };

            $scope.modificarServicio = function(){
                $mdDialog.show({
                    controller: dialogModificarServicioController,
                    templateUrl: 'dialogModificarServicio',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                  
                });
                };
                
                $scope.modificarCliente = function(){
                    $mdDialog.show({
                        controller: dialogModificarClienteController,
                        templateUrl: 'dialogModificarCliente',
                        parent: angular.element(document.body),
                        clickOutsideToClose:true,
                      
                    });
                    };
                    $scope.autocomplete = function(){
                        $mdDialog.show({
                            controller: dialogautocompleteController,
                            templateUrl: 'dialogautocomplete',
                            parent: angular.element(document.body),
                            clickOutsideToClose:true,
                          
                        });
                        };

            $scope.eliminarServiciosTemporales = function(){
                var buscarServicios = firebase.database().ref().child('servicios');
              var buscarServiciosER = $firebaseArray(buscarServicios);
              buscarServiciosER.$loaded().then(function () {
                             $scope.servicios = buscarServiciosER;
             });
               
                var confirm = $mdDialog.confirm()
                .title('¿Desea eliminar los servicios adicionales?')
                .ok('Eliminar servicios')
                .cancel('Cancelar');
                
              
                
                $mdDialog.show(confirm).then(function() {
                    $scope.servicios.forEach(function (k){
                  
                        if(k.$id>=5000){
                      
                               firebase.database().ref().child('servicios/'+k.$id).remove();}
                    
                    
                    
                    
                            });
                  
                  });
                };
            
            function dialogAgregarServicioController($scope,$mdDialog,$timeout,$q,$log){
               $scope.check=false;
               $scope.psDescuento=""; 
               $scope.valor=""; 
               $scope.descuento="";
               
               var buscarCategorias = firebase.database().ref().child('categorias');
               var buscarCategoriasER = $firebaseArray(buscarCategorias);
               buscarCategoriasER.$loaded().then(function () {
                              $scope.categorias = buscarCategoriasER;
              });
             
              var buscarServicios = firebase.database().ref().child('servicios');
              var buscarServiciosER = $firebaseArray(buscarServicios);
              buscarServiciosER.$loaded().then(function () {
                             $scope.servicios = buscarServiciosER;
             });
             
              $scope.calcularPCD= function(){
             
                $scope.valor=Math.round( $scope.psDescuento * ((100-$scope.descuento)/100));
    
                    
                }
             $scope.pushServicio = function(nombre,descripcion,categoria,valor,check,psDescuento){
                $scope.descripcionExiste=false;
                $scope.id =0;
                var serRef =  firebase.database().ref().child('servicios/');
                $scope.mensajeValidacionServicio = "";
                $scope.servicios.forEach(function (z) {
              
                    if(descripcion === z.descripcion){
                     $scope.descripcionExiste=true;
                     $scope.mensajeValidacionServicio = "Descripcion de servicio en uso";
                     console.log("descripcion en uso");
                    
                  
                    }
                    console.log($scope.descripcionExiste);
                });
               if($scope.descuento>=1 &&$scope.descuento<=100&&check==true){
                $scope.mensajeValidacionServicio = "Servicio Permanente no puede tener descuento";
                return;
               }
               


                if(nombre!=null && descripcion!=null && categoria!=null && psDescuento!=null && $scope.descripcionExiste==false){
                  

                   if(isNaN(valor) || valor==null){
                  valor=psDescuento;}

                 
                 if(check===false){
                $scope.servicios.forEach(function (x) {
                    
                    if(parseInt(x.$id)>$scope.id)
                           $scope.id=x.$id;
                        
                });

                if($scope.id <5000){
                   
                   $scope.asd= "5000";
                    serRef.child(5000).set({
                        nombre:nombre,
                        descripcion:descripcion,
                        categoria:categoria.id,
                        valor:valor,
                        duracion:"Sin definir",
                        id:$scope.asd,
                        psDescuento:valor,
                        visible:true});
                        $mdDialog.hide();
        return;
                        
                }
                $scope.servicios.forEach(function (x) {
                    if(parseInt(x.$id)>$scope.id)
                           $scope.id=x.$id;
                });
               
                $scope.id =parseInt($scope.id) +1;
                serRef.child($scope.id).set({
                    nombre:nombre,
                    descripcion:descripcion,
                    categoria:categoria.id,
                    valor:valor,
                    duracion:"Sin definir",
                    id:($scope.id).toString(),
                    psDescuento:valor,
                    visible:true});
                    $mdDialog.hide();
             //   firebase.database().ref().child('clientes/' +).push({nombre:nombre,numero:numero,mail:mail,cumple:$scope.cumple});
                   // $mdDialog.hide();
                }else{
                    
                    $scope.servicios.forEach(function (z) {
                        if(z.$id<5000){
                        if(z.$id>$scope.id)
                               $scope.id=z.$id;}
                            });
                            $scope.id =parseInt($scope.id) +1;
                            serRef.child($scope.id).set({nombre:nombre,descripcion:descripcion,
                                categoria:categoria.id,valor:valor,duracion:"Sin definir",id:($scope.id).toString(),psDescuento:valor,visible:true});
                                $mdDialog.hide();
            }

                }else{
                    $scope.mensajeValidacionServicio = "Debe completar los campos o descripcion en uso";}
                
        
                    };
       
       
                    $scope.hide = function () {
                        $mdDialog.hide();
                    };
       
            };
            

            function dialogModificarServicioController($scope,$mdDialog,$timeout,$q,$log){
                $scope.mensajeValidacionModificarServicio='';
                $scope.editListing = false;
                $scope.servicioAutocomplete= '';
                $scope.descripcionExiste=false;
                var buscarCategorias = firebase.database().ref().child('categorias');
                var buscarCategoriasER = $firebaseArray(buscarCategorias);
                buscarCategoriasER.$loaded().then(function () {
                               $scope.categorias = buscarCategoriasER;
               });
                var buscarServicios = firebase.database().ref().child('servicios');
                var buscarServiciosER = $firebaseArray(buscarServicios);
                buscarServiciosER.$loaded().then(function () {
                               $scope.servicios = buscarServiciosER;
               });


                $scope.seleccionarServicio = function ()
                {
                    $scope.editListing = true;
                
                $scope.servicios.forEach(function (x) {
                        if(x.descripcion === $scope.selected.originalObject.descripcion){
                          //$scope.clienteSeleccionadaAutocomplete = x;
                       
                      
                    
                          
                          $scope.seleServicio =x;
                          $scope.seleServicio.categoria = (x.categoria).toString();
                        }
                    });
                
                
                

                
                    
                    
                };

                $scope.guardarServicio= function(){
                  
                   
                   // console.log($scope.existingListing + "asdaa");

                   $scope.servicios.forEach(function (z) {
              
                    if(z.$id != $scope.seleServicio.$id && $scope.seleServicio.descripcion===z.descripcion){
                     $scope.descripcionExiste=true;
                   
                    }
                });
               
                if($scope.seleServicio.categoria!=''&&$scope.seleServicio.descripcion!=''&&$scope.seleServicio.valor!=''
                &&$scope.descripcionExiste==false){
                    $scope.servicios.forEach(function (y) {
                      
                        if(y.$id === $scope.seleServicio.$id){
                                                       
                            firebase.database().ref('servicios/'+y.$id).update({
                           categoria: parseInt($scope.seleServicio.categoria),
                           descripcion:$scope.seleServicio.descripcion,
                           duracion:$scope.seleServicio.duracion,
                           id:$scope.seleServicio.id,
                           nombre:$scope.seleServicio.nombre,
                           valor:$scope.seleServicio.valor,
                           visible:true,
                           psDescuento:$scope.seleServicio.valor
                               
        
        
                            });

                        }

                        $scope.editListing = false;
                    });
                }else{
                    $scope.mensajeValidacionModificarServicio="Nombre de servicio ocupado o campos vacíos";
                }
                             

                }

                $scope.eliminarServicio= function(){
                    var r = confirm ("¿Eliminar servicio seleccionado?");
                    if(r == true){
                $scope.servicios.forEach(function(z){
                
                    if(z.$id===$scope.seleServicio.$id){
                        console.log(z.$id);
                        console.log($scope.seleServicio.$id);
                        firebase.database().ref().child('servicios/' +z.$id).remove();
                        $scope.editListing = false;
                        return;
                    }
              

                });
            }
                }
         

        };

        function dialogModificarClienteController($scope,$mdDialog,$timeout,$q,$log){
            $scope.Mes = [ 1,2,3,4,5,6,7,8,9,10,11,12];
            $scope.Dia = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
            $scope.mensajeValidacionModificarCliente = '';
            var buscarClientes = firebase.database().ref().child('clientes');
            var buscarClientesER = $firebaseArray(buscarClientes);
            buscarClientesER.$loaded().then(function () {
                           $scope.clientes = buscarClientesER;
           });
 
           $scope.complete = function(string){  
            $scope.hidethis = false;  
            $scope.nombrecliente='';
            var output = [];  
            angular.forEach($scope.clientes, function(z){  
                 if(z.nombre.toLowerCase().indexOf(string.toLowerCase()) >= 0)  
                 {  
                      output.push(z);  
                 }  
            });  
            $scope.clientesFiltrados = output;  
       }  
       $scope.fillTextbox = function(string){
          
            $scope.cliente = string.nombre;  
            $scope.hidethis = true;  
           
       }    


            $scope.seleccionarCliente = function ()
            {

                console.log($scope.selected);
                console.log($scope.selected.originalObject.nombre);
                $scope.editListingClientes = true;
      
            $scope.clientes.forEach(function (x) {
                    if(x.nombre === $scope.selected.originalObject.nombre){
                      //$scope.clienteSeleccionadaAutocomplete = x;
            
                    
                      
                      $scope.seleCliente = x;
                      $scope.seleCliente.dia = ($scope.seleCliente.cumple).substring(0,($scope.seleCliente.cumple).indexOf("/"));
                      
                      $scope.seleCliente.mes = $scope.seleCliente.cumple.substring($scope.seleCliente.cumple.lastIndexOf("/")+1);
                    
                    }
                });
            
            
                
                
                
            };

            $scope.guardarCliente= function(){
           
            $scope.nombreExiste=false;
            $scope.mensajeValidacionModificarCliente='';


            
               // console.log($scope.existingListing + "asdaa");
               $scope.seleCliente.cumple = $scope.seleCliente.dia + '/'+$scope.seleCliente.mes;
               

               $scope.clientes.forEach(function (y) {
              
                   if(y.$id != $scope.seleCliente.$id && $scope.seleCliente.nombre===y.nombre){
                   
                    $scope.nombreExiste=true;
                    
                   }
               });

               if($scope.seleCliente.nombre !=''&&$scope.seleCliente.mail!=''&&$scope.seleCliente.numero&& $scope.nombreExiste==false){
                $scope.clientes.forEach(function (z) {
                  
                    if(z.$id === $scope.seleCliente.$id){
                     
                                           
                        firebase.database().ref('clientes/'+z.$id).update({
                       nombre: $scope.seleCliente.nombre,
                       mail:$scope.seleCliente.mail,
                       numero:$scope.seleCliente.numero,
                       cumple:$scope.seleCliente.cumple
                    
    
    
                        });

                    }

                    $scope.editListingClientes = false;
                });
            }else{
                $scope.mensajeValidacionModificarCliente="Nombre de cliente ocupado o campos vacíos";     
            }
                   

            }

            $scope.eliminarCliente = function(){
            
                  var r = confirm ("¿Eliminar cliente seleccionado?");
                  if(r == true){
                $scope.clientes.forEach(function(c){
                
                    if(c.$id===$scope.seleCliente.$id){
                      
                        firebase.database().ref().child('clientes/' +c.$id).remove();
                        $scope.editListingClientes = false;
                        return;
                    }
              

                });

            }

        }
        };
        function dialogautocompleteController($scope,$mdDialog,$timeout,$q,$log){
           
            $scope.selectedData = {};
      
           
            var buscarClientes = firebase.database().ref().child('clientes');
            var buscarClientesER = $firebaseArray(buscarClientes);
            buscarClientesER.$loaded().then(function () {
                           $scope.clientes = buscarClientesER;
           });

        






        }

    }]);