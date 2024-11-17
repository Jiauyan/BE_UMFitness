const errorHandler = require("./utils/errorHandler");
const express = require("express");
const cors = require("cors");

const router = require("./api/v1/routes");

const app = express();

//middlewares

//configs
//require("module-alias/register");

//routes
app.use(express.json());
// Allow specific origin
app.use(cors({ origin: 'https://fe-we-fit.vercel.app' }));

// Or, to allow all origins
app.use(cors());
app.use("/", router);
app.use(express.static('public'));

// Root route to prevent "Cannot GET /" error
app.get('/', (req, res) => {
    res.send('Welcome to My Express App on Vercel!');
  });

  app.use((req, res, next) => {
    console.log(`Request URL: ${req.originalUrl}`);
    next();
  });

//handle errors
app.use(errorHandler);

module.exports = app;
