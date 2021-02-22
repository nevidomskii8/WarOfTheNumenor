const { Router } = require('express');
const heroesRouter = Router();
require('express-async-errors')
const HeroModel = require('../models/HeroModel')


heroesRouter.get('/',async (req,res) => {
  const hero = await HeroModel.find({});
  res.status(200).json(hero)
})


heroesRouter.get('/:heroLogin',async (req,res) => {
  const hero = await HeroModel.find({login: req.params.heroLogin});
  const setOnline = await HeroModel.findOneAndUpdate({login: req.params.heroLogin},{$set:{isOnline:true}})

  if (!hero) {
    res.status(400).send({ error: 'Hero not found' });
    return
  } else {
    res.status(200).send(hero);
  }
})


heroesRouter.put('/logout/:heroId',async (req,res) => {
  const setOffline = await HeroModel.findOneAndUpdate({login: req.params.heroId},{$set:{isOnline:false}})

  if (!setOffline) {
    res.status(400).send({ error: 'Hero not found' });
    return
  } else {
    res.status(200).send(setOffline);
  }
})

heroesRouter.put('/equip/:heroId', async (req, res) => {
  const herodata = req.body
  const hero = await HeroModel.findOneAndUpdate(req.params.heroId,herodata)

  res.status(200).send(hero);
})

heroesRouter.put('/:heroId', async (req, res) => {
  const herodata = req.body
  const hero = await HeroModel.findOneAndUpdate(req.params.heroId,herodata)

  res.status(200).send(herodata);
})

heroesRouter.post('/', async (req, res) => {
  const newHero = new HeroModel(req.body);
  const { _id } = await newHero.save();
  res.status(201).send(newHero);
})

module.exports = heroesRouter;