const { Router } = require('express');
const creepsRouter = Router();
require('express-async-errors')
const CreepModel = require('../models/CreepModel')


creepsRouter.get('/',async (req,res) => {
  const creeps = await CreepModel.find({});
  res.status(200).json(creeps)
})


creepsRouter.get('/:name',async (req,res) => {
  const creep = await CreepModel.find({name: req.params.name});
  
  if (!creep) {
    res.status(400).send({ error: 'creep not found' });
    return
  } else {
    res.status(200).send(creep);
  }
})

creepsRouter.post('/', async (req, res) => {
  const newCreep = new CreepModel(req.body);
  const { _id } = await newCreep.save();
  res.status(201).send(newCreep);
})

module.exports = creepsRouter;