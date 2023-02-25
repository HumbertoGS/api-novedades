import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _categoria from  "./categoria.js";
import _estado from  "./estado.js";
import _orden from  "./orden.js";
import _persona from  "./persona.js";
import _producto from  "./producto.js";
import _resumen_orden from  "./resumen_orden.js";
import _rol from  "./rol.js";

export default function initModels(sequelize) {
  const categoria = _categoria.init(sequelize, DataTypes);
  const estado = _estado.init(sequelize, DataTypes);
  const orden = _orden.init(sequelize, DataTypes);
  const persona = _persona.init(sequelize, DataTypes);
  const producto = _producto.init(sequelize, DataTypes);
  const resumen_orden = _resumen_orden.init(sequelize, DataTypes);
  const rol = _rol.init(sequelize, DataTypes);

  producto.belongsTo(categoria, { as: "categoria_categorium", foreignKey: "categoria"});
  categoria.hasMany(producto, { as: "productos", foreignKey: "categoria"});
  resumen_orden.belongsTo(estado, { as: "id_estado_estado", foreignKey: "id_estado"});
  estado.hasMany(resumen_orden, { as: "resumen_ordens", foreignKey: "id_estado"});
  orden.belongsTo(persona, { as: "id_cliente_persona", foreignKey: "id_cliente"});
  persona.hasMany(orden, { as: "ordens", foreignKey: "id_cliente"});
  resumen_orden.belongsTo(persona, { as: "persona_registro_persona", foreignKey: "persona_registro"});
  persona.hasMany(resumen_orden, { as: "resumen_ordens", foreignKey: "persona_registro"});
  orden.belongsTo(producto, { as: "id_producto_producto", foreignKey: "id_producto"});
  producto.hasMany(orden, { as: "ordens", foreignKey: "id_producto"});
  orden.belongsTo(resumen_orden, { as: "num_venta_resumen_orden", foreignKey: "num_venta"});
  resumen_orden.hasMany(orden, { as: "ordens", foreignKey: "num_venta", sourceKey: "num_venta"});
  persona.belongsTo(rol, { as: "id_rol_rol", foreignKey: "id_rol"});
  rol.hasMany(persona, { as: "personas", foreignKey: "id_rol"});

  return {
    categoria,
    estado,
    orden,
    persona,
    producto,
    resumen_orden,
    rol,
  };
}
