const { DataTypes } = require('sequelize');
const sequelize = require("../config/sql_config");
const SERVICEMODEL = require('./service_model');

const ADDONMODEL = sequelize.define('addon_model', {
  addon_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SERVICEMODEL,
      key: 'service_id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  extra_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true,
  freezeTableName: true,
  tableName: "addon_model",
});

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });

module.exports = ADDONMODEL;