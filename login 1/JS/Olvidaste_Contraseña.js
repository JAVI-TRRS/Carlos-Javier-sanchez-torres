document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector(".recover-form");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Evita que recargue la página

        // Crear o mostrar mensaje
        let mensaje = document.getElementById("mensaje-envio");

        // Si no existe, lo creamos
        if (!mensaje) {
            mensaje = document.createElement("p");
            mensaje.id = "mensaje-envio";
            mensaje.style.color = "green";
            mensaje.style.marginTop = "15px";
            mensaje.style.fontWeight = "bold";
            form.appendChild(mensaje);
        }

        mensaje.textContent = "Envío realizado";
        mensaje.style.display = "block";
    });

});
