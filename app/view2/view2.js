'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'view2Ctrl'
      });
    }])

    .controller('view2Ctrl', ['$scope', '$firebaseObject', '$firebaseArray', '$mdDialog','$filter',
      function($scope ,$firebaseObject, $firebaseArray,$mdDialog,$filter) {



        var user = window.currentAppSalon ;
        var usuarioLogeado = "";

          $scope.products = [];
          $scope.allProducts =[];

        //  console.log('usuario : ' + user);
         // console.log(user.$id);
        //  console.log(user.uid );
        $scope.username = '';
        
        var _name = '';

        var buscarOrdenes= firebase.database().ref().child('ordenes');
        var buscarOrdenesER= $firebaseArray(buscarOrdenes);
        buscarOrdenesER.$loaded().then(function () {
            $scope.ListaOrdenes = buscarOrdenesER;
            console.log($scope.ListaOrdenes);
        });
        $scope.sacarFiltro = function () {
            console.log("hooola");

            $scope.username = '';

        };
      
      

          firebase.database().ref('trabajadoras/').child(user.$id || user.uid || 'offline').once('value', function(snapshot) {
          var exists = (snapshot.val() !== null);
          console.log(exists);

              $scope.serviciosPendientes = 0;

          if (exists == true) {
            var ref = firebase.database().ref('/trabajadoras/').child(user.$id || user.uid);
            var usersLocal = $firebaseObject(ref);
            usersLocal.$loaded().then(function () {
              // se asigna la informacion de usuario de la bd a la variable.

              usuarioLogeado = usersLocal;
              console.log(usuarioLogeado);
            $scope.usuarioLogeado = usuarioLogeado;

                // Se filtra para que solamente se traiga las ordenes que maneja el trabajador.
                var buscarproducts = firebase.database().ref().child('ordenes').orderByChild('idTrabajadora');
                var buscarproductsER = $firebaseArray(buscarproducts);

                buscarproductsER.$loaded().then(function () {
                    var sumapendiente = 0;

                    if(usuarioLogeado.perfil == 'administrador'){
                        $scope.allProducts = buscarproductsER;
                        $scope.products = $scope.allProducts;
                        console.log('entre al admin');
                        $scope.products.forEach(function (t) {
                            //repite
                            // console.log('repite');
                            console.log(t);
                            if((t.procesofinalizado == false))
                            {
                                if(t.pagado == false){
                                    sumapendiente = sumapendiente + 1;
                                }
                            }
                        });

                    }else{

                     //   console.log('Suma pendiente');
                        buscarproductsER.forEach(function (t) {
                            //repite
                            //console.log('repite');
                            console.log(t);
                            if(t.idTrabajadora == usuarioLogeado.$id){
                            $scope.products.push(t);

                                if((t.procesofinalizado == false))

                                {
                   // console.log("Trabajos sin finalizar de esta trabajadora")
                                        if(t.pagado == false){
                                        sumapendiente = sumapendiente + 1;
                                        }

                                    };

                                }


                        });
                    }

                    $scope.serviciosPendientes = sumapendiente;

                    // se lo envio a la pantalla principal
                    $(ordenes2).text('(' + $scope.serviciosPendientes + ')');





                    //     document.getElementById('BarraCargando').style.display = 'none';
                });



            });
          } else {
            window.currentAppSalon = "";
            usuarioLogeado = "";
            $('.codigoAcceder').text("acceder");
            console.log(window.currentAppSalon + " NO ENTRE");
           // $(navigationexample).removeClass( "in" );
          };

        });

          //HELPERS*****************************************************************************

          function obtenerFechaHoy() {
              var dia =new Date().getDate();
              var mes = new Date().getMonth();
              var ano = new Date().getFullYear();

              var diafinal;
              var mesfinal;
              if(mes > 10)
              {
                  mesfinal = '0' + mes ;
              }else
              {
                  mesfinal = mes;

              }

              if(dia > 10)
              {
                  diafinal = '0' + mes ;
              }else
              {
                  diafinal = diafinal;

              }

              console.log('esto es un intento de fecha =' + diafinal + mesfinal + ano);

              return diafinal + mesfinal + ano;
          }



          //HELPERS*****************************************************************************


          $(servicios).removeClass( "active" );
          $(ordenes).addClass( "active" );
          $(cobros).removeClass( "active" );
          $(pagos).removeClass( "active" );
          $(administrar).removeClass( "active" );
          $(dashboard).removeClass( "active" );
          $(clientes).removeClass( "active" );

$scope.eliminarOrden = function(product){
    console.log(product);
console.log("123");
console.log(product.id);
var confirm = $mdDialog.confirm()
.title('¿Desea eliminar la orden?')
.ok('Eliminar orden')
.cancel('Cancelar');



$mdDialog.show(confirm).then(function() {
    
  //  firebase.database().ref().child('ordenes/'+product.id).remove();
  
    var ordenesRestantes = firebase.database().ref().child( 'boletaCreada/'+ product.idBoletaComun +'/ordenes');
    var ordenesRestantesER = $firebaseArray(ordenesRestantes);
    
    ordenesRestantesER.$loaded().then(function () {
 
        var numeroRegistros = 0;
        ordenesRestantesER.forEach(function (x) {
            numeroRegistros++;   
    
              // borra el registro de la orden en boleta creada y en ordenes si es que existe
            
            if(x.id == product.id)
            { 
                firebase.database().ref().child('ordenes/'+product.id).remove();
                firebase.database().ref().child( 'boletaCreada/'+ product.idBoletaComun +'/ordenes/'+product.id).remove();
            }
         });
     // si no hay registros restantes se borra la boleta creada
     console.log(numeroRegistros);
         if(numeroRegistros == 1)
         {
            firebase.database().ref().child( 'boletaCreada/'+ product.idBoletaComun).remove();
    
         }
    
    
    
    });

   




});

};





        $scope.realizar = function (product) {
          var boolean = !product.realizado;
          var buscarproducts = firebase.database().ref().child('ordenes');

            console.log(' valor boolean ' + boolean);
          if(boolean){
              console.log(' valor boolean ' + boolean);
              console.log(product);// SI VA A CAMBIAR A TRUE
            if( product.cantidad == 1)
            {
                console.log(' valor boolean ' + boolean);

              if(product.realizado == true)

              {
                  product.cantidad += 1;
                  product.total = product.cantidad * product.valor;
                  $scope.totalAPagar = 0;
                  $scope.products.forEach(function (productos) {
                      $scope.totalAPagar = $scope.totalAPagar + productos.total;
                      var ref = firebase.database().ref().child("/ordenes/").child(product.id);
                      ref.update({
                          realizado : boolean,
                          fechaRealizado : new Date().getTime()
                      });
                      product.realizado = !boolean;
                  });
              }else{
              product.cantidad += 1;
              product.total = product.cantidad * product.valor;
              $scope.totalAPagar = 0;
              $scope.products.forEach(function (productos) {
                $scope.totalAPagar = $scope.totalAPagar + productos.total;
                  var ref = firebase.database().ref().child("/ordenes/").child(product.id);
                  ref.update({
                      realizado : boolean,
                      fechaRealizado : new Date().getTime()
                  });
                  product.realizado = !boolean;


              });}
            }

              $scope.serviciosPendientes  =  $scope.serviciosPendientes - 1;
          }else
          {


              var ref = firebase.database().ref().child("/ordenes/").child(product.$id);
              ref.update({
                  realizado : boolean,
                // tengo que ver como vot a lidiar con los que quitan de realizado , actualizo la fecha a cuando se desrealizo
                  fechaRealizado : new Date().getTime()
              });
              product.realizado = !boolean;
              $scope.serviciosPendientes =  $scope.serviciosPendientes + 1;


          }

            $(ordenes2).text('(' + $scope.serviciosPendientes + ')');

        }


        $scope.finalizarSesion = function () {


          firebase.auth().signOut().then(function() {
            console.log('Signed Out');
            window.currentAppSalon = "";
            console.log(window.currentAppSalon);
            console.log('usuario no validado');
            window.location.replace("/salonsweet2/public/");
          }, function(error) {
            console.error('Sign Out Error', error);
          });
        };

          var trabajadoras = firebase.database().ref('/trabajadoras/');
          var trabajadorasQR = $firebaseArray(trabajadoras);
          trabajadorasQR.$loaded().then(function () {
              $scope.trabajadorasQR = trabajadorasQR;

          });

          $scope.getNameTrabajadora = function (idTrabajadora) {
              var keyTrabajadora = idTrabajadora;
              return  $filter('filter')($scope.trabajadorasQR, {$id:keyTrabajadora})[0].name;
          };


        }]);