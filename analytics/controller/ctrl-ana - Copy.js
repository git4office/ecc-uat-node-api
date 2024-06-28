const express = require('express');
const sql = require('mssql/msnodesqlv8');
var config = require('../model/model-db');

/*
var config = {

    server : "localhost\\ECC", // eg:: 'DESKTOP_mjsi\\MSSQLEXPRESS'
   databse: "ECCDB",
   driver:"msnodesqlv8",
   user :'corp\\anudasgu',      // please read above note
   password:"Hydrogen1234",   // please read above note
  options :{
    trustedConnection:true,
  }
}

*/

const tasklist = (req,res)=>{
    dbName = config.databse
    const pollname = req.body.pollname;
    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       // var query = "SELECT Task.alarmid, Task.taskname, Task.taskassigneddate as assigneddate, Task.taskpriority as priority, Task.taskrepeatdays as repeated, Alarm.deviceid, Task.taskid, Task.buildingname, Task.taskcloseddate,Task.closingdesc, Task.escalationstage  FROM ["+dbName+"].[ECCAnalytics].[Alarm] INNER JOIN ["+dbName+"].[ECCAnalytics].[Task] ON Alarm.alarmid = Task.alarmid;"
   /*    var query = "SELECT [T1].[taskid],[T1].[subequipmenttype],[T6].equipmenttype, [T1].[taskname],[T4].[cityname],[T3].[campusname],[T1].[taskassigneddate],[T1].[taskpriority],[T1].[taskcloseddate],[T1].[taskcloseddesc],[T1].[taskrepeatdays],[T1].[escalationstage], [T2].[buildingname] FROM ["+dbName+"].[ECCAnalytics].[Task] T1"
       query += " inner join ["+dbName+"].[ECCAnalytics].[Buildings] T2 " 
       query +=" on [T1].buildingname = [T2].buildingname "
       query +="inner join ["+dbName+"].[ECCAnalytics].[Campuses] T3 "
       query +="ON [T3].[campusname] = [T2].[campusname] "
       query +="inner join ["+dbName+"].[ECCAnalytics].[Cities] T4 "
       query +="on [T3].[cityname] = [T4].[cityname] "
       query +=" inner join ["+dbName+"].[ECCAnalytics].[Countries] T5"
       query +=" on [T4].[countryname] = [T5].[countryname] " 
       query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T6 "
       query += " on [T1].subequipmenttype = [T6].subequipmenttype where 1 = 1"
   
     */      

       var query = "SELECT [T1].[taskid],[T1].[subequipmenttype],[T6].equipmenttype, [T1].[taskname],[T4].[cityname],[T3].[campusname],[T1].[taskassigneddate],[T1].[taskpriority],[T1].[taskcloseddate],[T1].[taskcloseddesc],[T1].[taskrepeatdays],[T1].[escalationstage], [T2].[buildingname]  FROM ["+dbName+"].[ECCAnalytics].[Task] T1"
       query += " inner join ["+dbName+"].[ECCAnalytics].[Buildings] T2 " 
       query +=" on [T1].buildingname = [T2].buildingname "
       query +="inner join ["+dbName+"].[ECCAnalytics].[Campuses] T3 "
       query +="ON [T3].[campusname] = [T2].[campusname] "
       query +="inner join ["+dbName+"].[ECCAnalytics].[Cities] T4 "
       query +="on [T3].[cityname] = [T4].[cityname] "
       query +=" inner join ["+dbName+"].[ECCAnalytics].[Countries] T5"
       query +=" on [T4].[countryname] = [T5].[countryname] " 
       query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T6 "
       query += " on [T1].subequipmenttype = [T6].subequipmenttype where 1 = 1"
       query += " AND  [T1].[taskstatus] = 1"
   
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
               var data = [];
               for (var i = 0; i < records['recordsets'][0].length; i++) { 
                //data.push({id: records['recordsets'][0][i]['alarmid'],taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'],buildingname: records['recordsets'][0][i]['buildingname'],assigneddate: records['recordsets'][0][i]['taskassigneddate'],priority: records['recordsets'][0][i]['taskpriority'],taskcloseddate:records['recordsets'][0][i]['taskcloseddate'],closingdesc: records['recordsets'][0][i]['taskcloseddesc'],repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'],equipment:  records['recordsets'][0][i]['equipmenttype']});
                data.push({alarmid: records['recordsets'][0][i]['alarmid'],ruleid: records['recordsets'][0][i]['ruleid'], buildingname: records['recordsets'][0][i]['buildingname'],equipmentname: 'AHU',analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],costavoided:records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'],taskstatus: records['recordsets'][0][i]['taskstatus']});

            }
            return res.status(200).json(records['recordsets'][0])
            //return res.status(200).json(data)
        }
    
        }
    
    )
    })
}


