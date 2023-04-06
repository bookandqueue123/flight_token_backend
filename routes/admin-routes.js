const express = require('express')
const adminController = require('../controller/admin-controller')
const auth = require("../middleware/auth")


const router = express.Router()

router.get('/getusers',auth, adminController.getUsers)

module.exports = router;
