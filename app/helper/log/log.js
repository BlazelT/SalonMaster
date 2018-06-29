/**
 * Created by M on 05-04-2018.
 */
'use strict';

angular.module('log', ['ngRoute'])
.service('LogFlaite', function () {
 
    this.Info = function (message,origen) {
            
       
        this.log(message,origen,'Info');
       
    }

     this.Warning = function (message,origen) {
            
            
            this.log(message,origen,'Warning');

        }
    
      this.Debug = function (message,origen) {
            
            
            this.log(message,origen,'Debug');

    }

    this.Error = function (message,origen) {
            
            
        this.log(message,origen,'Error');

     }
     this.Fatal = function (message,origen) {
            
            
        this.log(message,origen,'Fatal');

     }
     
        this.log = function (message,origen,tipo) {
            
                var user = window.currentAppSalon ;
        
                console.log(Date.now());
                firebase.database().ref('log/'+this.obtenerFechaHoy() +'/'+ tipo +'/'+ origen +'/'+ user.uid + '/' +  Date.now()).set(
                    {
                        mensaje : message,
                       
                       
                                             
                    });
                 }


    //helper
      //helper
      this.obtenerFechaHoy = function () {
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
    

  })
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/helper/log', {
            templateUrl: 'helper/log/log.html',
            controller: 'HelperCtrl'
        });
    }])
    .controller('HelperCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$mdDialog', '$http',
        function($scope,$firebaseObject, $firebaseArray, $mdDialog,$http) {

                //ALL
                //Info
                //Warning
                //Debug
                //Error
                //Fatal
                //Off 
            
            

        }]);