//Dependencias
import { Sequelize, Op } from "sequelize";
//Modulos

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

  async function buscarPedido({
    status,
    num_pedido,
    num_ident,
    fechaDesde,
    fechaHasta,
  }) {
    let filtroPersona = num_ident ? { cedula: num_ident.trim() } : {};
    let filtroPedido = num_pedido ? { num_venta: Number(num_pedido) } : {};
    let filtroOrden = { id_estado: Number(status) };

    if (fechaDesde && fechaHasta) {
      filtroOrden.fecha_registro = { [Op.between]: [fechaDesde, fechaHasta] };
    }

    const pedido = await sentences.selectJoin(
      "db-novedades",
      "resumen_orden",
      ["*"],
      filtroOrden,
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
              name: "persona",
              as: "id_cliente_persona",
              required: true,
              select: ["id", "cedula", "nombre", "apellido"],
              where: filtroPersona,
            },
          ],
        },
      ],
      true,
      [["fecha_registro", "DESC"]]
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
          fecha_registro: item.fecha_registro,
          id_empleado: item.persona_registro,
          cambio_estado: item.estado,
          id_cliente: item["ordens.id_cliente"],
          num_identificacion: item["ordens.id_cliente_persona.cedula"],
          nombre_completo: `${item["ordens.id_cliente_persona.apellido"]} ${item["ordens.id_cliente_persona.nombre"]}`,
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
          select: ["nombre", "precio", "categoria", "stock", "codigo", "id"],
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
        id_producto: item["id_producto_producto.id"],
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
    const cambio = await sentences.update(
      "db-novedades",
      "orden",
      { estado },
      { id }
    );

    const datosPadre = await sentences.selectJoin(
      "db-novedades",
      "resumen_orden",
      [
        Sequelize.literal("resumen_orden.id as id_orden"),
        "total",
        "subtotal",
        "total_pedido",
      ],
      {},
      [
        {
          name: "orden",
          as: "ordens",
          required: true,
          sourceKey: "num_venta",
          select: ["*"],
          where: { id },
        },
      ],
      true
    );

    let { id_orden, total, subtotal, total_pedido, total_producto } =
      datosPadre[0];

    let totalPedido = estado ? total_pedido + 1 : total_pedido - 1;
    let totalCosto = estado ? total + total_producto : total - total_producto;

    let data = {
      total_pedido: totalPedido,
      estado: totalPedido === 0 ? false : true,
      total: Number(totalCosto.toFixed(2)),
    };

    await sentences.update("db-novedades", "resumen_orden", data, {
      id: id_orden,
    });

    return cambio;
  }

  async function cambiarEstadoPedido(data) {
    let {
      id,
      transferencia,
      id_estado,
      num_venta,
      num_pedido,
      persona_registro,
    } = data;

    const [{ id: id_persona }] = await sentences.select(
      "db-novedades",
      "persona",
      ["id"],
      {
        cedula: persona_registro,
      }
    );

    const actualizado = await sentences.update(
      "db-novedades",
      "resumen_orden",
      { id_estado, transferencia, persona_registro: id_persona },
      { id }
    );

    if (id_estado === 2) {
      let pedidos = await getPedidoDetalle({ num_venta });

      for (let item of pedidos) {
        let { cantidad: cantidadMenos, id_producto } = item;

        await sentences.update(
          "db-novedades",
          "producto",
          {
            cantidad: Sequelize.literal(`producto.cantidad - ${cantidadMenos}`),
          },
          { id: id_producto }
        );

        await sentences.update(
          "db-novedades",
          "producto",
          {
            stock: false,
          },
          { cantidad: 0 }
        );
      }
    }

    return actualizado;
  }

  return {
    insert,
    buscarPedido,
    getPedidoDetalle,
    cambiarEstadoPedidoDetalle,
    cambiarEstadoPedido,
  };
}
