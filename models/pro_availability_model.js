const { DataTypes } = require("sequelize");
const sequelize = require("../config/sql_config");
const USERMODEL = require("./user_model");
const SERVICEMODEL = require("./service_model");

const ProAvailabilityModel = sequelize.define(
  "ProAvailability",
  {
    slot_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: USERMODEL,
        key: "user_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SERVICEMODEL,
        key: "service_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    day_of_week: {
      type: DataTypes.INTEGER, // 1 = Monday, 7 = Sunday
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    tableName: "ProAvailability",
  }
);

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });

module.exports = ProAvailabilityModel;
