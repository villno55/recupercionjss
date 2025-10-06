export async function obtenerAprendices(urlFicha) {
  try {
    const resp = await fetch(urlFicha);
    const data = await resp.json();

    const aprendicesMap = {};

    data.forEach(item => {
      const doc = item["Número de Documento"];
      if (!aprendicesMap[doc]) {
        aprendicesMap[doc] = {
          documento: doc,
          nombres: item["Nombre"],
          apellidos: item["Apellidos"],
          juicios: []
        };
      }

      aprendicesMap[doc].juicios.push({
        resultado: item["Resultado de Aprendizaje"] || "N/A",
        estado: item["Juicio de Evaluación"] || "N/A",
        fecha: item["Fecha"] || "Sin fecha",
        instructor: item["Funcionario que registro el juicio evaluativo"] || "No registrado"
      });
    });

    const aprendices = Object.values(aprendicesMap);
    console.log(" Aprendices procesados:", aprendices);
    return aprendices;
  } catch (error) {
    console.error(" Error al obtener aprendices:", error);
    return [];
  }
}


