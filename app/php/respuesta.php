<?php

$data = json_decode(file_get_contents("php://input"));


header('Content-Type: application/json');
echo json_encode($data);



?>