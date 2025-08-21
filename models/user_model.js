const { DataTypes } = require('sequelize');
const sequelize = require("../config/sql_config");

const USERMODEL = sequelize.define('user_model',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('customer', 'pro', 'admin'),
      allowNull: false,
      defaultValue: 'customer',
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    timestamps: true, 
    freezeTableName: true,
    tableName: "user_model",
  }
);

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });

module.exports = USERMODEL;