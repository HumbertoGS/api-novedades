//Dependencias

//Modulos
import store from "../Connection/dbposgres.js";

const sentences = store();

//Constantes

export default function () {
  async function get() {
    return await sentences.select("db-novedades", "categoria", ["*"]);
  }

  return { get };
}
