//Dependencias

//Modulos
// import store from "../Connection/dbposgres.js";
import { Op, Sequelize } from "sequelize";

// const sentences = store();

//Constantes

export default function (sentences) {
  async function LoginNegocio(data) {
    let { num_identificacion, pass, codigo } = data;

    let where = {
      cedula: num_identificacion,
      contrasena: pass,
    };

    if (codigo) {
      where.codigo = codigo;
      where.id_rol = { [Op.in]: ["1", "2"] };
    } else {
      where.id_rol = 3;
    }

    return await sentences.select(
      "db-novedades",
      "cliente",
      ["nombre", "cedula"],
      where
    );
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

    if (existe.length == 0) {
      await sentences.insert("db-novedades", "cliente", {
        ...data,
        id_rol: 3,
      });

      const datosLogin = await sentences.select(
        "db-novedades",
        "cliente",
        ["nombre", "cedula"],
        {
          cedula: data.cedula,
          id_rol: 3,
        }
      );

      return {
        datos: datosLogin,
        message: "Se registro correctamente",
      };
    }
    return {
      datos: [],
      message: "El número de cédula ya cuenta con un registro",
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
