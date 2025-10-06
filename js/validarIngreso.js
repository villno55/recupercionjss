export function validarIngreso(usuario, clave) {
  const claveValida = "06102025";
  if (clave === claveValida) {
    localStorage.setItem("usuario", usuario);
    return true;
  } else {
    return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const mensajeError = document.getElementById("mensajeError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value.trim();

    if (validarIngreso(usuario, clave)) {
      window.location.href = "juiciosAprendicesFicha.html";
    } else {
      mensajeError.textContent = "La contraseña es incorrecta.";
    }
  });
});
