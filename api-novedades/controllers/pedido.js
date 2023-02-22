//Dependencias
import { Sequelize, Op } from "sequelize";
//Modulos
// import store from "../Connection/dbposgres.js";

// const sentences = store();

//Constantes

export default function (sentences) {
  function fecha() {
    const date = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  function addZeros(str) {
    const desiredLength = 5;
    const currentLength = str.length;
    const zerosToAdd = desiredLength - currentLength;
    return "0".repeat(zerosToAdd) + str;
  }

  async function insert({ orden, totales }) {
    let num_venta = await sentences.rawQuery(
      "select num_venta from resumen_orden order by num_venta desc limit 1"
    );

    if (num_venta.length == 0) num_venta = 1;
    else num_venta = num_venta[0].num_venta + 1;

    await sentences.insert("db-novedades", "resumen_orden", {
      num_venta,
      ...totales,
    });

    for (let item of orden) {
      const { id_cliente, id_producto, cantidad, total_producto } = item;

      await sentences.insert("db-novedades", "orden", {
        num_venta,
        id_cliente,
        id_producto,
        cantidad,
        total_producto,
      });
    }

    return {
      detalle: {
        num_pedido: addZeros(num_venta.toString()),
        fecha: fecha(),
        total: totales.total,
      },
      orden,
      totales: [
        { name: "Subtotal", totales: totales.subtotal },
        { name: "Descuento", totales: totales.descuento },
        { name: "Total", totales: totales.total },
      ],
    };
  }

  async function getPedido() {
    const pedido = await sentences.selectJoin(
      "db-novedades",
      "resumen_orden",
      ["*"],
      {
        id_estado: 1,
      },
      [
        {
          name: "orden",
          as: "ordens",
          required: true,
          sourceKey: "num_venta",
          select: ["id_cliente", "num_venta"],
          where: {},
          include: [
            {
              name: "cliente",
              as: "id_cliente_cliente",
              required: true,
              select: ["id", "cedula", "nombre", "apellido"],
              where: {},
            },
          ],
        },
      ],
      true,
      [["fecha_creacion", "DESC"]]
    );

    let repetido = 0;

    let datos = [];
    pedido.map((item) => {
      if (repetido !== item.num_venta) {
        datos.push({
          id: item.id,
          num_pedido: item.num_venta,
          num_producto: item.total_pedido,
          total: "$" + item.total,
          transferencia: item.transferencia,
          status: item.id_estado,
          estado: item.estado,
          cambio_estado: item.estado,
          id_cliente: item["ordens.id_cliente"],
          num_identificacion: item["ordens.id_cliente_cliente.cedula"],
          nombre_completo: `${item["ordens.id_cliente_cliente.apellido"]} ${item["ordens.id_cliente_cliente.nombre"]}`,
        });
      }
      repetido = item.num_venta;
    });

    return datos;
  }

  async function buscarPedido({ status, num_pedido, num_ident }) {
    let filtroPersona = num_ident ? { cedula: num_ident.trim() } : {};
    let filtroPedido = num_pedido ? { num_venta: Number(num_pedido) } : {};

    const pedido = await sentences.selectJoin(
      "db-novedades",
      "resumen_orden",
      ["*"],
      {
        id_estado: Number(status),
      },
      [
        {
          name: "orden",
          as: "ordens",
          required: true,
          sourceKey: "num_venta",
          select: ["id_cliente", "num_venta"],
          where: filtroPedido,
          include: [
            {
              name: "cliente",
              as: "id_cliente_cliente",
              required: true,
              select: ["id", "cedula", "nombre", "apellido"],
              where: filtroPersona,
            },
          ],
        },
      ],
      true,
      [["fecha_creacion", "DESC"]]
    );

    let repetido = 0;

    let datos = [];
    pedido.map((item) => {
      if (repetido !== item.num_venta) {
        datos.push({
          id: item.id,
          num_pedido: item.num_venta,
          num_producto: item.total_pedido,
          total: "$" + item.total,
          transferencia: item.transferencia,
          status: item.id_estado,
          estado: item.estado,
          fecha_registro: item.fecha_creacion.toLocaleDateString(),
          cambio_estado: item.estado,
          id_cliente: item["ordens.id_cliente"],
          num_identificacion: item["ordens.id_cliente_cliente.cedula"],
          nombre_completo: `${item["ordens.id_cliente_cliente.apellido"]} ${item["ordens.id_cliente_cliente.nombre"]}`,
        });
      }
      repetido = item.num_venta;
    });

    return datos;
  }

  async function getPedidoDetalle({ num_venta }) {
    const detalle = await sentences.selectJoin(
      "db-novedades",
      "orden",
      ["id", "num_venta", "cantidad", "total_producto", "estado"],
      {
        num_venta,
      },
      [
        {
          name: "producto",
          as: "id_producto_producto",
          required: true,
          select: ["nombre", "precio", "categoria", "stock", "codigo"],
          where: {},
          include: [
            {
              name: "categoria",
              as: "categoria_categorium",
              required: true,
              select: ["nombre"],
              where: {},
            },
          ],
        },
      ],
      true,
      [["id", "ASC"]]
    );

    let datos = detalle.map((item) => {
      return {
        id: item.id,
        num_venta: item.num_venta,
        codigo: item["id_producto_producto.codigo"],
        producto: item["id_producto_producto.nombre"],
        precio_unidad: "$" + item["id_producto_producto.precio"],
        cantidad: item.cantidad,
        total: "$" + item.total_producto,
        stock: item["id_producto_producto.stock"],
        estado: item.estado,
        nombre_categoria:
          item["id_producto_producto.categoria_categorium.nombre"],
        id_categoria: item["id_producto_producto.categoria_categorium.id"],
      };
    });

    return datos;
  }

  async function cambiarEstadoPedidoDetalle({ id, estado }) {
    console.log(estado);
    console.log(id);
    return await sentences.update("db-novedades", "orden", { estado }, { id });
  }

  async function cambiarEstadoPedido(data) {
    let { id, transferencia, id_estado } = data;

    return await sentences.update(
      "db-novedades",
      "resumen_orden",
      { id_estado, transferencia },
      { id }
    );
  }

  return {
    insert,
    getPedido,
    buscarPedido,
    getPedidoDetalle,
    cambiarEstadoPedidoDetalle,
    cambiarEstadoPedido,
  };
}
