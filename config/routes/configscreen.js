const express = require('express');
const sql = require('mssql/msnodesqlv8');

const router = express.Router();
const {test}  = require('../controller/ctrl-config');
const {projview,updatetask,deleteproject,postprojectview,login,logout,deleteuser,updateuser,getbuilding,getcampus}  = require('../controller/ctrl-config');
const {getcity,getcountry,getdevices,getusers,adduser,subequipmentdatapoint,subequipmentlist,postdatapoint,addsubequipment}  = require('../controller/ctrl-config');
const {addequipment,equipmentlist,updateproject,getdatapointsforconfig,updatedatapoint,deletedatapoint,updateuserpassword}  = require('../controller/ctrl-config');



router.get('/ecc/v1/test',test)
router.get('/ecc/v1/projview',projview)
router.get('/ecc/v1/updatetask',updatetask)
router.get('/ecc/v1/deleteproject',deleteproject)
router.post('/ecc/v1/postprojectview',postprojectview)
router.post('/ecc/v1/login',login)
router.get('/ecc/v1/logout',logout)
router.get('/ecc/v1/deleteuser',deleteuser)
router.put('/ecc/v1/updateuser',updateuser)
router.get('/ecc/v1/getbuilding',getbuilding)
router.get('/ecc/v1/getcampus',getcampus)
router.get('/ecc/v1/getcity',getcity)
router.get('/ecc/v1/getcountry',getcountry)
router.get('/ecc/v1/getdevices',getdevices)
router.get('/ecc/v1/getusers',getusers)
router.post('/ecc/v1/adduser',adduser)
router.get('/ecc/v1/subequipmentdatapoint',subequipmentdatapoint)
router.get('/ecc/v1/subequipmentlist',subequipmentlist)
router.post('/ecc/v1/postdatapoint',postdatapoint)
router.post('/ecc/v1/addsubequipment',addsubequipment)
router.post('/ecc/v1/addequipment',addequipment)
router.get('/ecc/v1/equipmentlist',equipmentlist)
router.put('/ecc/v1/updateproject',updateproject)
router.get('/ecc/v1/getdatapointsforconfig',getdatapointsforconfig)
router.put('/ecc/v1/updatedatapoint',updatedatapoint)
router.delete('/ecc/v1/deletedatapoint',deletedatapoint)
router.put('/ecc/v1/updateuserpassword',updateuserpassword)









module.exports = router;
