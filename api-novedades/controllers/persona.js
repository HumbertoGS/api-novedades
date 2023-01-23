//Dependencias

//Modulos
import { Op, Sequelize } from "sequelize";

export default function (sentences) {
  async function buscarDatos({ numIdent }) {
    let datos = await sentences.select(
      "db-novedades",
      "cliente",
      ["cedula", "nombre", "apellido", "direccion", "referencia"],
      {
        cedula: numIdent,
      }
    );

    datos = datos.map((item) => {
      return {
        cedula: item.cedula,
        nombre: item.nombre,
        apellido: item.apellido,
        direccion: item.direccion ?? "",
        referencia: item.referencia ?? "",
      };
    });

    console.log(datos);
    return datos;
  }

  return { buscarDatos };
}
