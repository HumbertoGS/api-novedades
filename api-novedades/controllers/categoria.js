//Dependencias

//Modulos
// import store from "../Connection/dbposgres.js";

// const sentences = store();

//Constantes

export default function (sentences) {
  async function get() {
    return await sentences.select("db-novedades", "categoria", ["*"], {}, [
      ["id", "ASC"],
    ]);
  }

  async function insert({ nombre }) {
    return await sentences.insert("db-novedades", "categoria", { nombre });
  }

  return { get, insert };
}
