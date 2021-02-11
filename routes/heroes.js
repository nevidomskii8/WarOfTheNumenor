const { Router } = require('express');
const heroesRouter = Router();
require('express-async-errors')
const HeroModel = require('../models/HeroModel')


heroesRouter.get('/',async (req,res) => {
  const pictures = await HeroModel.find({});
  res.status(200).json(pictures)
})


heroesRouter.get('/:heroLogin',async (req,res) => {
  const picture = await HeroModel.find({login: req.params.heroLogin});
  
  if (!picture) {
    res.status(400).send({ error: 'Hero not found' });
    return
  } else {
    res.status(200).send(picture);
  }
})

heroesRouter.post('/', async (req, res) => {
  const newHero = new HeroModel(req.body);
  const { _id } = await newHero.save();
  res.status(201).send(newHero);
})

module.exports = heroesRouter;