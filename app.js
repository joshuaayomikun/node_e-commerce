
require('dotenv').config()
const express =  require('express');
const { json, urlencoded } = require('body-parser');
const user = require('./routes/user')
const { connect }  = require('mongoose');
const cors  = require('cors');
const app = express();
// or use require if you prefer

const env = process.env
// console.log({DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DATABASE} = env)
connect(
    `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });
app.use(cors());
app.options('*', cors());
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use(json({
  limit: '50mb'
}));

app.use(urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));

app.use('/api', user);

app.get("/", async (req, res) => {
  res.send(new Buffer('wahoo'))
});

app.all("*", (req, res) =>
  res.status(404).json({
    error: "Page not found!",
  })
);

module.exports  =app;