document.addEventListener("DOMContentLoaded", () => {
  
  const form = document.querySelector(".login-form");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  // Mostrar error
  function showError(input, message) {
    clearError(input);

    const error = document.createElement("p");
    error.className = "error-message";
    error.textContent = message;
    error.style.color = "#d10000";
    error.style.fontSize = "13px";
    error.style.marginTop = "4px";

    input.insertAdjacentElement("afterend", error);
  }

  // Limpiar error existente
  function clearError(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error-message")) {
      next.remove();
    }
  }

  // Validar correo con expresión regular
  function validateEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // evita enviar si hay errores

    let valid = true;

    // Limpiar errores previos
    clearError(email);
    clearError(password);

    // Validación del correo
    if (email.value.trim() === "") {
      showError(email, "El correo es obligatorio.");
      valid = false;
    } else if (!validateEmail(email.value.trim())) {
      showError(email, "Ingresa un correo válido.");
      valid = false;
    }

    // Validación de la contraseña
    if (password.value.trim() === "") {
      showError(password, "La contraseña es obligatoria.");
      valid = false;
    }

    // Si todo está correcto
    if (valid) {
      console.log("Formulario válido, enviando...");

      // Mensaje de éxito
      alert("Inicio de sesión exitoso");

      // Si quieres redirigir:
      // window.location.href = "dashboard.html";

      form.submit(); // (déjalo solo si usas envío real)
    }
  });
});