const taskDetailsByAlarmId = (req,res)=>{
    dbName = config.databse

    var aid = req.query.aid;
    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       var query = "SELECT  [recordid] ,[taskid] ,[alarmid] ,[taskname],[taskpriority],[taskassigneddate],[taskcloseddate],[taskcloseddesc],[taskrepeatdays],[feedback],[buildingname],[subequipmenttype],[closingdesc],[escalationstage],[taskstatus]  FROM ["+dbName+"].[ECCAnalytics].[Task] T1 where [T1].alarmid = "+aid+""
           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
               var data = [];
               for (var i = 0; i < records['recordsets'][0].length; i++) { 
                data.push({id: records['recordsets'][0][i]['alarmid'],taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'],buildingname: records['recordsets'][0][i]['buildingname'],assigneddate: records['recordsets'][0][i]['assigneddate'],priority: records['recordsets'][0][i]['priority'],taskcloseddate:records['recordsets'][0][i]['taskcloseddate'],closingdesc: records['recordsets'][0][i]['closingdesc'],repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'],equipment: 'AHU'});

            }
            return res.status(200).json(records['recordsets'][0])
           // return res.status(200).json(data)
        }
    
        }
    
    )
    })

}



const alarmdata = (req,res)=>{
    dbName = config.databse

    const pollname = req.body.pollname;
    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
        //var query = "SELECT [alarmid],[datapointrecordid] ,[ruleid] ,[deviceid],[analysisname] ,[analyticsummary],[measuretype] ,[costavoided] ,[energysaved] ,[alarmstatus],[alarmontimestamp] ,[alarmofftimestamp] ,[escalationstage] ,[buildingname] ,[taskstatus] from ["+dbName+"].[ECCAnalytics].[Alarm] where alarmstatus = 1 OR alarmstatus = 0 AND taskstatus = 2"
/*        var query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T7].[equipmenttype],[T7].[subequipmenttype]  FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1  left JOIN ["+dbName+"].[ECCAnalytics].[Buildings] T2 on [T1].buildingname =  [T2].buildingname left JOIN ["+dbName+"].[ECCAnalytics].[Campuses] T3 on [T2].[campusname] = [T3].[campusname] left JOIN ["+dbName+"].[ECCAnalytics].[Cities] T4 on [T4].cityname = [T3].cityname LEFT JOIN ["+dbName+"].[ECCAnalytics].[Countries] T5 on [T5].countryname = [T4].countryname "
        query +=  " left join ["+dbName+"].[ECCAnalytics].[Devices] T6 "
        query += " on [T1].[deviceid] = [T6].[deviceid] "
        query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T7 "
        query += " on [T6].equipmentname = [T7].equipmenttype where 1 = 1 "
*/
var query = "SELECT [T10].[subequipmenttype],[T10].[equipmenttype],[T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T1].[ruleno] FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1  left JOIN ["+dbName+"].[ECCAnalytics].[Buildings] T2 "

query +=  "on [T1].buildingname =  [T2].buildingname "
query +=  " left JOIN ["+dbName+"].[ECCAnalytics].[Campuses] T3 "
query += " on [T2].[campusname] = [T3].[campusname] "
query +=  " left JOIN ["+dbName+"].[ECCAnalytics].[Cities] T4 "
query += " on [T4].cityname = [T3].cityname "
query += " LEFT JOIN ["+dbName+"].[ECCAnalytics].[Countries] T5 "
query += " on [T5].countryname = [T4].countryname  "
query +=  " inner join ["+dbName+"].[ECCAnalytics].[DataPointValue] T6"
query +=  " on [T1].datapointrecordid = [T6].datapointrecordid "
query += " inner join ["+dbName+"].[ECCAnalytics].[DataPoint] T7 "
query +=  " on [T6].datapoint = [T7].datapoint "
query += " inner join ["+dbName+"].[ECCAnalytics].[Devices] T8 "
query +=  " on [T7].deviceid = [T8].deviceid  "
query += " inner join ["+dbName+"].[ECCAnalytics].[Project] T9 "
query += " on [T8].equipmentname = [T9].equipmentname "
query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T10 " 
//query += " on [T9].subequipmentname = [T10].subequipmenttype where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmid] "
//query += " on [T9].subequipmentname = [T10].subequipmenttype where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmontimestamp] "
query += " on [T9].subequipmentname = [T10].subequipmenttype where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmontimestamp] "
               
    
        request.query(query,function(err,records){
            if(err)
            console.log(query);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
               var data = [];
               for (var i = 0; i < records['recordsets'][0].length; i++) { 
                data.push({alarmid: records['recordsets'][0][i]['alarmid'],datapointrecordid: records['recordsets'][0][i]['datapointrecordid'],ruleid: records['recordsets'][0][i]['ruleid'],ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'],equipmentname: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmenttype'],deviceid: records['recordsets'][0][i]['deviceid'],analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],measuretype:records['recordsets'][0][i]['measuretype'],assigndate: records['recordsets'][0][i]['alarmontimestamp'],costavoided:records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'],taskstatus: records['recordsets'][0][i]['taskstatus']});

            }
           // return res.status(200).json(records['recordsets'][0])
            return res.status(200).json(data)
        }
    
        }
    
    )
    })
}



