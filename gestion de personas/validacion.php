<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST["nombre"]);
    $apellido = trim($_POST["apellido"]);
    $fecha_nacimiento = $_POST["fecha_nacimiento"];
    $email = trim($_POST["email"]);
    $telefono = trim($_POST["telefono"]);
    $genero = $_POST["genero"];

    $errores = [];

    // Validaciones
    if (empty($nombre)) $errores[] = "El nombre es obligatorio.";
    if (empty($apellido)) $errores[] = "El apellido es obligatorio.";
    if (empty($fecha_nacimiento)) $errores[] = "La fecha de nacimiento es obligatoria.";
    if (empty($email)) {
        $errores[] = "El email es obligatorio.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores[] = "El formato del email no es válido.";
    }
    if (empty($telefono)) $errores[] = "El teléfono es obligatorio.";
    if (empty($genero)) $errores[] = "Debe seleccionar un género.";

    if (count($errores) > 0) {
        echo "<h2>Errores en el formulario:</h2>";
        echo "<ul>";
        foreach ($errores as $error) {
            echo "<li>$error</li>";
        }
        echo "</ul>";
        echo "<a href='Gestion_Personas'>Volver</a>";
    } else {
        echo "<h2>Registro exitoso</h2>";
        echo "<p><strong>Nombre:</strong> $nombre $apellido</p>";
        echo "<p><strong>Fecha de nacimiento:</strong> $fecha_nacimiento</p>";
        echo "<p><strong>Email:</strong> $email</p>";
        echo "<p><strong>Teléfono:</strong> $telefono</p>";
        echo "<p><strong>Género:</strong> $genero</p>";
        echo "<a href='Gestion_Personas'>Registrar otra persona</a>";
    }
}
?>