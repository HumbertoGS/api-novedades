import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class cliente extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cedula: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    apellido: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    contrasena: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    codigo: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rol',
        key: 'id'
      }
    },
    referencia: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    notificar: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cliente',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cliente_codigo_uindex",
        unique: true,
        fields: [
          { name: "codigo" },
        ]
      },
      {
        name: "cliente_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