const alarmfilterdata = (req,res)=>{
    dbName = config.databse


    //var query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Devices].[equipmentname]"
   // var query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T2].[equipmentname] "
    //query += " FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1 "
    //query += " left join ["+dbName+"].[ECCAnalytics].[Devices] T2"
    //query += " on [T1].[deviceid] = [T2].[deviceid] where 1 = 1"
/*
    var query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T7].[equipmenttype],[T7].[subequipmenttype]  FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1  left JOIN ["+dbName+"].[ECCAnalytics].[Buildings] T2 on [T1].buildingname =  [T2].buildingname left JOIN ["+dbName+"].[ECCAnalytics].[Campuses] T3 on [T2].[campusname] = [T3].[campusname] left JOIN ["+dbName+"].[ECCAnalytics].[Cities] T4 on [T4].cityname = [T3].cityname LEFT JOIN ["+dbName+"].[ECCAnalytics].[Countries] T5 on [T5].countryname = [T4].countryname "
    query +=  " left join ["+dbName+"].[ECCAnalytics].[Devices] T6 "
    query += " on [T1].[deviceid] = [T6].[deviceid] "
    query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T7 "
    query += " on [T6].equipmentname = [T7].equipmenttype where 1 = 1 "
*/
    

var query = "SELECT [T10].[subequipmenttype],[T10].[equipmenttype],[T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T1].[ruleno] FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1  left JOIN ["+dbName+"].[ECCAnalytics].[Buildings] T2 "

    query +=  "on [T1].buildingname =  [T2].buildingname "
    query +=  " left JOIN ["+dbName+"].[ECCAnalytics].[Campuses] T3 "
    query += " on [T2].[campusname] = [T3].[campusname] "
    query +=  " left JOIN ["+dbName+"].[ECCAnalytics].[Cities] T4 "
    query += " on [T4].cityname = [T3].cityname "
    query += " LEFT JOIN ["+dbName+"].[ECCAnalytics].[Countries] T5 "
    query += " on [T5].countryname = [T4].countryname  "
    query +=  " inner join ["+dbName+"].[ECCAnalytics].[DataPointValue] T6"
    query +=  " on [T1].datapointrecordid = [T6].datapointrecordid "
    query += " inner join ["+dbName+"].[ECCAnalytics].[DataPoint] T7 "
    query +=  " on [T6].datapoint = [T7].datapoint "
    query += " inner join ["+dbName+"].[ECCAnalytics].[Devices] T8 "
    query +=  " on [T7].deviceid = [T8].deviceid  "
    query += " inner join ["+dbName+"].[ECCAnalytics].[Project] T9 "
    query += " on [T8].equipmentname = [T9].equipmentname "
    query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T10 " 
   // query += " on [T9].subequipmentname = [T10].subequipmenttype where 1 = 1 "
  // query += " on [T9].subequipmentname = [T10].subequipmenttype where  1 =1 AND T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   "
   query += " on [T9].subequipmentname = [T10].subequipmenttype where 1 =1 "
  // query += " on [T9].subequipmentname = [T10].subequipmenttype where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmid] "

    var sqlStat = 0
    andquery = ""
    //const campus = req.body.campus;

    if (typeof req.body.country !== 'undefined') {
        sqlStat = 1
       // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus] "
      /* var query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus] "
       query += " FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1 "
        query += " left JOIN ["+dbName+"].[ECCAnalytics].[Buildings] T2" 
        query += " on [T1].buildingname =  [T2].buildingname"
        query += " left JOIN ["+dbName+"].[ECCAnalytics].[Campuses] T3" 
        query +=" on [T2].[campusname] = [T3].[campusname]" 
        query +=" left JOIN ["+dbName+"].[ECCAnalytics].[Cities] T4"
        query +=" on [T4].cityname = [T3].cityname"
        query +=" LEFT JOIN ["+dbName+"].[ECCAnalytics].[Countries] T5"
        query +=" on [T5].countryname = [T4].countryname"
        */
      //  query +=" AND [T5].countryname = '" +req.body.country+"' AND  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR [T5].countryname = '" +req.body.country+"' AND T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR [T5].countryname = '" +req.body.country+"' AND T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0  " 
       // return res.status(200).json(sql)
       andquery +=" AND [T5].countryname = '" +req.body.country+"' "


    }
    

    if (typeof req.body.city !== 'undefined') {
        sqlStat =1
       // query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus]  ,[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[Countries].countryname"
        /*query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus]  ,[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus] "
        query += " FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1"
        query += " left JOIN ["+dbName+"].[ECCAnalytics].[Buildings] T2" 
        query += " on [T1].buildingname =  [T2].buildingname"
        query += " left JOIN ["+dbName+"].[ECCAnalytics].[Campuses] T3" 
        query +=" on [T2].[campusname] = [T3].[campusname]" 
        query +=" left JOIN ["+dbName+"].[ECCAnalytics].[Cities] T4"
        query +=" on [T4].cityname = [T3].cityname" */
      //  query +=" AND [T4].cityname = '" +req.body.city+"'" 
       // return res.status(200).json(sql)
       andquery +=" AND [T4].cityname = '" +req.body.city+"' " 


    }

    if (typeof req.body.campus !== 'undefined') {
        sqlStat = 1
       // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Countries].countryname"
      /* query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus]  ,[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus] "
       query += " FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1"
        query += " left JOIN ["+dbName+"].[ECCAnalytics].[Buildings] T2" 
        query += " on [T1].buildingname =  [T2].buildingname"
        query += " left JOIN ["+dbName+"].[ECCAnalytics].[Campuses] T3" 
        query +=" on [T2].[campusname] = [T3].[campusname]" */
      //  query +=" AND [T3].campusname = '" +req.body.campus+"'" 
        //return res.status(200).json(sql)
        andquery +=" AND [T3].campusname = '" +req.body.campus+"' " 


    }


    if (typeof req.body.building !== 'undefined') {
        sqlStat = 1
        //query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Countries].countryname"
      /*  query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus]  ,[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus] "
        query += " FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1"
        query += " left JOIN ["+dbName+"].[ECCAnalytics].[Buildings] T2" 
        query += " on [T1].buildingname =  [T2].buildingname" */
      //  query +=" AND [T2].buildingname = '" +req.body.building+"'" 
       // return res.status(200).json(sql)
       andquery +=" AND [T2].buildingname = '" +req.body.building+"' " 


    }

    if (typeof req.body.equipment !== 'undefined') {
        sqlStat = 1
       // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Devices].[equipmentname]"
      /*  query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus]  ,[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus] "
        query += " FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1"
        query += " left join ["+dbName+"].[ECCAnalytics].[Devices] T2"
        query += " on [T1].[deviceid] = [T2].[deviceid]" */
       // query +=" AND [T10].[equipmenttype] = '" +req.body.equipment+"'" 
        andquery +=" AND [T10].[equipmenttype] = '" +req.body.equipment+"' " 
        //return res.status(200).json(sql)


    }

    if (typeof req.body.dt !== 'undefined') {
        sqlStat = 1
       // query += " AND FORMAT(alarmontimestamp,'dd-MM-yyyy') = '"+req.body.dt+"'"        
       // return res.status(200).json(sql)
       //query +=" AND FORMAT(alarmontimestamp,'dd-MM-yyyy')  between   '"+req.body.dt+"' and  '"+req.body.todt+"'"
       andquery +=" AND FORMAT(alarmontimestamp,'dd-MM-yyyy')  between   '"+req.body.dt+"' and  '"+req.body.todt+"' "

    }

/*    
    if(sqlStat == 0){
        query += " AND T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   "
    }
*/
    query +=" AND T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 "+andquery+" OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 "+andquery+" OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   "+andquery+""

    query += " ORDER by T1.[alarmid] "

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        var request = new sql.Request();
    
       // var query = "SELECT [alarmid],[datapointrecordid] ,[ruleid] ,[deviceid],[analysisname] ,[analyticsummary],[measuretype] ,[costavoided] ,[energysaved] ,[alarmstatus],[alarmontimestamp] ,[alarmofftimestamp] ,[escalationstage] ,[buildingname] ,[taskstatus] from ["+dbName+"].[ECCAnalytics].[Alarm] where alarmstatus = 1 OR alarmstatus = 0 AND taskstatus = 2"
           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
               var data = [];
               for (var i = 0; i < records['recordsets'][0].length; i++) { 
                data.push({alarmid: records['recordsets'][0][i]['alarmid'],datapointrecordid: records['recordsets'][0][i]['datapointrecordid'],ruleid: records['recordsets'][0][i]['ruleid'],ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'],equipmentname: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmenttype'],deviceid: records['recordsets'][0][i]['deviceid'],analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],measuretype:records['recordsets'][0][i]['measuretype'],assigndate: records['recordsets'][0][i]['alarmontimestamp'],costavoided:records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'],taskstatus: records['recordsets'][0][i]['taskstatus']});

            }
           // return res.status(200).json(records['recordsets'][0])
          // console.log(query)
            return res.status(200).json(data)
        }
    
        }
    
    )
    })



}


