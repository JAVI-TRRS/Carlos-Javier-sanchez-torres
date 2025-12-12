// public/js/validar_login.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        limpiarMensajes();

        const usuario = document.getElementById('usuario').value.trim();
        const contraseña = document.getElementById('contraseña').value;

        const error = validarLogin(usuario, contraseña);
        if (error) {
            mostrarError(error);
            return;
        }

        enviarLogin(usuario, contraseña);
    });
});

function validarLogin(usuario, contraseña) {
    if (!usuario || !contraseña) {
        return 'Usuario y contraseña son obligatorios';
    }
    if (usuario.length < 3) {
        return 'El usuario debe tener al menos 3 caracteres';
    }
    if (contraseña.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
}

/**
 * Envia login contra backend PHP (LoginController)
 */
function enviarLogin(usuario, contraseña) {
    mostrarInfo('Validación completada. Iniciando sesión...');

    const payload = {
        usuario: usuario,
        // clave alineada con PHP: "password"
        password: contraseña
    };

    // Ruta relativa coherente
    fetch('./../../../public/api/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mostrarExito(data.message || 'Login exitoso. Redirigiendo...');

            // Si el backend devuelve una URL de redirect, usarla; si no, usar la ruta por defecto
            setTimeout(() => {
                if (data.redirect) {
                    window.location.href = data.redirect;
                } else {
                    window.location.href = './../../index.html';
                }
            }, 1500);
        } else {
            mostrarError(data.message || 'Usuario o contraseña incorrectos');
        }
    })
    .catch(err => {
        console.error('Error en login:', err);
        mostrarError('Error al comunicarse con el servidor');
    });
}

/** Utilidades básicas de UI, muy simples */
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
        const form = document.getElementById('loginForm');
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
