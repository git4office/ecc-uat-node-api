const express = require('express');
const sql = require('mssql/msnodesqlv8');

const router = express.Router();
const {projview,updatetask}  = require('../controller/ctrl-config');



router.get('/ecc/v1/projview',projview)
router.get('/ecc/v1/updatetask',updatetask)








module.exports = router;
