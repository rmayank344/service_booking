const { DataTypes } = require('sequelize');
const sequelize = require("../config/sql_config");
const USERMODEL = require('./user_model');

const ProCoverageModel = sequelize.define("ProCoverage", {
  address_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pro_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: USERMODEL,
      key: 'user_id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  radius_km: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5,
  },
},
  {
    timestamps: true,
    freezeTableName: true,
    tableName: "ProCoverage",
  }
);

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });


module.exports = ProCoverageModel;