const closealarm = (req,res)=>{
    dbName = config.databse

    alarmid = req.body.alarmid
    ruleno = req.body.ruleno
    ruleid = req.body.ruleid

    query = "update  Alarm set [Alarm].[alarmstatus] = 0, [Alarm].[alarmofftimestamp] = CURRENT_TIMESTAMP from ["+dbName+"].[ECCAnalytics].[Alarm] Alarm where [Alarm].[alarmid] = "+alarmid+"; "
    query2 = " update  Ruletimer set [Ruletimer].[timer] = 0 from ["+dbName+"].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '"+ruleno+"' and [Ruletimer].[ruleid] = "+ruleid+";"

    query = query + query2


    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        var request = new sql.Request();
    
        request.query(query,function(err,records){
            if(err)
            console.log(query);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
              // var data = [];
           // return res.status(200).json(records['recordsets'][0])
          // console.log(records['recordsets'][0])
            return res.status(200).json({'status': 'success'})
        }
    
        }
    
    )
    })


}



const addtask = (req,res)=>{
    dbName = config.databse

    alarmid = req.body.alarmid
    taskname = req.body.taskname
    //nameOfBuilding = req.body.buildingname
    //nameOfEquipment = req.body.equipmentname

 
    maxsql = "SELECT MAX(recordid) as maxid FROM ["+dbName+"].[ECCAnalytics].[Task]"




    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        var request = new sql.Request();
    
        request.query(maxsql,function(err,records){
            if(err)
            console.log(err);
            else{
                    if (records['recordsets'][0][0]['maxid'] == 0){
                    taskid = "EA-TKT-1"
                    }
                    else{           
                    taskid = "EA-TKT-"+ (parseInt(records['recordsets'][0][0]['maxid'])+1).toString();
                    } 
                    query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].[Task] ([taskid],[alarmid],[taskname],[taskpriority],[taskassigneddate],[buildingname],[subequipmenttype],[taskstatus],[escalationstage]) VALUES ('"+taskid.toString()+"',"+req.body.alarmid.toString()+",'"+req.body.taskname.toString()+"','Low', CURRENT_TIMESTAMP,'"+req.body.buildingname.toString()+"','"+req.body.equipmentname.toString()+"','1','Stage1');"
                    updatequery = "update alarm set [alarm].[taskstatus] = 1 from ["+dbName+"].[ECCAnalytics].[alarm] alarm  where [alarm].[alarmid] = "+alarmid+";"
                    //sql = "INSERT INTO ECCAnalytics.Task (taskid,alarmid,taskname,taskpriority,taskassigneddate,buildingname,equipmentname,taskstatus,escalationstage) VALUES ('"+taskid.toString()+""
                    //return res.status(200).json(query2)
                    query2 = query2+updatequery
                     request.query(query2,function(err,records){
                        if(err)
                        console.log(err);
                        else{
            
                         return res.status(200).json({'status': 'success'})
    
                                
                    }
                    
                
                    }) 
            
                    
                    
        }
        
    
        })
    })


}


