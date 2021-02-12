const { Router } = require('express');
const itemsRouter = Router();
require('express-async-errors')
const ItemModel = require('../models/ItemModel')


itemsRouter.get('/',async (req,res) => {
  const items = await ItemModel.find({});
  res.status(200).json(items)
})


itemsRouter.get('/:name',async (req,res) => {
  const item = await ItemModel.find({name: req.params.name});
  
  if (!item) {
    res.status(400).send({ error: 'creep not found' });
    return
  } else {
    res.status(200).send(item);
  }
})

itemsRouter.post('/', async (req, res) => {
  const newItem = new ItemModel(req.body);
  const { _id } = await newItem.save();
  res.status(201).send(newItem);
})

module.exports = itemsRouter;