const { Router } = require('express');
const apiRouter = Router();
const heroesRouter = require('./heroes');
const creepsRouter = require('./creeps')
const itemsRouter = require('./items')
const locationRouter = require('./location')
const imagesRouter = require('./images')

apiRouter.use('/heroes', heroesRouter);
apiRouter.use('/creeps', creepsRouter);
apiRouter.use('/items', itemsRouter);
apiRouter.use('/location', locationRouter);
apiRouter.use('/images', imagesRouter);

module.exports = apiRouter;