import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _categoria from  "./categoria.js";
import _cliente from  "./cliente.js";
import _orden from  "./orden.js";
import _producto from  "./producto.js";
import _resumen_orden from  "./resumen_orden.js";
import _rol from  "./rol.js";

export default function initModels(sequelize) {
  const categoria = _categoria.init(sequelize, DataTypes);
  const cliente = _cliente.init(sequelize, DataTypes);
  const orden = _orden.init(sequelize, DataTypes);
  const producto = _producto.init(sequelize, DataTypes);
  const resumen_orden = _resumen_orden.init(sequelize, DataTypes);
  const rol = _rol.init(sequelize, DataTypes);

  producto.belongsTo(categoria, { as: "categoria_categorium", foreignKey: "categoria"});
  categoria.hasMany(producto, { as: "productos", foreignKey: "categoria"});
  orden.belongsTo(cliente, { as: "id_cliente_cliente", foreignKey: "id_cliente"});
  cliente.hasMany(orden, { as: "ordens", foreignKey: "id_cliente"});
  orden.belongsTo(producto, { as: "id_producto_producto", foreignKey: "id_producto"});
  producto.hasMany(orden, { as: "ordens", foreignKey: "id_producto"});
  orden.belongsTo(resumen_orden, { as: "num_venta_resumen_orden", foreignKey: "num_venta"});
  resumen_orden.hasMany(orden, { as: "ordens", foreignKey: "num_venta"});
  cliente.belongsTo(rol, { as: "id_rol_rol", foreignKey: "id_rol"});
  rol.hasMany(cliente, { as: "clientes", foreignKey: "id_rol"});

  return {
    categoria,
    cliente,
    orden,
    producto,
    resumen_orden,
    rol,
  };
}