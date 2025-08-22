const { DataTypes } = require("sequelize");
const sequelize = require("../config/sql_config");
const USERMODEL = require("./user_model");
const SERVICEMODEL = require("./service_model");
const PROAVAILABILITYMODEL = require("./pro_availability_model");

const BookingModel = sequelize.define(
  "Booking",
  {
    booking_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: USERMODEL,
        key: "user_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  pro_id: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: USERMODEL,
    key: "user_id",
  },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
},
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SERVICEMODEL,
        key: "service_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PROAVAILABILITYMODEL,
        key: "slot_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    addon_ids: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
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
    booking_status: {
      type: DataTypes.ENUM("PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"),
      defaultValue: "PENDING",
    },
    idempotency_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    tableName: "Booking",
    indexes: [
      {
        unique: true,
        fields: ["slot_id", "pro_id"],
      },
    ],
  }
);

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });


module.exports = BookingModel;
