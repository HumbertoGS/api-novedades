import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class resumen_orden extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    num_venta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: "resumen_orden_num_venta_key"
    },
    subtotal: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'estado',
        key: 'id'
      }
    },
    total_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transferencia: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    persona_registro: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'persona',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'resumen_orden',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "resumen_orden_num_venta_key",
        unique: true,
        fields: [
          { name: "num_venta" },
        ]
      },
      {
        name: "resumen_orden_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
