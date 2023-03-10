//Dependencias

//Modulos
import { Op, Sequelize } from "sequelize";
import { error } from "../connection/error.js";

export default function (sentences) {
  async function buscarDatos({ numIdent }) {
    let datos = await sentences.select("db-novedades", "persona", ["*"], {
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
      "persona",
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
      "persona",
      ["id", "cedula", "nombre", "apellido", "estado"],
      {
        id_rol: 2,
      }
    );
  }

  async function registrarEmpleado({ id }) {
    if (id === 1)
      throw error("Este usuario no puede registrarse como empleado");

    const existe = await sentences.select("db-novedades", "persona", ["id"], {
      id_rol: 2,
      id,
    });

    if (existe.length !== 0) throw error("Usuario ya ha sido agregado", 400);

    return await sentences.update(
      "db-novedades",
      "persona",
      { id_rol: 2 },
      { id }
    );
  }

  async function cambiarEstado({ id, estado }) {
    return await sentences.update(
      "db-novedades",
      "persona",
      { estado },
      { id }
    );
  }

  return {
    buscarDatos,
    actualizarDatos,
    buscarDatosEmpleados,
    registrarEmpleado,
    cambiarEstado,
  };
}
