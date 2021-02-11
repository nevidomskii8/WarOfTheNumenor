const { Router } = require('express');
const apiRouter = Router();
const heroesRouter = require('./heroes');


apiRouter.use('/heroes', heroesRouter);

module.exports = apiRouter;