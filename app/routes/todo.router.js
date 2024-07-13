"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */


// Routes
// const router = express.Router()
const router = require('express').Router() // normalde express import etme işini app de yapmıştık fakat cont router derken burada express başta import edilmediğinden önce express import edip sonra router çalıştırıyoruz

// Controller
const todo = require('../controllers/todo.controller')


/* ------------------------------------------------------- *

// List todos
router.get('/', todo.list)

// create todo
router.post('/', todo.create )

// Read Todo
router.get('/:id', todo.read)

// Update Todo
router.put('/:id', todo.update)

// Delete Todo
router.delete('/:id', todo.delete)

/* ------------------------------------------------------- */

router.route('/')
    .get(todo.list)
    .post(todo.create)

router.route('/:id')
    .get(todo.read)
    .put(todo.update)
    .delete(todo.delete)


module.exports = router