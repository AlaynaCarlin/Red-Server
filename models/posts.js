const { DataTypes } = require("sequelize");
const db = require("../db");

const Posts = db.define("posts", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  product: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  brand: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

module.exports = Posts;