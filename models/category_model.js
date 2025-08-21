const { DataTypes } = require('sequelize');
const sequelize = require("../config/sql_config");

const CATEGORYMODEL = sequelize.define('category_model', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true, // created_at & updated_at
  freezeTableName: true,
  tableName: "category_model",
});

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });

module.exports = CATEGORYMODEL;