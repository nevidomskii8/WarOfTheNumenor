const { Router } = require('express');
const locationRouter = Router();
require('express-async-errors')
const LocationModel = require('../models/LocationModel')

locationRouter.get('/',async (req,res) => {
  const loc = await LocationModel.find({lvl: req.query.lvl});
  
  if (!loc) {
    res.status(400).send({ error: 'loc not found' });
    return
  } else {
    res.status(200).send(loc);
  }
})

locationRouter.post('/', async (req, res) => {
  const newLoc = new LocationModel(req.body);
  const { _id } = await newLoc.save();
  res.status(201).send(newLoc);
})

module.exports = locationRouter;