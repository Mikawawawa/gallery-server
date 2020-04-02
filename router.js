const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");

const { Picture, Article, Collection } = require("./models");

router.get("/home", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Collection.home()
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.get("/columns", async (req, res) => {
  try {
    const [collections, articles] = await Promise.all([
      Collection.model.findAll({
        attributes: ["name", "id"],
        where: { name: { [Sequelize.Op.not]: "home" } }
      }),
      Article.model.findAll({
        attributes: ["name", "id"]
      })
    ]);
    res.json({
      success: true,
      data: [
        ...collections.map(item => ({ ...item.dataValues, type: "works" })),
        ...articles.map(item => ({ ...item.dataValues, type: "articles" }))
      ]
    });
  } catch (error) {
    res.json({
      success: false,
      error: error
    });
  }
});

router.get("/gallerys", async (req, res) => {
  try {
    const gallerys = await Collection.model.findAll();
    const data = await Promise.all(
      gallerys.map(async item => ({
        ...item.dataValues,
        list: await item.getPictures().map(pic => pic.dataValues)
      }))
    );
    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, error });
  }
});

router.get("/articles", async (req, res) => {
  try {
    res.json({ success: true, data: await Article.model.findAll() });
  } catch (error) {
    res.json({ success: false, error });
  }
});

router.post("/article/create", async (req, res) => {
  try {
    await Article.createArticle(req.body.name);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
});

router.get("/article/detail", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Article.model.findOne({
        attributes: ["name", "raw", "id"],
        where: { id: req.query.id }
      })
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.post("/article/update", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Article.write(req.body.id, req.body.raw)
    });
  } catch (error) {
    res.json({ success: false, error });
  }
});

router.post("/article/delete", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Article.delete(req.body.id)
    });
  } catch (error) {
    res.json({ success: false, error });
  }
});

router.post("/gallery/create", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Collection.createCollection(req.body.name)
    });
  } catch (error) {
    res.json({ success: false });
  }
});

router.get("/gallery/detail", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Collection.detail(req.query.id)
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.post("/gallery/delete", async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Collection.delete(req.body.id)
    });
  } catch (error) {
    res.json({ success: false });
  }
});

router.post("/gallery/edit", async (req, res) => {
  try {
    await Collection.updateText(req.body.text, req.body.id);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.post("/picture/remove", async (req, res) => {
  try {
    await Collection.removePicture(req.body.pic, req.body.collection);
    res.json({
      success: true
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, require("path").resolve(__dirname, "./public/"));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const picture = await Picture.createPicture(req.file.filename);
    await Collection.addPicture(req.body.id, picture);
    if (req.file.fieldname) {
      res.status(200).json({ success: true, data: req.file.filename });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, error });
  }
});

module.exports = router;
