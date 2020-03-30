const path = require("path");
const sequelize = require(path.resolve(__dirname, "./db"));
const Sequelize = require("sequelize");
const Util = require(path.resolve(__dirname, "../util"));

class Picture extends Sequelize.Model {}
Picture.init(
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      unique: true
    },
    path: Sequelize.STRING(100)
  },
  { sequelize, modelName: "Picture" }
);

exports.createPicture = path => {
  return Picture.create({
    id: Util.uuid(),
    path
  });
  // .then(res => console.log(res.dataValues))
  // .catch(e => console.log(e.sqlMessage, e.sqlState));
};

exports.model = Picture;
