const { promisify } = require('util');
const express = require('express');
const path = require('path')
const FILESTORAGE = path.resolve(__dirname, 'path/to/uploadedFiles');
const ImgRouter = express.Router();
const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FILESTORAGE)
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  }
})
const upload = multer({ storage: storage })


ImgRouter.get(
  '/',
  async (req, res) => {
    const data = undefined;
    res.render('index', { data });
  }
);

const formUpload = promisify(
  upload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'pictures' }
  ])
);

ImgRouter.use('/', express.static(FILESTORAGE))


ImgRouter.post(
  '/',
  async (req, res) => {
    try {
      await formUpload(req, res)
    } catch (err) {
      console.error(err);
      return res.json({ error: 'invalid_file' });
    }

    const data = { ...req.body, ...req.files };
    const filesNames = data.pictures.map(file => file.filename)
    
    if (req.header('accept') === 'application/json') {
      res.json(filesNames);
    } else {
      res.render('index', { filesNames });
    }
  }
);

ImgRouter.delete('/:imgId',async (req,res) => {
  const imgId = req.params.imgId
  fs.unlink(path.resolve(__dirname, `path/to/uploadedFiles/${imgId}`), (err) => {
    if (err) {
      console.error(err)
      return
    }
  })
  res.sendStatus(200)
})

module.exports = ImgRouter;