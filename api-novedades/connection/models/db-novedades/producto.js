import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class producto extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "NULL"
    },
    imagen: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    talla: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categoria',
        key: 'id'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    stock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    tamano_original: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    tamano_conversion: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    nombre_imagen: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    codigo: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    fecha_registro: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    fecha_modificacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'producto',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "producto_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
