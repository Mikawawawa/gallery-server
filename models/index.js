const link = require("./models/db");
const Sequelize = require("sequelize");

const model = {
  Picture: require("./models/Picture"),
  Collection: require("./models/Collection"),
  Article: require("./models/Article")
};

const init = async () => {
  model.Picture.model.belongsTo(model.Collection.model);
  model.Collection.model.hasMany(model.Picture.model);
  await link.sync();
  console.log("[ORM]", "Sync db ok.");
};

init();

module.exports = model;
