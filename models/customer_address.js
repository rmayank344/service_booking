const { DataTypes } = require('sequelize');
const sequelize = require("../config/sql_config");
const USERMODEL = require('./user_model');

const CustomerAddressModel = sequelize.define("CustomerAddress", {
  address_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: USERMODEL,
      key: 'user_id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  address_line: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
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
},
  {
    timestamps: true,
    freezeTableName: true,
    tableName: "CustomerAddress",
  }
);

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });


module.exports = CustomerAddressModel;