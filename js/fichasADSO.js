export async function obtenerFichas() {
  const url = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/JUICIOS_ADSO.json";
  const resp = await fetch(url);
  const data = await resp.json();
  return data.fichas || [];
}


