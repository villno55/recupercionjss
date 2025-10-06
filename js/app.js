import { obtenerFichas } from "./fichasADSO.js";
import { obtenerAprendices } from "./aprendicesFicha.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usuario = localStorage.getItem("usuario");
  if (!usuario) {
    alert("Debe iniciar sesión primero.");
    window.location.href = "index.html";
    return;
  }

  const nombreUsuario = document.getElementById("nombreUsuario");
  const btnSalir = document.getElementById("btnSalir");
  const selectFicha = document.getElementById("selectFicha");
  const selectAprendiz = document.getElementById("selectAprendiz");
  const nombreCompleto = document.getElementById("nombreCompleto");
  const estadoGeneral = document.getElementById("estadoGeneral");
  const aprobados = document.getElementById("aprobados");
  const porEvaluar = document.getElementById("porEvaluar");
  const tablaJuicios = document.getElementById("tablaJuicios");

  let aprendices = [];

  nombreUsuario.textContent = usuario;

  btnSalir.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  const fichas = await obtenerFichas();
  selectFicha.innerHTML = '<option value="">Seleccione una ficha</option>';

  fichas.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.url;
    opt.textContent = f.codigo;
    selectFicha.appendChild(opt);
  });

  selectFicha.addEventListener("change", async () => {
    tablaJuicios.innerHTML = "";
    selectAprendiz.innerHTML = '<option value="">Seleccione un aprendiz</option>';
    nombreCompleto.textContent = "";
    estadoGeneral.textContent = "";
    aprobados.textContent = "";
    porEvaluar.textContent = "";

    const urlFicha = selectFicha.value;
    if (!urlFicha) return;

    aprendices = await obtenerAprendices(urlFicha);
    if (!aprendices || aprendices.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No hay aprendices";
      selectAprendiz.appendChild(opt);
      return;
    }

    aprendices.forEach(a => {
      const opt = document.createElement("option");
      opt.value = a.documento;
      opt.textContent = `${a.nombres} ${a.apellidos} - ${a.documento}`;
      selectAprendiz.appendChild(opt);
    });
  });

  selectAprendiz.addEventListener("change", () => {
    const doc = selectAprendiz.value;
    if (!doc) return;

    const aprendiz = aprendices.find(a => a.documento === doc);
    if (!aprendiz) return;

    nombreCompleto.textContent = `${aprendiz.nombres} ${aprendiz.apellidos} (${aprendiz.documento})`;

    let aprobadosCount = 0;
    let porEvaluarCount = 0;
    tablaJuicios.innerHTML = "";

    aprendiz.juicios.forEach(j => {
      const tr = document.createElement("tr");

      const tdResultado = document.createElement("td");
      tdResultado.textContent = j.resultado || "—";
      tr.appendChild(tdResultado);

      const tdEstado = document.createElement("td");
      tdEstado.textContent = j.estado || "—";
      tr.appendChild(tdEstado);

      const tdFecha = document.createElement("td");
      if (j.estado && j.estado.toUpperCase() === "APROBADO" && j.fecha && j.fecha !== "Sin fecha") {
        tdFecha.textContent = j.fecha;
      } else {
        tdFecha.textContent = "—";
      }
      tr.appendChild(tdFecha);

      const tdInstructor = document.createElement("td");
      tdInstructor.textContent = j.instructor || "—";
      tr.appendChild(tdInstructor);

      tablaJuicios.appendChild(tr);

      if (j.estado && j.estado.toUpperCase() === "APROBADO") aprobadosCount++;
      if (j.estado && j.estado.toUpperCase() === "POR EVALUAR") porEvaluarCount++;
    });

    estadoGeneral.textContent = aprobadosCount > 0 ? "Con avances" : "Pendiente";
    aprobados.textContent = aprobadosCount;
    porEvaluar.textContent = porEvaluarCount;
  });
});




