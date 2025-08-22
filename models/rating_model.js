const { DataTypes } = require("sequelize");
const sequelize = require("../config/sql_config");
const USERMODEL = require("./user_model");
const BOOKINGMODEL = require("./booking_model");

const RatingModel = sequelize.define(
  "Rating",
  {
    rating_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BOOKINGMODEL,
        key: "booking_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
      allowNull: false,
      references: {
        model: USERMODEL,
        key: "user_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    tableName: "Rating",
    indexes: [
      {
        unique: true,
        fields: ["booking_id"], 
      },
    ],
  }
);

// sequelize.sync({ force: false }) // Uncomment if you want to sync this model
//   .then(() => {
//     console.log("Rating table created!");
//   });

module.exports = RatingModel;