//Dependencias

//Modulos
// import store from "../Connection/dbposgres.js";

// const sentences = store();

//Constantes

export default function (sentences) {
  async function get({ estado }) {
    let filtro = {};
    if (estado) filtro.estado = estado;
    return await sentences.select("db-novedades", "categoria", ["*"], filtro, [
      ["id", "ASC"],
    ]);
  }

  async function insert({ nombre }) {
    return await sentences.insert("db-novedades", "categoria", { nombre });
  }

  async function cambiarEstado({ id, estado }) {
    return await sentences.update(
      "db-novedades",
      "categoria",
      { estado },
      { id }
    );
  }

  return { get, insert, cambiarEstado };
}
