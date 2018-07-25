'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
    'ngMaterial',
    'firebase',
  'myApp.view1',
  'myApp.view2',
  'myApp.cobros',
  'myApp.adm1',
  'myApp.clientes',
  'myApp.pagos',
  'angular.filter',
    'myApp.ingresos',
    'myApp.dashboard',
    'myApp.sugerencias',
    'log',
    "angucomplete-alt"
  
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  var validateUser = function () {
    var data;
    for (var i = 0, len = localStorage.length; i < len; ++i) {
      var str = localStorage.key(i);
      console.log(str);
      var patt = new RegExp('firebase:authUser:');
      if (patt.test(str)) {
        window.currentAppSalon = JSON.parse(localStorage.getItem(str));
        console.log(window.currentAppSalon);
        
      //  var logflaite = log();
        //log.Info('Se valida firebase');
        
       
        
        return true;
      }
    }
    return false;
  }

  if (validateUser()) {
    $routeProvider.otherwise({redirectTo: '/view1'});
    console.log(window.currentAppSalon);
    
  } else {
    window.currentAppSalon = "";
    console.log(window.currentAppSalon);
    console.log('usuario no validado');
   // window.location.replace("/salonsweet2/public/");

  }/*
  firebase.database().ref().child('trabajadoras').child(window.currentAppSalon.uid).on('value',function(snapshot){
    console.log(snapshot.val().name);
    
            });

     */  
  /*
    var logout_app= document.getElementById('logout_app');

   

    logout_app.addEventListener('click', function() {

        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
            window.currentAppSalon = "";
            console.log(window.currentAppSalon);
            console.log('usuario no validado');
            window.location.replace("/");
        }, function(error) {
            console.error('Sign Out Error', error);
        });

    });*/

      //  var email = document.getElementById('correo').value;
       // var password = document.getElementById('password').value;

      //  email = 'contacto@maurorojas.cl';
      //  password = '2Undertaker';

     //   firebase.auth().signInWithEmailAndPassword(email, password).then(
     //       function(s){
      //          console.log(s);
                /*
                            firebase.database().ref('/admins/' + s.uid).once('value').then(function(snapshot) {
                                if (snapshot.val() != null)
                                    window.location.href = 'admin';

                                else {
                                    alert('Este usuario no es Admin');
                                    firebase.auth().signOut();
                                }
                            });*/


      //          window.location.href = 'app';
    //        },
 //           function(e) {
     //           console.log(e);

   //             alert('ESTE USUARIO NO EXISTE EN NUESTRA BASE DE DATOS, PONGA SE ENCONTACTO CON SALON SWEET');
  //              document.getElementById('BarraCargando').style.display = 'none';
  //              document.getElementById('signIn').style.display = 'block';
     //       }
   //     );
   // });



   

}]);
