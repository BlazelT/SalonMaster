<?php

//$to = 'otec.estudiosolar@gmail.com';
//$to = 'colaboracionasinc@gmail.com';
//$to = 'panxo_g@hotmail.com,elgaja.p@gmail.com';

$to = 'salonsweet@manosya.cl';

$response = array();
$response['status'] = 'error';
$response['msg'] = '';

$error = 0;



if (empty($_POST['nom']) || empty($_POST['mai']) || empty($_POST['fon']) || empty($_POST['ciu'])){
	$response['msg'] = 'Todos los campos son obligatorios';
	$error = 1;
}
if (empty($_POST['cur']) || $_POST['cur']=='x'){
	$response['msg'] = 'Debe seleccionar un curso';
	$error = 1;
}

if(preg_match("/^[_a-z0-9-]+(\.[_a-z0-9+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i", $_POST['mai']) == false){
	$response['msg'] = 'La dirección de correo no es válida';
	$error = 1;
}

$senceData = 'NO';
if($_POST['sen']=='sence'){
	$senceData = 'SI';
}

$subject = 'Formulario de inscripcion: '.  htmlspecialchars(strip_tags($_POST['nom']));
/*

nom:		$nom.val(),
		mai:		$mai.val(),
		fon:		$fon.val(),
		ciu:		$ciu.val(),
		ocu:		$ocu.val(),
		msg:		$msg.val(),
		cur:		$cur.val(),
		sen:		$sen.val()
	*/

//correo para estudio solar
$message = "\n".'Nombre: '.$_POST['nom'].
	"\n".'Correo: '.$_POST['mai'].
	"\n".'Telefono: '.$_POST['fon'].
	"\n".'Ciudad: '.$_POST['ciu'].
	"\n".'Curso: '.$_POST['cur'].
	"\n"."Franquicia Tributaria SENCE: ".$_POST['sen']."\n";

