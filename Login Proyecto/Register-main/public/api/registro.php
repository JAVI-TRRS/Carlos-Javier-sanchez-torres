<?php
declare(strict_types=1);

header('Content-Type: application/json');

require_once __DIR__ . '/../../app/Controllers/RegistroController.php';

$input = json_decode(file_get_contents('php://input'), true) ?? [];

$usuario         = $input['usuario']         ?? '';
$email           = $input['email']           ?? '';
$password        = $input['password']        ?? '';
$passwordConfirm = $input['passwordConfirm'] ?? '';

$controller = new RegistroController();
$response   = $controller->register($usuario, $email, $password, $passwordConfirm);

echo json_encode($response);
