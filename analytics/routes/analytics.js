const express = require('express');
const sql = require('mssql/msnodesqlv8');

const router = express.Router();
const {tasklist,taskDetailsByAlarmId,alarmdata,test,alarmfilterdata,closealarm,addtask,taskfilterdata,cityforcombo,campusforcombo,buildingforcombo,countryforcombo,citycampus,avgdatapointvalue,closetask,buildingname,equipmentname,email,addalarmdata}  = require('../controller/ctrl-ana');
const {getcalculation,dashboardlogin,dashboardlogout,avgdpval}  = require('../controller/ctrl-ana');



router.get('/ecc/v1/tasklist',tasklist)
router.get('/ecc/v1/taskbyalarmid',taskDetailsByAlarmId)
router.get('/ecc/v1/alarmdata',alarmdata)
router.get('/ecc/v1/test',test)
router.post('/ecc/v1/alarmfilterdata',alarmfilterdata)

router.put('/ecc/v1/closealarm',closealarm)
router.post('/ecc/v1/addtask',addtask)
router.post('/ecc/v1/taskfilterdata',taskfilterdata)
router.put('/ecc/v1/closetask',closetask)

router.get('/ecc/v1/countryforcombo',countryforcombo)
router.get('/ecc/v1/cityforcombo',cityforcombo)
router.get('/ecc/v1/campusforcombo',campusforcombo)
router.get('/ecc/v1/buildingforcombo',buildingforcombo)
router.get('/ecc/v1/citycampus',citycampus)
router.get('/ecc/v1/avgdatapointvalue',avgdatapointvalue)
router.get('/ecc/v1/buildingname',buildingname)
router.get('/ecc/v1/equipmentname',equipmentname)
router.get('/ecc/v1/email',email)
router.post('/ecc/v1/addalarmdata',addalarmdata)
router.get('/ecc/v1/getcalculation',getcalculation)
router.post('/ecc/v1/dashboardlogin',dashboardlogin)
router.get('/ecc/v1/dashboardlogout',dashboardlogout)


router.get('/ecc/v1/avgdpval',avgdpval)






module.exports = router;
