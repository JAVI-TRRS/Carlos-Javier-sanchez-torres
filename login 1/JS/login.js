document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".login-form");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

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

  function clearError(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error-message")) {
      next.remove();
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validaciones
    if (email.value.trim() === "") {
      showError(email, "El correo es obligatorio.");
      return;
    }

    if (password.value.trim() === "") {
      showError(password, "La contraseña es obligatoria.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value.trim()
        })
      });

      const info = await res.json();

      if (info.success) {
        alert("Inicio de sesión exitoso");
        window.location.href = "dashboard.html";
      } else {
        showError(password, info.message);
      }

    } catch (error) {
      console.error("Error en el servidor:", error);
      showError(password, "Error al conectar con el servidor.");
    }
  });
});
