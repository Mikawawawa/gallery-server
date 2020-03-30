const path = require("path");
const sequelize = require(path.resolve(__dirname, "./db"));

const Sequelize = require("sequelize");
const Util = require(path.resolve(__dirname, "../util"));

class Article extends Sequelize.Model {}
Article.init(
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      unique: true
    },
    raw: Sequelize.TEXT(),
    name: Sequelize.STRING(100)
  },
  { sequelize, modelName: "Article" }
);

exports.createArticle = name => {
  return Article.create({
    id: Util.uuid(),
    name,
    raw: ""
  });
  // .then(res => console.log(res.dataValues))
  // .catch(e => console.log(e.sqlMessage, e.sqlState));
};

exports.delete = id => {
  return Article.destroy({
    where: { id }
  });
};

exports.write = (id, raw) => {
  return Article.update(
    {
      raw
    },
    {
      where: { id }
    }
  );
};

exports.model = Article;
