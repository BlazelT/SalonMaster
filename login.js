/**
 * Created by andro on 13-06-2017.
 */
var ingresarVendedora= document.getElementById('google');

ingresarVendedora.addEventListener('click', function() {

    var email = document.getElementById('correo').value;
    var password = document.getElementById('password').value;

    if(email.toLowerCase() == 'mauro')
    {
          email = 'mauro@mauro.cl';
          password = 'nuevomauro';
    }
    if(email.toLowerCase()  == 'muriel')
    {
        email = 'salonsweet@manosya.cl';
        password = '123456';
    }
    if(email.toLowerCase()  == 'geraldine')
    {
        email = 'geraldine@salonsweet.com';
        password = '123456aa';
    }	
	
    if(email.toLowerCase()  == 'kathy')
    {
        email = 'katherineanrojas@gmail.com';
        password = '123456';
    }  

	if(email.toLowerCase()  == 'barby')
    {
          email = 'rachell.romero.a@gmail.com';
          password = '123456';
    }
    if(email.toLowerCase() == 'dani')
    {
        email = 'danialejandra.pr@gmail.com';
        password = '123456';
    }

	  if(email.toLowerCase()  == 'feña')
    {
        email = 'sofesaje20@gmail.com';
        password = '123456';
    } 

	  if(email.toLowerCase()  == 'mary')
    {
        email = 'marymagda_81@hotmail.com';
        password = '123456';
    }    
	
	  if(email.toLowerCase() == 'refka')
    {
        email = 'rc.chacoff@hotmail.com';
        password = '123456';
    } 
	
	  if(email.toLowerCase()  == 'coni1')
    {
        email = 'coni.villate@gmail.com';
        password = '123456';
    } 
	
	  if(email.toLowerCase()  == 'coni2')
    {
        email = 'constanza.ortiz.r@gmail.com';
        password = '123456';
    } 
	

    firebase.auth().signInWithEmailAndPassword(email, password).then(
        function(s){
            console.log(s);
/*
            firebase.database().ref('/admins/' + s.uid).once('value').then(function(snapshot) {
                if (snapshot.val() != null)
                    window.location.href = 'admin';

                else {
                    alert('Este usuario no es Admin');
                    firebase.auth().signOut();
                }
            });*/


                window.location.href = 'app';
        },
        function(e) {
            console.log(e);

            alert('ESTE USUARIO NO EXISTE EN NUESTRA BASE DE DATOS, PONGA SE ENCONTACTO CON SALON SWEET');
            document.getElementById('BarraCargando').style.display = 'none';
            document.getElementById('signIn').style.display = 'block';
        }
    );
});
