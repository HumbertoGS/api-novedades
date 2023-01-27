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
        id: item.id,
        cedula: item.cedula,
        nombre: item.nombre,
        apellido: item.apellido,
        direccion: item.direccion ?? "",
        referencia: item.referencia ?? "",
        telefono: item.telefono ?? "",
        correo: item.correo ?? "",
        id_rol: item.id_rol,
      };
    });

    return datos;
  }

  async function actualizarDatos(data) {
    const id = data.id;

    delete data.id;

    const update = await sentences.update(
      "db-novedades",
      "cliente",
      { ...data },
      {
        id,
      }
    );

    if (update[0] === 1) return buscarDatos({ numIdent: data.cedula });
    return [];
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

  return { buscarDatos, actualizarDatos, buscarDatosEmpleados, cambiarEstado };
}
