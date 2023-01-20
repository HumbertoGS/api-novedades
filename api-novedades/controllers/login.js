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

  async function LoginCliente({ num_identificacion, pass }) {
    return await sentences.select(
      "db-novedades",
      "cliente",
      ["nombre", "cedula"],
      {
        cedula: num_identificacion,
        contrasena: pass,
      }
    );
  }

  async function AccesoMenu({ cedula }) {
    return await sentences
      .select("db-novedades", "cliente", ["id_rol"], {
        cedula,
        id_rol: { [Op.in]: ["1", "2"] },
      })
      .then((item) => (item.length !== 0 ? true : false));
  }

  return { LoginNegocio, AccesoMenu };
}
