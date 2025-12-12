// public/js/validar_registro.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registroForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        limpiarMensajes();

        const usuario    = document.getElementById('usuario').value.trim();
        const email      = document.getElementById('email').value.trim();
        const contraseña = document.getElementById('contraseña').value;
        const confirmar  = document.getElementById('confirmar').value;

        const error = validarRegistro(usuario, email, contraseña, confirmar);
        if (error) {
            mostrarError(error);
            return;
        }

        enviarRegistro(usuario, email, contraseña, confirmar);
    });
});

function validarRegistro(usuario, email, contraseña, confirmar) {
    if (!usuario || !email || !contraseña || !confirmar) {
        return 'Todos los campos son obligatorios';
    }

    if (usuario.length < 3 || usuario.length > 20) {
        return 'El usuario debe tener entre 3 y 20 caracteres';
    }

    if (!/^[a-zA-Z0-9]+$/.test(usuario)) {
        return 'El usuario solo puede contener letras y números';
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Formato de email inválido';
    }

    if (contraseña.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }

    if (contraseña !== confirmar) {
        return 'Las contraseñas no coinciden';
    }

    return null;
}

function enviarRegistro(usuario, email, contraseña, confirmar) {
    mostrarInfo('Validación completada. Enviando datos...');

    const payload = {
        usuario: usuario,
        email: email,
        password: contraseña,
        passwordConfirm: confirmar
    };

    fetch('./../../../public/api/registro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            mostrarExito(data.message || 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.');

            const form = document.getElementById('registroForm');
            if (form) form.reset();

            // opcional: redirigir automáticamente al login
            setTimeout(() => {
                window.location.href = './login.html';
            }, 2000);
        } else {
            mostrarError(data.message || 'No se pudo completar el registro');
        }
    })
    .catch(err => {
        console.error('Error en registro:', err);
        mostrarError('Error al comunicarse con el servidor');
    });
}

// Reutilizamos las mismas utilidades que en login
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
        const form = document.getElementById('registroForm');
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
