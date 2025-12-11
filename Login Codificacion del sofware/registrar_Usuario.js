document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector(".register-form");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const pass1 = document.getElementById("password").value.trim();
        const pass2 = document.getElementById("password2").value.trim();

        let mensaje = document.getElementById("msg");

        // Si no existe el mensaje, lo creamos
        if (!mensaje) {
            mensaje = document.createElement("p");
            mensaje.id = "msg";
            mensaje.style.marginTop = "15px";
            mensaje.style.fontWeight = "bold";
            form.appendChild(mensaje);
        }

        // Validaciones simples
        if (!nombre || !correo || !pass1 || !pass2) {
            mensaje.textContent = "Por favor completa todos los campos.";
            mensaje.style.color = "red";
            return;
        }

        if (pass1 !== pass2) {
            mensaje.textContent = "Las contraseñas no coinciden.";
            mensaje.style.color = "red";
            return;
        }

        // Si todo está bien
        mensaje.textContent = "Registro exitoso";
        mensaje.style.color = "green";
    });

});
