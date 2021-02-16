const { Router } = require('express');
const apiRouter = Router();
const heroesRouter = require('./heroes');
const creepsRouter = require('./creeps')
const itemsRouter = require('./items')


apiRouter.use('/heroes', heroesRouter);
apiRouter.use('/creeps', creepsRouter);
apiRouter.use('/items', itemsRouter);


module.exports = apiRouter;