const taskfilterdata = (req,res)=>{
    dbName = config.databse

    //var query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Devices].[equipmentname]"
    var query = "SELECT [T1].[taskid],[T1].[subequipmenttype],[T6].equipmenttype, [T1].[taskname],[T4].[cityname],[T3].[campusname],[T1].[taskassigneddate],[T1].[taskpriority],[T1].[taskcloseddate],[T1].[taskcloseddesc],[T1].[taskrepeatdays],[T1].[escalationstage], [T2].[buildingname]  FROM ["+dbName+"].[ECCAnalytics].[Task] T1"
    query += " inner join ["+dbName+"].[ECCAnalytics].[Buildings] T2 " 
    query +=" on [T1].buildingname = [T2].buildingname "
    query +="inner join ["+dbName+"].[ECCAnalytics].[Campuses] T3 "
    query +="ON [T3].[campusname] = [T2].[campusname] "
    query +="inner join ["+dbName+"].[ECCAnalytics].[Cities] T4 "
    query +="on [T3].[cityname] = [T4].[cityname] "
    query +=" inner join ["+dbName+"].[ECCAnalytics].[Countries] T5"
    query +=" on [T4].[countryname] = [T5].[countryname] " 
    query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T6 "
    query += " on [T1].subequipmenttype = [T6].subequipmenttype where 1 = 1"
    //query += " FROM ["+dbName+"].[ECCAnalytics].[Alarm] T1 "
    //query += " left join ["+dbName+"].[ECCAnalytics].[Devices] T2"
    //query += " on [T1].[deviceid] = [T2].[deviceid] where 1 = 1"

    //const campus = req.body.campus;

    if (typeof req.body.country !== 'undefined') {
       // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus] "
        query +=" and  [T5].countryname = '" +req.body.country+"'" 
       // return res.status(200).json(sql)


    }
    

    if (typeof req.body.city !== 'undefined') {
       // query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus]  ,[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[Countries].countryname"
        query +=" and [T4].cityname = '" +req.body.city+"'" 
       // return res.status(200).json(sql)


    }

    if (typeof req.body.campus !== 'undefined') {
       // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Countries].countryname"
           query +=" and [T3].campusname = '" +req.body.campus+"'" 
        //return res.status(200).json(sql)


    }


    if (typeof req.body.building !== 'undefined') {
        //query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Countries].countryname"
        query +=" and [T2].buildingname = '" +req.body.building+"'" 
       // return res.status(200).json(sql)


    }

    if (typeof req.body.equipment !== 'undefined') {
       // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Devices].[equipmentname]"
        query +=" and [T6].[equipmenttype] = '" +req.body.equipment+"'" 
        //return res.status(200).json(sql)


    }

    if (typeof req.body.dt !== 'undefined') {
        //query += " AND FORMAT(taskassigneddate,'dd-MM-yyyy') = '"+req.body.dt+"'"        
       // return res.status(200).json(sql)
       query +=" AND FORMAT(taskassigneddate,'dd-MM-yyyy')  between   '"+req.body.dt+"' and  '"+req.body.todt+"'"



    }

    

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        var request = new sql.Request();
    
       // var query = "SELECT [alarmid],[datapointrecordid] ,[ruleid] ,[deviceid],[analysisname] ,[analyticsummary],[measuretype] ,[costavoided] ,[energysaved] ,[alarmstatus],[alarmontimestamp] ,[alarmofftimestamp] ,[escalationstage] ,[buildingname] ,[taskstatus] from ["+dbName+"].[ECCAnalytics].[Alarm] where alarmstatus = 1 OR alarmstatus = 0 AND taskstatus = 2"
           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
               var data = [];
               for (var i = 0; i < records['recordsets'][0].length; i++) { 
                data.push({alarmid: records['recordsets'][0][i]['alarmid'],ruleid: records['recordsets'][0][i]['ruleid'], buildingname: records['recordsets'][0][i]['buildingname'],equipmentname: 'AHU',analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],costavoided:records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'],taskstatus: records['recordsets'][0][i]['taskstatus']});

            }
            return res.status(200).json(records['recordsets'][0])
            //return res.status(200).json(data)
        }
    
        }
    
    )
    })



}


