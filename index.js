const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('express-async-errors');
const apiRouter = require('./routes');
const config = require('config');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRouter);


if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, './client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build/index.html'))
  });
}

app.use((err, req, res, next) => {
  res
    .status(500)
    .send({ error: err.message })
});


const PORT = process.env.PORT || config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT} port`)
    });
  }
  catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()