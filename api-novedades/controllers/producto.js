//Dependencias
import { Sequelize, Op } from "sequelize";
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

  function validarFechaEnRango(inicio, fin, fecha) {
    return (
      inicio.valueOf() <= fecha.valueOf() && fecha.valueOf() <= fin.valueOf()
    );
  }

  function restarDias(fecha) {
    fecha.setDate(fecha.getDate() + -7);
    return fecha;
  }

  function getBase64Size(base64String) {
    const padding = base64String.endsWith("==")
      ? 2
      : base64String.endsWith("=")
      ? 1
      : 0;
    const byteLength = (base64String.length / 4) * 3 - padding;
    return byteLength;
  }

  function addZeros(str) {
    const desiredLength = 5;
    const currentLength = str.length;
    const zerosToAdd = desiredLength - currentLength;
    return "0".repeat(zerosToAdd) + str;
  }

  async function get({ stock }) {
    const fechaFin = new Date();
    const fechaInicio = restarDias(new Date());

    let filtro = {};

    if (stock) filtro.stock = stock;

    let datos = await sentences.selectJoin(
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
      [["id", "DESC"]]
    );

    datos = datos.map((item) => {
      return {
        ...item,
        newProducto: validarFechaEnRango(
          fechaInicio,
          fechaFin.getTime(),
          new Date(item.fecha_registro).getTime()
        ),
      };
    });

    return datos;
  }

  async function insert(datos) {
    let imageData;
    let nameFile;
    let id = null;
    let codigo = "1";

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

    if (!datos.codigo) {
      codigo = await sentences.rawQuery(
        "select id from producto order by id desc limit 1"
      );
      codigo = addZeros((codigo[0].id + 1).toString());
    }

    if (datos.imagen) {
      const separacion = datos.imagen.split(",");
      let extension = "jpg";

      if (separacion.length === 2) {
        const ext = separacion[0].split("/")[1].split(";")[0];
        if (ext === "png" || ext === "jpg" || ext === "gif") {
          extension = ext;
        }
      }

      const base64Data = separacion[separacion.length - 1];
      const MyImage = Buffer.from(base64Data, "base64");

      // const MyImage = data.file.buffer;
      // let extension = data.file.mimetype.split("/");
      // extension = extension[1];

      const ImageBuf = await sharp(MyImage)
        .toFormat(extension, { quality: 70 })
        .toBuffer();

      // imageData = await sharp(ImageBuf).metadata();

      nameFile = generateUUID();

      datos = {
        ...datos,
        nombre_imagen: `${nameFile}.${extension}`,
        tamano_original: (getBase64Size(base64Data) / 1000).toString() + "KB",
        tamano_conversion: (ImageBuf.length / 1000).toString() + "KB",
        imagen: `data:image/png;base64,${ImageBuf.toString("base64")}`,
      };
    }

    datos = {
      ...datos,
      codigo,
      precio: Number(datos.precio),
    };

    if (id) {
      //SE ACTUALIZA
      return await sentences.update("db-novedades", "producto", datos, { id });
    } else {
      //SE INSERTA
      return await sentences.insert("db-novedades", "producto", datos);
      return;
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

  async function reporte({ fechaDesde, fechaHasta }) {
    let filtro = {};
    let queryProductoVendidos = " group by p.nombre, id_producto, p.id;";
    let queryCategoriaVendidos = " and p.categoria =  c.id ";

    if (fechaDesde && fechaHasta) {
      filtro.fecha_registro = { [Op.between]: [fechaDesde, fechaHasta] };
      queryProductoVendidos =
        `and orden.fecha_registro between '${fechaDesde}' and '${fechaHasta}'` +
        queryProductoVendidos;
      queryCategoriaVendidos =
        `and orden.fecha_registro between '${fechaDesde}' and '${fechaHasta}'` +
        queryCategoriaVendidos;
    }

    const reporte = await sentences.select(
      "db-novedades",
      "producto",
      [
        "codigo",
        "nombre",
        "precio",
        "categoria",
        "cantidad",
        "stock",
        Sequelize.literal(`(
          select count(id_producto) as vendido from orden
          where orden.id_producto = producto.id
          )`),
        "fecha_registro",
      ],
      filtro,
      [["id", "DESC"]]
    );

    const producto_vendidos = await sentences.rawQuery(`
        select p.nombre, id_producto, count(id_producto) as conteo,
          (
            select orden.fecha_registro from orden
            where orden.id_producto = p.id limit 1
          )
        from orden
        inner join producto p on p.id = orden.id_producto
        ${queryProductoVendidos}
      `);

    const categoria_vendidos = await sentences.rawQuery(`
      select c.nombre, (
      select  count(p.categoria) as conteo from orden
      inner join producto p on p.id = orden.id_producto
      ${queryCategoriaVendidos}
      ) from categoria c 
    `);

    let datosProducto = producto_vendidos.map((item) => {
      return {
        name: item.nombre,
        id_producto: item.id_producto,
        conteo: Number(item.conteo),
      };
    });

    let datosCategoria = categoria_vendidos.map((item) => {
      return {
        subject: item.nombre,
        conteo: Number(item.conteo),
        fullMark: 150,
      };
    });

    let datosProductoCantidad = reporte.map((item) => {
      return {
        ...item,
        disponible: Number(item.cantidad),
        vendido: Number(item.vendido),
      };
    });

    return { datosProductoCantidad, datosCategoria, datosProducto };
  }

  return { get, insert, cambiarEstado, reporte };
}