/***************** */

const countryforcombo = (req,res)=>{
    dbName = config.databse

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       var query = "SELECT [countryname]  FROM  ["+dbName+"].[ECCAnalytics].[Countries]"
           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
               var data = [];
               for (var i = 0; i < records['recordsets'][0].length; i++) { 
                data.push({id: records['recordsets'][0][i]['alarmid'],taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'],buildingname: records['recordsets'][0][i]['buildingname'],assigneddate: records['recordsets'][0][i]['assigneddate'],priority: records['recordsets'][0][i]['priority'],taskcloseddate:records['recordsets'][0][i]['taskcloseddate'],closingdesc: records['recordsets'][0][i]['closingdesc'],repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'],equipment: 'AHU'});

            }
            return res.status(200).json(records['recordsets'][0])
           // return res.status(200).json(data)
        }
    
        }
    
    )
    })
}


const cityforcombo = (req,res)=>{
    dbName = config.databse

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       var query = "SELECT [cityname]  FROM  ["+dbName+"].[ECCAnalytics].[Cities]"
           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
               var data = [];
               for (var i = 0; i < records['recordsets'][0].length; i++) { 
                data.push({id: records['recordsets'][0][i]['alarmid'],taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'],buildingname: records['recordsets'][0][i]['buildingname'],assigneddate: records['recordsets'][0][i]['assigneddate'],priority: records['recordsets'][0][i]['priority'],taskcloseddate:records['recordsets'][0][i]['taskcloseddate'],closingdesc: records['recordsets'][0][i]['closingdesc'],repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'],equipment: 'AHU'});

            }
            return res.status(200).json(records['recordsets'][0])
           // return res.status(200).json(data)
        }
    
        }
    
    )
    })
}



const campusforcombo = (req,res)=>{
    dbName = config.databse

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       var query = "SELECT [campusname] as campus  FROM  ["+dbName+"].[ECCAnalytics].[Campuses]"
           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
               var data = [];
               for (var i = 0; i < records['recordsets'][0].length; i++) { 
                data.push({id: records['recordsets'][0][i]['alarmid'],taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'],buildingname: records['recordsets'][0][i]['buildingname'],assigneddate: records['recordsets'][0][i]['assigneddate'],priority: records['recordsets'][0][i]['priority'],taskcloseddate:records['recordsets'][0][i]['taskcloseddate'],closingdesc: records['recordsets'][0][i]['closingdesc'],repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'],equipment: 'AHU'});

            }
            return res.status(200).json(records['recordsets'][0])
           // return res.status(200).json(data)
        }
    
        }
    
    )
    })
}


const buildingforcombo = (req,res)=>{
    dbName = config.databse

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       var query = "SELECT [buildingname] as building FROM  ["+dbName+"].[ECCAnalytics].[Buildings]"
           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
               var data = [];
               for (var i = 0; i < records['recordsets'][0].length; i++) { 
                data.push({id: records['recordsets'][0][i]['alarmid'],taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'],buildingname: records['recordsets'][0][i]['buildingname'],assigneddate: records['recordsets'][0][i]['assigneddate'],priority: records['recordsets'][0][i]['priority'],taskcloseddate:records['recordsets'][0][i]['taskcloseddate'],closingdesc: records['recordsets'][0][i]['closingdesc'],repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'],equipment: 'AHU'});

            }
            return res.status(200).json(records['recordsets'][0])
           // return res.status(200).json(data)
        }
    
        }
    
    )
    })
}



const citycampus = (req,res)=>{
    dbName = config.databse

    var building = req.query.building;

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       var query = "SELECT Building.[buildingname],Campuses.[campusname],Cities.[cityname]  FROM  ["+dbName+"].[ECCAnalytics].[Buildings] Building inner join ["+dbName+"].[ECCAnalytics].[Campuses] Campuses  on Building.[campusname] = Campuses.[campusname] inner join ["+dbName+"].[ECCAnalytics].[Cities] Cities  on Cities.[cityname] = Campuses.[cityname] where Building.[buildingname] = '"+building+"'"
           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
               var data = [];
               for (var i = 0; i < records['recordsets'][0].length; i++) { 
                data.push({id: records['recordsets'][0][i]['alarmid'],taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'],buildingname: records['recordsets'][0][i]['buildingname'],assigneddate: records['recordsets'][0][i]['assigneddate'],priority: records['recordsets'][0][i]['priority'],taskcloseddate:records['recordsets'][0][i]['taskcloseddate'],closingdesc: records['recordsets'][0][i]['closingdesc'],repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'],equipment: 'AHU'});

            }
            return res.status(200).json(records['recordsets'][0])
           // return res.status(200).json(data)
        }
    
        }
    
    )
    })
}




