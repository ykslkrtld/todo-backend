"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 8000;

/* ------------------------------------------------------- */
// Accept json data and convert to object
app.use(express.json()) // builtin-middleware

// Asnc errors to errorHandler
require('express-async-errors')

/* ------------------------------------------------------- */

// Routes
app.use(require('./app/routes/todo.router'))

/* ------------------------------------------------------- */

// ErrorHandler
app.use(require('./app/middlewares/errorHandler'))

/* ------------------------------------------------------- */
app.listen(PORT, () => console.log("Running: http://127.0.0.1:" + PORT));