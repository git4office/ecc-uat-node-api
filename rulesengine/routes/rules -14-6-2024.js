const express = require('express');
const sql = require('mssql/msnodesqlv8');

const router = express.Router();
const {projview,addalarmdata,email,getescalation,updateescalationstage,subequipmentname,updatetimerrecord}  = require('../controller/ctrl-rules');
const {datapoints,totaldatapoints,postdatapointvalue,addrules,getinputdatapointvalue,getalarmdata,getbuildingname,getprojectfieldsforrules}  = require('../controller/ctrl-rules');
const {createtimerrecord,getpointdescription}  = require('../controller/ctrl-rules');

const urlPart = '/ecc/v1/'

router.get(urlPart+'projview',projview)
router.post('/ecc/v1/addalarmdata',addalarmdata)
router.get('/ecc/v1/email',email)
router.get('/ecc/v1/datapoints',datapoints)
router.get('/ecc/v1/totaldatapoints',totaldatapoints)
router.post('/ecc/v1/postdatapointvalue',postdatapointvalue)
router.post('/ecc/v1/addrules',addrules)
router.get('/ecc/v1/getinputdatapointvalue',getinputdatapointvalue)
router.get('/ecc/v1/getalarmdata',getalarmdata)
router.get('/ecc/v1/getescalation',getescalation)
router.post('/ecc/v1/updateescalationstage',updateescalationstage)
router.get('/ecc/v1/subequipmentname',subequipmentname)
router.get('/ecc/v1/getbuildingname',getbuildingname)
router.post('/ecc/v1/updatetimerrecord',updatetimerrecord)
router.get('/ecc/v1/getprojectfieldsforrules',getprojectfieldsforrules)
router.post('/ecc/v1/createtimerrecord',createtimerrecord)
router.get('/ecc/v1/getpointdescription',getpointdescription)


//router.get('/ecc/v1/updatetask',updatetask)








module.exports = router;