const avgdatapointvalue = (req,res)=>{
    dbName = config.databse

    var deviceid = req.query.deviceid;
    var datapoint = req.query.datapoint;

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       var query = "SELECT TOP (60) AVG(convert(float,[DataPointValue].[datapointvalue])) as [average-datapointvalue]  FROM  ["+dbName+"].[ECCAnalytics].[DataPointValue] DataPointValue where [DataPointValue].deviceid = '"+deviceid+"' and [DataPointValue].datapoint = '"+datapoint+"'"
           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
            return res.status(200).json(records['recordsets'][0])
           // return res.status(200).json(data)
        }
    
        }
    
    )
    })
}



const closetask = (req,res)=>{
    dbName = config.databse

 
    alarmid = req.body.alarmid
    closingdesc = req.body.closingdesc
    costavoided = req.body.costavoided
    energysaved = req.body.energysaved
    ruleno = req.body.ruleno
    feedback = '4'

    query = " update Task set [Task].[taskstatus] = '0',  [Task].[taskcloseddate] = CURRENT_TIMESTAMP, [Task].[taskcloseddesc] = '"+closingdesc+"', [Task].[closingdesc] = '"+closingdesc+"', [Task].[feedback] = '"+feedback+"' from  ["+dbName+"].[ECCAnalytics].[Task] Task where [Task].[alarmid] = "+alarmid+";"
    query2 = " update Alarm set [Alarm].[costavoided] = "+costavoided+", [Alarm].[energysaved] = "+energysaved+", [Alarm].[alarmstatus] = 0, [Alarm].[alarmofftimestamp] = CURRENT_TIMESTAMP,  [Alarm].[taskstatus] = '2' from  ["+dbName+"].[ECCAnalytics].[Alarm] Alarm where [Alarm].[alarmid] = "+alarmid+";"
     query3 = " update Ruletimer set [Ruletimer].[timer] = 0 from  ["+dbName+"].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '"+ruleno+"';"
    query = query+query2+query3


    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        var request = new sql.Request();
    
        request.query(query,function(err,records){
            if(err)
            console.log(query);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
              // var data = [];
           // return res.status(200).json(records['recordsets'][0])
          // console.log(records['recordsets'][0])
            return res.status(200).json({'status': 'success'})
        }
    
        }
    
    )
    })


}



const buildingname = (req,res)=>{
    dbName = config.databse

    var datapointrecordid = req.query.datapointrecordid;
    var deviceid = req.query.deviceid;

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       //var query = "SELECT [buildingname] as building FROM ["+dbName+"].[ECCAnalytics].[Buildings]"
       var query =" SELECT  Project.buildingname "
  
       query +=  "FROM  ["+dbName+"].[ECCAnalytics].[DataPointValue] DataPointValue "
       query +=  "inner join  ["+dbName+"].[ECCAnalytics].[DataPoint] DataPoint on DataPoint.datapointid =  DataPointValue.datapointid "
       query +=  "inner join  ["+dbName+"].[ECCAnalytics].[Devices] Devices on Devices.deviceid = DataPoint.deviceid "
       query +=  "inner join  ["+dbName+"].[ECCAnalytics].[Project] Project on Project.equipmentname = Devices.equipmentname"
       query +=  " where  DataPointValue.[datapointrecordid] = " +datapointrecordid+ " AND DataPointValue.[deviceid] = "+deviceid+";"



           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
            return res.status(200).json(records['recordsets'][0])
           // return res.status(200).json(data)
        }
    
        }
    
    )
    })
}




const equipmentname = (req,res)=>{
    dbName = config.databse

    var datapointrecordid = req.query.datapointrecordid;
    var deviceid = req.query.deviceid;

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       //var query = "SELECT [buildingname] as building FROM ["+dbName+"].[ECCAnalytics].[Buildings]"
       var query =" SELECT Devices.equipmentname "
  
       query +=  "FROM  ["+dbName+"].[ECCAnalytics].[DataPointValue] DataPointValue "
       query +=  "inner join  ["+dbName+"].[ECCAnalytics].[DataPoint] DataPoint on DataPoint.datapointid =  DataPointValue.datapointid "
       query +=  "inner join  ["+dbName+"].[ECCAnalytics].[Devices] Devices on Devices.deviceid = DataPoint.deviceid "
       query +=  " where  DataPointValue.[datapointrecordid] = " +datapointrecordid+ " AND DataPointValue.[deviceid] = "+deviceid+";"



           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
            return res.status(200).json(records['recordsets'][0])
           // return res.status(200).json(data)
        }
    
        }
    
    )
    })
}