$message = '
<html><head>
<title>Estudio Solar</title>
<style media="all" type="text/css">
.ReadMsgBody {width: 100%;}
.ExternalClass * {line-height: 100%}
a {text-decoration:none;color:#0073AE;}
table img {display:block;}
td img {display:block;}
body { width: 100% !important; }
div, p, a, li, td { -webkit-text-size-adjust:none; }
p { -webkit-text-size-adjust:none; }
table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
table td {
	border-collapse: collapse;
	mso-table-lspace: 0pt;
	mso-table-rspace: 0pt;
	text-align: center;
}
</style>
<style type="text/css"></style></head>
<body topmargin="0" leftmargin="0" rightmargin="0" bottommargin="0" bgcolor="#ffffff">
<div style="background-color:#ffffff">
<div align="center">

<!--mail-->
<table border="0" cellpadding="0" cellspacing="0" width="600">
	<tr><td width="600" height="116"><img src="http://www.estudiosolar.cl/img/emailing/img_01.jpg" width="600" height="116" border="0" alt="ESTUDIO SOLAR" style="display:block"></td></tr>
	<tr><td width="600">

        <table border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
                <td width="105">&nbsp;</td>
                <td width="90" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">Nombre</td>
                <td width="340" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">: '.$_POST['nom'].'</td>
                <td width="65">&nbsp;</td>
            </tr>
            <tr>
                <td width="105">&nbsp;</td>
                <td width="90" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">Correo</td>
                <td width="340" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">: '.$_POST['mai'].'</td>
                <td width="65">&nbsp;</td>
            </tr>
            <tr>
                <td width="105">&nbsp;</td>
                <td width="90" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">Ciudad</td>
                <td width="340" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">: '.$_POST['ciu'].'</td>
                <td width="65">&nbsp;</td>
            </tr>
            <tr>
                <td width="105">&nbsp;</td>
                <td width="90" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">Tel&eacute;fono</td>
                <td width="340" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">: '.$_POST['fon'].'</td>
                <td width="65">&nbsp;</td>
            </tr>
            <tr>
                <td width="105">&nbsp;</td>
                <td width="90" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">Curso</td>
                <td width="340" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">: '.$_POST['cur'].'</td>
                <td width="65">&nbsp;</td>
            </tr>
            <tr>
                <td width="105">&nbsp;</td>
                <td width="90" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">Franquicia</td>
                <td width="340" style="color:#666; line-height: 14px; font-weight:normal; font-family:Arial, Helvetica, sans-serif; font-size:14px; text-align:left;">: '.$_POST['sen'].'</td>
                <td width="65">&nbsp;</td>
            </tr>
        </table>

    </td></tr>
	<tr><td width="600" height="41"><img src="http://www.estudiosolar.cl/img/emailing/img_03.jpg" width="600" height="41" border="0" alt="ESTUDIO SOLAR" style="display:block"></td></tr>


</table>
<!--fin mail-->

</div>

</div></body></html>';




$header01  = 'MIME-Version: 1.0' . "\r\n";
$header01 .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$header01 .= 'From: ' . htmlspecialchars(strip_tags($_POST['nom'])) . ' <' . htmlspecialchars(strip_tags($_POST['mai'])) . '' . "\r\n" .
    'Reply-To: ' . $_POST['mai'] . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

if ($_SERVER['REQUEST_METHOD'] == 'POST' && $error==0){
	if (mail($to, $subject, $message, $header01)){
		$response['msg'] = 'Mensaje enviado';
		$response['status'] = 'ok';
		enviarCorreoAutomaticoCliente(); //si es exitoso continuamos enviando la respuesta al cliente.
	}else{
		$response['msg'] = 'Ha ocurrido un error, por favor intente más tarde';
	}

}

 function enviarCorreoAutomaticoCliente(){

 // Correo para el cliente

$messageAutomatica = "\n".'Nombre: '.$_POST['nom'].
	"\n".'Correo: '.$_POST['mai'].
	"\n".'Telefono: '.$_POST['fon'].
	"\n".'Ciudad: '.$_POST['ciu'].
	"\n".'Curso: '.$_POST['cur'].
	"\n"."Franquicia Tributaria SENCE: ".$_POST['sen']."\n";


$messageAutomatica = '<html><body>';

//$messageAutomatica .= '<img width="400" height="89"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAABZCAYAAAAQL3IEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozNkZENzYzMDM5RThFMzExQUM1NEJFQjRFM0UxNjlFQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxMzE2NTk4QjJGOTQxMUU0ODhCRkIyNDQ1RTk2ODAxMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMzE2NTk4QTJGOTQxMUU0ODhCRkIyNDQ1RTk2ODAxMSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkM3MDlBMzY3RDJGMEUzMTE4QzRCRDIwMkUzM0M4QTc4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0RkQ3NjMwMzlFOEUzMTFBQzU0QkVCNEUzRTE2OUVDIi8+IDwvcmRmOkRlc2NyaXB0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" alt="Estudio Solar" />';

$messageAutomatica .= '<table rules="all" style="border-color: #666;" cellpadding="10">';
$messageAutomatica .= "<tr style='background: #eee;'><td><strong>Nombre:</strong> </td><td>" . strip_tags($_POST['nom']) . "</td></tr>";
$messageAutomatica .= "<tr><td><strong>Email:</strong> </td><td>" . strip_tags($_POST['mai']) . "</td></tr>";
$messageAutomatica .= "<tr><td><strong>Teléfono:</strong> </td><td>" . strip_tags($_POST['fon']) . "</td></tr>";
$messageAutomatica .= "<tr><td><strong>Ciudad:</strong> </td><td>" . strip_tags($_POST['ciu']) . "</td></tr>";
$messageAutomatica .= "<tr><td><strong>Franquicia Tributaria:</strong> </td><td>" . htmlentities($_POST['sen']) . "</td></tr>";
$messageAutomatica .= "<tr><td><strong>Curso:</strong> </td><td>" . $_POST['cur'] . "</td></tr>";
//variable dependiendo del curso


$messageAutomatica .= "<tr><td  colspan=\"2\" ><strong> Nos Contactaremos con usted a la brevedad, Gracias por contactar a Estudio Solar </strong>
</td></tr>";



$messageAutomatica .= "</table>";
$messageAutomatica .= "</body></html>";


$headers = "From: Estudio Solar - Inscripción Curso <contacto@estudiosolar> \r\n";
//$headers .= "Reply-To: ". strip_tags($_POST['mai']) . "\r\n"; por ahora no lo agregamos pero podemos hacer una redireccion si lo deseamos.
//$headers .= "CC: colaboracionasinc@gmail\r\n"; con copia a
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";



$subjectAutomatica = 'Respuesta automatica';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && $error==0){
	if (mail($_POST['mai'],$subjectAutomatica, $messageAutomatica, $headers)){
		$response['msg'] = 'Mensaje enviado';
		$response['status'] = 'ok';

		//GuardarnEnDb();

	}else{
		$response['msg'] = 'Ha ocurrido un error, por favor intente más tarde';
	}

}


}

//ahora que ya se confirmo los envios guardamos en la base de datos
//Conexion a base de datos e insert a tabla cliente.




function GuardarnEnDb()
{


$conn    = Connect();
$nombredb    = $conn->real_escape_string($_POST['nom']);
$correodb   = $conn->real_escape_string($_POST['mai']);
$telefonodb    = $conn->real_escape_string($_POST['fon']);
$ciudaddb    = $conn->real_escape_string($_POST['ciu']);
$cursodb = $conn->real_escape_string($_POST['cur']);
$franquiciadb = $conn->real_escape_string($_POST['sen']);

$query   = "INSERT into Cliente (nombre,correo,telefono,ciudad,curso,franquicia) VALUES('"
. $nombredb . "','"
. $correodb . "','"
. $telefonodb . "','"
. $ciudaddb . "','"
. $cursodb . "','"
. $franquiciadb . "')";
$success = $conn->query($query);

if (!$success) {
    die("Couldn't enter data: ".$conn->error);

}


}



	//Funcion para conectarnos a la DB local Mysql

	function Connect()
	{
	 $dbhost = "localhost";
	 $dbuser = "estudio2_cursos";
	 $dbpass = "estudio.Admnuevo2017";
	 $dbname = "estudio2_db_cursos";

	 // Create connection
	 $conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname) or die($conn->connect_error);

	 return $conn;
    }




$response['POST'] = $_POST;
echo json_encode($response);
?>