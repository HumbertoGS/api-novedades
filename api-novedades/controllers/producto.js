//Dependencias
import { Sequelize } from "sequelize";
import sharp from "sharp";

// const sentences = store();

//Constantes

export default function (sentences) {
  function generateUUID() {
    var d = new Date().getTime();
    var uuid = "xxxxxx4xxxxxyxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  async function get({ stock }) {
    let filtro = {};

    if (stock) filtro.stock = stock;

    return await sentences.selectJoin(
      "db-novedades",
      "producto",
      ["*"],
      filtro,
      [
        {
          name: "categoria",
          as: "categoria_categorium",
          required: true,
          select: [
            Sequelize.literal(
              "categoria_categorium.nombre as nombre_categoria"
            ),
          ],
          where: {
            // estado: true
          },
        },
      ],
      true,
      [["id", "ASC"]]
    );
  }

  async function insert(data) {
    let imageData;
    let nameFile;
    let id = null;

    const datosForm = JSON.parse(data.body.data);
    let datos = datosForm;
    
    if (datos.id) {
      id = datos.id;
      delete datos.id;
    }

    if (datos.nombre === "") {
      const [{ nombre }] = await sentences.select(
        "db-novedades",
        "categoria",
        ["nombre"],
        { id: datos.categoria }
      );

      datos.nombre = nombre;
    }

    if (data.file) {
      const MyImage = data.file.buffer;
      let extension = data.file.mimetype.split("/");
      extension = extension[1];

      const ImageBuf = await sharp(MyImage)
        .toFormat(extension, { quality: 70 })
        .toBuffer();

      imageData = await sharp(ImageBuf).metadata();

      nameFile = generateUUID();

      datos = {
        ...datos,
        nombre_imagen: `${nameFile}.${extension}`,
        nombre_original: data.file.originalname,
        tipo: extension,
        tamano_original: (data.file.size / 1000).toString() + "KB",
        tamano_conversion: (imageData.size / 1000).toString() + "KB",
        imagen: `data:image/png;base64,${ImageBuf.toString("base64")}`,
      };
    }

    console.log(datos);
    console.log(id);

    if (id) {
      //SE ACTUALIZA
      return await sentences.update("db-novedades", "producto", datos, { id });
    } else {
      //SE INSERTA
      return await sentences.insert("db-novedades", "producto", datos);
      console.log(`data:image/png;base64,${ImageBuf.toString("base64")}`);
    }
  }

  async function cambiarEstado({ id, estado }) {
    return await sentences.update(
      "db-novedades",
      "producto",
      { stock: estado },
      { id }
    );
  }

  return { get, insert, cambiarEstado };
}
