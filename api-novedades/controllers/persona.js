//Dependencias

//Modulos
import { Op, Sequelize } from "sequelize";

export default function (sentences) {
  async function buscarDatos({ numIdent }) {
    let datos = await sentences.select("db-novedades", "cliente", ["*"], {
      cedula: numIdent,
    });

    datos = datos.map((item) => {
      return {
        cedula: item.cedula,
        nombre: item.nombre,
        apellido: item.apellido,
        direccion: item.direccion ?? "",
        referencia: item.referencia ?? "",
        telefono: item.telefono ?? "",
        correo: item.correo ?? "",
      };
    });

    return datos;
  }

  async function buscarDatosEmpleados() {
    return await sentences.select(
      "db-novedades",
      "cliente",
      ["id", "cedula", "nombre", "apellido", "contrasena", "codigo", "estado"],
      {
        id_rol: 2,
      }
    );
  }

  async function cambiarEstado({ id, estado }) {
    return await sentences.update(
      "db-novedades",
      "cliente",
      { estado },
      { id }
    );
  }

  return { buscarDatos, buscarDatosEmpleados, cambiarEstado };
}
