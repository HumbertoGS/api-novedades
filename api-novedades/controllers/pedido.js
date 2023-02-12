//Dependencias

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
        num_pedido: `0000${num_venta}`,
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

  return { insert };
}
