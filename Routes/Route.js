const express = require("express")
const router = express.Router();
const fs = require('fs');
const accountRoutes = require('./CRUD/account.js'); //import account routes
const todotRoutes = require('./CRUD/todo.js'); //import todoList routes

router.use(accountRoutes) //use account route
router.use(todotRoutes) 
module.exports = router;