const email = (req,res)=>{
    //ruleid = req.body.ruleid
    dbName = config.databse


    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       //var query = "SELECT [buildingname] as building FROM ["+dbName+"].[ECCAnalytics].[Buildings]"
       query = "SELECT [ruleid],[ruleno],[possiblecauses],[recommendations],[duration],[inputname],[alarmemailid],[escalationemailid] FROM  ["+dbName+"].[ECCAnalytics].[Rules] where [Rules].[ruleid] = '"+req.query.ruleid+"';"



           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
            return res.status(200).json(records['recordsets'][0])
            var data = [];
            for (var i = 0; i < records['recordsets'][0].length; i++) { 
             data.push({ruleid: records['recordsets'][0][i]['ruleid'],ruleno: records['recordsets'][0][i]['ruleno'],possiblecauses: records['recordsets'][0][i]['possiblecauses'],recommendations: records['recordsets'][0][i]['recommendations'], duration: records['recordsets'][0][i]['duration'],inputname: records['recordsets'][0][i]['inputname'],alarmemailid: records['recordsets'][0][i]['alarmemailid'],escalationemailid: records['recordsets'][0][i]['escalationemailid']});
             }

            return res.status(200).json(data)
        }
    
        }
    
    )
    })
}



const addalarmdata = (req,res)=>{
    dbName = config.databse

    ruleid =  req.body.ruleid
    ruleno = req.body.ruleno
    deviceid = req.body.deviceid
    analysisname = req.body.analysisname
    analyticsummary = req.body.analyticsummary
    measuretype = req.body.measuretype
    alarmstatus = req.body.alarmstatus
    building = req.body.buildingname
    escalationstage = req.body.escalationstage
    datapointrecordid = req.body.datapointrecordid //changes done  on 4/1/2023
    //nameOfBuilding = req.body.buildingname
    //nameOfEquipment = req.body.equipmentname

 
    //sql = "INSERT INTO ECCAnalytics.Alarm (datapointrecordid,ruleid,deviceid,analysisname,analyticsummary,measuretype,alarmstatus,buildingname,alarmontimestamp,escalationstage,ruleno) VALUES ("+datapointrecordid+",'"+ruleid+"','"+deviceid+"','"+analysisname+"','"+analyticsummary+"','"+measuretype+"',"+alarmstatus+",'"+buildingname+"',CURRENT_TIMESTAMP,'"+escalationstage+"','"+ruleno+"');"
    query = "INSERT INTO  ["+dbName+"].[ECCAnalytics].[Alarm] ([datapointrecordid],[ruleid],[deviceid],[analysisname],[analyticsummary],[measuretype],[alarmstatus],[buildingname],[alarmontimestamp],[escalationstage],[ruleno]) VALUES ("+datapointrecordid+",'"+ruleid+"','"+deviceid+"','"+analysisname+"','"+analyticsummary+"','"+measuretype+"',"+alarmstatus+",'"+building+"',CURRENT_TIMESTAMP,'"+escalationstage+"','"+ruleno+"');"


    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        var request = new sql.Request();
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
                return res.status(200).json({'status': 'success'})
                    
                 }
        
    
        })
    })


}



const getcalculation = (req,res)=>{
    dbName = config.databse

    var ruleid = req.query.ruleid;

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       //var query = "SELECT [buildingname] as building FROM ["+dbName+"].[ECCAnalytics].[Buildings]"
       var query =" SELECT [multiplicationfactor] FROM ["+dbName+"].[ECCAnalytics].[Rules] where ruleid ='"+ruleid+"'"
  
     


           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
            return res.status(200).json(records['recordsets'][0])
           // return res.status(200).json(data)
        }
    
        }
    
    )
    })
}




/*********************************************TEST API ********************************************************* */
const test = (req,res)=>{
    var qid = req.query.id;
    //alarmid = req.body.alarmid

    //return res.status(200).json(qid)


    const pool = new sql.ConnectionPool(config);

// Connect to the SQL Server
pool.connect().then(() => {
  // Query example
  pool.request().query('SELECT TOP (1000) [recordid],[campusname],[buildingname] FROM ["+dbName+"].[ECCAnalytics].[Buildings]').then(result => {
    console.log(result.recordset);
    return res.status(200).json(result.recordset)
  }).catch(err => {
    console.error('Error executing query:', err);
  }).finally(() => {
    // Close the connection pool
    pool.close();
  });
}).catch(err => {
  console.error('Error connecting to SQL Server:', err);
});


}

/*************************************************** END OF TEST API************************************************* */



module.exports = {
    tasklist,
    taskDetailsByAlarmId,
    alarmdata,
    alarmfilterdata,
    closealarm,
    addtask,
    taskfilterdata,
    countryforcombo,
    cityforcombo,
    campusforcombo,
    buildingforcombo,
    citycampus,
    avgdatapointvalue,
    closetask,
    buildingname,
    equipmentname,
    email,
    addalarmdata,
    getcalculation,
    test
    
}