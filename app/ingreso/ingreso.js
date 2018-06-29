'use strict';


angular.module('myApp.ingresos', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/ingresos', {
            templateUrl: 'ingresos/ingresos.html',
            controller: 'ingresosCtrl'
        });
    }])

    .controller('ingresosCtrl', ['$scope', '$firebaseObject', '$firebaseArray','$routeProvider', '$mdDialog',
        function($scope ,$firebaseObject,$routeProvider, $firebaseArray,$mdDialog) {


            var user = window.currentAppSalon ;

            console.log('Ingresoooo : ' + user);
            console.log(user.$id);
            console.log(user.uid );


            firebase.database().ref('trabajadoras/').child(user.$id || user.uid || 'offline').once('value', function(snapshot) {
                var exists = (snapshot.val() !== null);
                console.log(exists);
                var usuarioLogeado ="";
                $scope.serviciosPendientes = 0;

                if (exists == true) {
                    var ref = firebase.database().ref('/trabajadoras/').child(user.$id || user.uid);
                    var usersLocal = $firebaseObject(ref);
                    usersLocal.$loaded().then(function () {
                        // se asigna la informacion de usuario de la bd a la variable.

                        usuarioLogeado = usersLocal;
                        console.log(usuarioLogeado);


                        if(usuarioLogeado.perfil == 'administrador'){
                            $(servicios).show(true);
                            $(ordenes).show(true);
                            $(cobros).show(true);
                            $(cobros).hide(true);


                            console.log('Soy admin');

                            $routeProvider.otherwise({redirectTo: '/view1'});

                        };

                        if(usuarioLogeado.perfil == 'trabajadora'){
                            $(servicios).show();
                            $(ordenes).show();
                            $(cobros).show();
                            $(pagos).show();
                            $(administrar).removeClass( "active" );
                            console.log('Soy normal');

                            $routeProvider.otherwise({redirectTo: '/view2'});
                        }


                    });
                } else {
                    window.currentAppSalon = "";
                    usuarioLogeado = "";
                    $('.codigoAcceder').text("acceder");
                    console.log(window.currentAppSalon + " NO ENTRE");
                    // $(navigationexample).removeClass( "in" );
                };

            });







        }]);

