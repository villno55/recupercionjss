import { obtenerFichas } from "./fichasADSO.js";
import { obtenerAprendices } from "./aprendicesFicha.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = localStorage.getItem("usuario");
  if (!usuario) {
    alert("Debe iniciar sesión primero.");
    window.location.href = "index.html";
    return;
  }

  // Referencias
  const nombreUsuario = document.getElementById("nombreUsuario");
  const btnSalir = document.getElementById("btnSalir");
  const selectFicha = document.getElementById("selectFicha");
  const selectAprendiz = document.getElementById("selectAprendiz");
  const nombreCompleto = document.getElementById("nombreCompleto");
  const estadoGeneral = document.getElementById("estadoGeneral");
  const aprobados = document.getElementById("aprobados");
  const porEvaluar = document.getElementById("porEvaluar");
  const tablaJuicios = document.getElementById("tablaJuicios");

  nombreUsuario.textContent = usuario;

  btnSalir.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  // Cargar fichas
  const fichas = await obtenerFichas();
  selectFicha.innerHTML = '<option value="">Seleccione una ficha</option>';

  fichas.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.url;
    opt.textContent = f.codigo;
    selectFicha.appendChild(opt);
  });

  // Cuando cambia la ficha
  selectFicha.addEventListener("change", async () => {
    tablaJuicios.innerHTML = "";
    selectAprendiz.innerHTML = '<option value="">Seleccione un aprendiz</option>';

    const urlFicha = selectFicha.value;
    if (!urlFicha) return;

    const aprendices = await obtenerAprendices(urlFicha);
    aprendices.forEach(a => {
      const opt = document.createElement("option");
      opt.value = JSON.stringify(a);
      opt.textContent = a.documento;
      selectAprendiz.appendChild(opt);
    });
  });

  // Cuando cambia el aprendiz
  selectAprendiz.addEventListener("change", () => {
    const valor = selectAprendiz.value;
    if (!valor) return;

    const aprendiz = JSON.parse(valor);
    nombreCompleto.textContent = `${aprendiz.nombres} ${aprendiz.apellidos}`;

    let aprobadosCount = 0;
    let porEvaluarCount = 0;
    tablaJuicios.innerHTML = "";

    aprendiz.juicios.forEach(j => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${j.resultado}</td>
        <td>${j.estado}</td>
        <td>${j.fecha || "Sin fecha"}</td>
        <td>${j.instructor || "Sin asignar"}</td>
      `;
      tablaJuicios.appendChild(tr);

      if (j.estado === "APROBADO") aprobadosCount++;
      if (j.estado === "POR EVALUAR") porEvaluarCount++;
    });

    estadoGeneral.textContent = aprobadosCount > 0 ? "Con avances" : "Pendiente";
    aprobados.textContent = aprobadosCount;
    porEvaluar.textContent = porEvaluarCount;
  });
});


