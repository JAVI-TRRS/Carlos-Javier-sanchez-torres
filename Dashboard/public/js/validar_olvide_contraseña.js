// public/js/validar_olvide_contraseña.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('forgotPasswordForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        limpiarMensajes();

        const email = document.getElementById('email').value.trim();

        const error = validarEmailRecuperacion(email);
        if (error) {
            mostrarError(error);
            return;
        }

        enviarForgotPassword(email);
    });
});

function validarEmailRecuperacion(email) {
    if (!email) {
        return 'El email es obligatorio';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Formato de email inválido';
    }
    return null;
}

function enviarForgotPassword(email) {
    mostrarInfo('Email válido. Enviando solicitud de recuperación...');

    const payload = { email: email };

    fetch('./../../../public/api/forgot_password.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mostrarExito(
                data.message || 'Si el email existe, recibirás instrucciones de recuperación.'
            );

            setTimeout(() => {
                window.location.href = './login.html';
            }, 3000);
        } else {
            mostrarError(data.message || 'No se pudo procesar la solicitud');
        }
    })
    .catch(err => {
        console.error('Error en recuperación:', err);
        mostrarError('Error al comunicarse con el servidor');
    });
}

// utilidades
function limpiarMensajes() {
    const cont = document.getElementById('mensaje');
    if (cont) cont.remove();
}

function crearContenedorMensaje() {
    let cont = document.getElementById('mensaje');
    if (!cont) {
        cont = document.createElement('div');
        cont.id = 'mensaje';
        cont.style.marginTop = '15px';
        const form = document.getElementById('forgotPasswordForm');
        form.parentNode.insertBefore(cont, form.nextSibling);
    }
    cont.className = '';
    cont.textContent = '';
    return cont;
}

function mostrarError(msg) {
    const cont = crearContenedorMensaje();
    cont.className = 'mensaje-error';
    cont.textContent = msg;
}

function mostrarExito(msg) {
    const cont = crearContenedorMensaje();
    cont.className = 'mensaje-exito';
    cont.textContent = msg;
}

function mostrarInfo(msg) {
    const cont = crearContenedorMensaje();
    cont.className = 'mensaje-info';
    cont.textContent = msg;
}
