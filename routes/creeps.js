const { Router } = require('express');
const creepsRouter = Router();
require('express-async-errors')
const CreepModel = require('../models/CreepModel')

creepsRouter.get('/', async (req, res) => {
  const name = req.query.name
  const creep = await CreepModel.findOne({ name: name });

  if (!creep) {
    res.status(400).send({ error: 'creep not found' });
    return
  } else {
    res.status(200).send(creep);
  }
})

creepsRouter.post('/locationCreeps', async (req, res) => {
  const namesArr = req.body[0]
  const arr = req.body[1]
  const min = arr[0]
  const max = arr[1]

  const creeps = await CreepModel.aggregate([{$match: {name: {$in: namesArr}}},{$addFields:{count:{ $floor:
    {$sum: [{ $multiply: [ { $rand: {} }, max - min ] }, min]}
 } }}])

  res.status(201).send(creeps);
})

creepsRouter.post('/', async (req, res) => {
  const newCreep = new CreepModel(req.body);
  const { _id } = await newCreep.save();
  res.status(201).send(newCreep);
})

module.exports = creepsRouter;