//Dependencias
import bcryptjs from "bcrypt";

//Modulos
import { Op, Sequelize } from "sequelize";
import { error } from "../connection/error.js";

// const sentences = store();

//Constantes

export default function (sentences) {
  async function LoginNegocio(data) {
    let { num_identificacion, pass } = data;

    let where = {
      cedula: num_identificacion,
      estado: true,
    };

    const usuario = await sentences.select(
      "db-novedades",
      "cliente",
      ["nombre", "cedula", "contrasena", "id_rol"],
      where
    );

    if (usuario.length !== 0) {
      let isValid = await bcryptjs.compare(pass, usuario[0].contrasena);

      if (!isValid) return [];

      return [
        {
          nombre: usuario[0].nombre,
          cedula: usuario[0].cedula,
          permisos: usuario[0].id_rol,
        },
      ];
    }

    return [];
  }

  async function registroCliente(data) {
    const existe = await sentences.select(
      "db-novedades",
      "cliente",
      ["nombre", "cedula"],
      {
        cedula: data.cedula,
      }
    );

    console.log(existe)

    if (existe.length !== 0)
      throw error("El número de cédula ya cuenta con un registro");

    //encriptar contraseña
    const salt = await bcryptjs.genSalt();
    data.contrasena = await bcryptjs.hash(data.contrasena, salt);

    await sentences.insert("db-novedades", "cliente", {
      ...data,
      id_rol: 3,
    });

    const datosLogin = await sentences.select(
      "db-novedades",
      "cliente",
      ["nombre", "cedula", Sequelize.literal("id_rol as permisos")],
      {
        cedula: data.cedula,
      }
    );

    return {
      datos: datosLogin,
      message: "Se registro correctamente",
    };
  }

  async function AccesoMenu({ cedula }) {
    return await sentences
      .select("db-novedades", "cliente", ["id_rol"], {
        cedula,
        id_rol: { [Op.in]: ["1", "2"] },
      })
      .then((item) => (item.length !== 0 ? true : false));
  }

  return { LoginNegocio, AccesoMenu, registroCliente };
}
