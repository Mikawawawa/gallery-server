const path = require("path");
const sequelize = require(path.resolve(__dirname, "./db"));

const Sequelize = require("sequelize");
const Util = require(path.resolve(__dirname, "../util"));

class Collection extends Sequelize.Model {}
Collection.init(
  {
    id: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      unique: true
    },
    name: Sequelize.STRING(100)
  },
  { sequelize, modelName: "Collection" }
);

exports.createCollection = name => {
  return Collection.create({
    id: Util.uuid(),
    name
  });
  // .then(res => console.log(res.dataValues))
  // .catch(e => console.log(e.sqlMessage, e.sqlState));
};

exports.addPicture = async (collection, pictures) => {
  const theCollection = await Collection.findOne({
    where: { id: collection }
  });
  return await theCollection.addPicture(pictures);
};

exports.detail = async collection => {
  const theCollection = await Collection.findOne({
    where: { id: collection }
  });

  return {
    list: (await theCollection.getPictures()).map(item => item.dataValues),
    name: theCollection.dataValues.name
  };
};

exports.home = async collection => {
  const theCollection = await Collection.findOne({
    where: { name: "home" }
  });
  console.log(theCollection);
  if (!theCollection) {
    return {
      list: [],
      name: "home"
    };
  }
  return {
    list: (await theCollection.getPictures()).map(item => item.dataValues),
    name: theCollection.dataValues.name
  };
};

exports.delete = async collection => {
  return await Collection.destroy({
    where: { id: collection }
  });
};

exports.removePicture = async (picId, collection) => {
  const [thePic, theCollection] = await Promise.all([
    require("./Picture").model.findOne({ where: { id: picId } }),
    Collection.findOne({ where: { id: collection } })
  ]);
  return await theCollection.removePicture(thePic);
};

exports.model = Collection;
