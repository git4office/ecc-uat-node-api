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

const tasklist_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse
  const pollname = req.body.pollname;
  sql.connect(config, function (err) {
    if (err) conole.log(err)

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
    /*
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
      */


    var query = "SELECT [T1].*, [T4].[cityname],[T3].[campusname] FROM [" + dbName + "].[ECCAnalytics].[Task] T1"
    query += " inner join [" + dbName + "].[ECCAnalytics].[Buildings] T2 "
    query += " on [T1].buildingname = [T2].buildingname "
    query += "inner join [" + dbName + "].[ECCAnalytics].[Campuses] T3 "
    query += "ON [T3].[campusname] = [T2].[campusname] "
    query += "inner join [" + dbName + "].[ECCAnalytics].[Cities] T4 "
    query += "on [T3].[cityname] = [T4].[cityname] "
    query += " inner join [" + dbName + "].[ECCAnalytics].[Countries] T5"
    query += " on [T4].[countryname] = [T5].[countryname] "
    //  query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T6 "
    // query += " on [T1].subequipmenttype = [T6].subequipmenttype where 1 = 1"
    // query += " AND  [T1].[taskstatus] = 1"
    query += " where  [T1].[taskstatus] = 1"


    request.query(query, function (err, records) {
      if (err)
        console.log(query);
      else {
        console.log(query);

        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        return res.status(200).json(records['recordsets'][0])
        //return res.status(200).json(data)
      }

    }

    )
  })
}

const tasklist = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  const pollname = req.body.pollname;

  try {

    await pool.connect();

    const request = pool.request();

    var data = [];

    var query = "SELECT [T1].*, [T4].[cityname],[T3].[campusname] FROM [" + dbName + "].[ECCAnalytics].[Task] T1"
    query += " inner join [" + dbName + "].[ECCAnalytics].[Buildings] T2 "
    query += " on [T1].buildingname = [T2].buildingname "
    query += "inner join [" + dbName + "].[ECCAnalytics].[Campuses] T3 "
    query += "ON [T3].[campusname] = [T2].[campusname] "
    query += "inner join [" + dbName + "].[ECCAnalytics].[Cities] T4 "
    query += "on [T3].[cityname] = [T4].[cityname] "
    query += " inner join [" + dbName + "].[ECCAnalytics].[Countries] T5"
    query += " on [T4].[countryname] = [T5].[countryname] "
    //  query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T6 "
    // query += " on [T1].subequipmenttype = [T6].subequipmenttype where 1 = 1"
    // query += " AND  [T1].[taskstatus] = 1"
    query += " where  [T1].[taskstatus] = 1"

    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }

}

const taskDetailsByAlarmId_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  var aid = req.query.aid;
  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT  [recordid] ,[taskid] ,[alarmid] ,[taskname],[taskpriority],[taskassigneddate],[taskcloseddate],[taskcloseddesc],[taskrepeatdays],[feedback],[buildingname],[subequipmenttype],[closingdesc],[escalationstage],[taskstatus]  FROM ["+dbName+"].[ECCAnalytics].[Task] T1 where [T1].alarmid = "+aid+""
    var query = "SELECT  [recordid] ,[taskid] ,[alarmid] ,[taskname],[taskpriority],[taskassigneddate],[taskcloseddate],[taskcloseddesc],[taskrepeatdays],[feedback],[buildingname],[associatedequiptype],[closingdesc],[escalationstage],[taskstatus]  FROM [" + dbName + "].[ECCAnalytics].[Task] T1 where [T1].alarmid = " + aid + ""

    console.log(query);

    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          //data.push({id: records['recordsets'][0][i]['alarmid'],taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'],buildingname: records['recordsets'][0][i]['buildingname'],assigneddate: records['recordsets'][0][i]['assigneddate'],priority: records['recordsets'][0][i]['priority'],taskcloseddate:records['recordsets'][0][i]['taskcloseddate'],closingdesc: records['recordsets'][0][i]['closingdesc'],repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'],equipment: 'AHU'});
          data.push({ id: records['recordsets'][0][i]['alarmid'], taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'], buildingname: records['recordsets'][0][i]['buildingname'], associatedequiptype: records['recordsets'][0][i]['associatedequiptype'], assigneddate: records['recordsets'][0][i]['assigneddate'], priority: records['recordsets'][0][i]['priority'], taskcloseddate: records['recordsets'][0][i]['taskcloseddate'], closingdesc: records['recordsets'][0][i]['closingdesc'], repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'] });

        }
        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })

}


const taskDetailsByAlarmId = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  var aid = req.query.aid;

  try {

    await pool.connect();

    const request = pool.request();

    var data = [];

    var query = "SELECT  [recordid] ,[taskid] ,[alarmid] ,[taskname],[taskpriority],[taskassigneddate],[taskcloseddate],[taskcloseddesc],[taskrepeatdays],[feedback],[buildingname],[associatedequiptype],[closingdesc],[escalationstage],[taskstatus]  FROM [" + dbName + "].[ECCAnalytics].[Task] T1 where [T1].alarmid = " + aid + ""

    records = await request.query(query)
    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }

}

const alarmdata_3_6_24 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  const pollname = req.body.pollname;
  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    /* 
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
    */


    var query = "SELECT [T10].[associatedequipdesc],[T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T1].[ruleno] ,[T1].[equipmentname] FROM [" + dbName + "].[ECCAnalytics].[Alarm] T1  left JOIN [" + dbName + "].[ECCAnalytics].[Buildings] T2 "
    query += "on [T1].buildingname =  [T2].buildingname "
    query += " left JOIN [" + dbName + "].[ECCAnalytics].[Campuses] T3 "
    query += " on [T2].[campusname] = [T3].[campusname] "
    query += " left JOIN [" + dbName + "].[ECCAnalytics].[Cities] T4 "
    query += " on [T4].cityname = [T3].cityname "
    query += " LEFT JOIN [" + dbName + "].[ECCAnalytics].[Countries] T5 "
    query += " on [T5].countryname = [T4].countryname  "
    //query +=  " inner join ["+dbName+"].[ECCAnalytics].[DataPointValue] T6"
    query += " left join [" + dbName + "].[ECCAnalytics].[DataPointValue] T6"
    query += " on [T1].datapointrecordid = [T6].datapointrecordid "
    //query += " inner join ["+dbName+"].[ECCAnalytics].[DataPoint] T7 "
    //query +=  " on [T6].datapointrecordid = [T7].datapointid "
    //query += " inner join ["+dbName+"].[ECCAnalytics].[Devices] T8 "
    //query +=  " on [T7].deviceid = [T8].deviceid  "
    //query += " inner join ["+dbName+"].[ECCAnalytics].[Project] T9 "
    //query += " on [T8].equipmentname = [T9].equipmentname "
    query += " left join [" + dbName + "].[ECCAnalytics].[Project] T10 ON [T1].[equipmentname] = T10.[equipmentname]"
    query += " where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmontimestamp] "


    request.query(query, function (err, records) {
      if (err)
        console.log(query);
      else {
        console.log(query);
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          //data.push({alarmid: records['recordsets'][0][i]['alarmid'],datapointrecordid: records['recordsets'][0][i]['datapointrecordid'],ruleid: records['recordsets'][0][i]['ruleid'],ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'],equipmentname: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmenttype'],deviceid: records['recordsets'][0][i]['deviceid'],analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],measuretype:records['recordsets'][0][i]['measuretype'],assigndate: records['recordsets'][0][i]['alarmontimestamp'],costavoided:records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'],taskstatus: records['recordsets'][0][i]['taskstatus']});
          data.push({ alarmid: records['recordsets'][0][i]['alarmid'], datapointrecordid: records['recordsets'][0][i]['datapointrecordid'], ruleid: records['recordsets'][0][i]['ruleid'], ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'], equipmenttype: records['recordsets'][0][i]['associatedequipdesc'], equipmentname: records['recordsets'][0][i]['equipmentname'], deviceid: records['recordsets'][0][i]['deviceid'], analysisname: records['recordsets'][0][i]['analysisname'], analyticsummary: records['recordsets'][0][i]['analyticsummary'], measuretype: records['recordsets'][0][i]['measuretype'], assigndate: records['recordsets'][0][i]['alarmontimestamp'], costavoided: records['recordsets'][0][i]['costavoided'], energysaved: records['recordsets'][0][i]['energysaved'], taskstatus: records['recordsets'][0][i]['taskstatus'], escalationstage: records['recordsets'][0][i]['escalationstage'] });

        }
        // return res.status(200).json(records['recordsets'][0])
        return res.status(200).json(data)
      }

    }

    )
  })
}


const alarmdata = async (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse


  try {
    await sql.connect(config)
    // make a request as

    var request = new sql.Request();

    //make the query


    var query = "SELECT [T10].[associatedequipdesc],[T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T1].[ruleno] ,[T1].[equipmentname] FROM [" + dbName + "].[ECCAnalytics].[Alarm] T1  left JOIN [" + dbName + "].[ECCAnalytics].[Buildings] T2 "
    query += "on [T1].buildingname =  [T2].buildingname "
    query += " left JOIN [" + dbName + "].[ECCAnalytics].[Campuses] T3 "
    query += " on [T2].[campusname] = [T3].[campusname] "
    query += " left JOIN [" + dbName + "].[ECCAnalytics].[Cities] T4 "
    query += " on [T4].cityname = [T3].cityname "
    query += " LEFT JOIN [" + dbName + "].[ECCAnalytics].[Countries] T5 "
    query += " on [T5].countryname = [T4].countryname  "
    //query +=  " inner join ["+dbName+"].[ECCAnalytics].[DataPointValue] T6"
    query += " left join [" + dbName + "].[ECCAnalytics].[DataPointValue] T6"
    query += " on [T1].datapointrecordid = [T6].datapointrecordid "
    query += " left join [" + dbName + "].[ECCAnalytics].[Project] T10 ON [T1].[equipmentname] = T10.[equipmentname]"
    query += " where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmontimestamp] "

    records = await request.query(query)
    //  your out put as records  
    var data = [];
    for (var i = 0; i < records['recordsets'][0].length; i++) {
      data.push({ alarmid: records['recordsets'][0][i]['alarmid'], datapointrecordid: records['recordsets'][0][i]['datapointrecordid'], ruleid: records['recordsets'][0][i]['ruleid'], ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'], equipmenttype: records['recordsets'][0][i]['associatedequipdesc'], equipmentname: records['recordsets'][0][i]['equipmentname'], deviceid: records['recordsets'][0][i]['deviceid'], analysisname: records['recordsets'][0][i]['analysisname'], analyticsummary: records['recordsets'][0][i]['analyticsummary'], measuretype: records['recordsets'][0][i]['measuretype'], assigndate: records['recordsets'][0][i]['alarmontimestamp'], costavoided: records['recordsets'][0][i]['costavoided'], energysaved: records['recordsets'][0][i]['energysaved'], taskstatus: records['recordsets'][0][i]['taskstatus'], escalationstage: records['recordsets'][0][i]['escalationstage'] });

    }
    return res.status(200).json(data)

  } catch (err) {
    console.error(err);
    console.log(query);
    return res.status(500).json({ error: 'Internal Server Error' });

  }
}


const alarmfilterdata_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse


  var query = "SELECT [T10].[associatedequipdesc],[T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T1].[ruleno],[T1].[equipmentname] FROM [" + dbName + "].[ECCAnalytics].[Alarm] T1  left JOIN [" + dbName + "].[ECCAnalytics].[Buildings] T2 "

  query += "on [T1].buildingname =  [T2].buildingname "
  query += " left JOIN [" + dbName + "].[ECCAnalytics].[Campuses] T3 "
  query += " on [T2].[campusname] = [T3].[campusname] "
  query += " left JOIN [" + dbName + "].[ECCAnalytics].[Cities] T4 "
  query += " on [T4].cityname = [T3].cityname "
  query += " LEFT JOIN [" + dbName + "].[ECCAnalytics].[Countries] T5 "
  query += " on [T5].countryname = [T4].countryname  "
  //query +=  " inner join ["+dbName+"].[ECCAnalytics].[DataPointValue] T6"
  query += " left join [" + dbName + "].[ECCAnalytics].[DataPointValue] T6"
  query += " on [T1].datapointrecordid = [T6].datapointrecordid "

  query += " left join [" + dbName + "].[ECCAnalytics].[Project] T10 ON [T1].[equipmentname] = T10.[equipmentname] where 1 =1 "
  //query += " on [T9].subequipmentname = [T10].subequipmenttype where 1 =1 "




  var sqlStat = 0
  andquery = ""
  //const campus = req.body.campus;

  if (typeof req.body.country !== 'undefined') {
    sqlStat = 1
    andquery += " AND [T5].countryname = '" + req.body.country + "' "


  }


  if (typeof req.body.city !== 'undefined') {
    sqlStat = 1
    andquery += " AND [T4].cityname = '" + req.body.city + "' "


  }

  if (typeof req.body.campus !== 'undefined') {
    sqlStat = 1
    andquery += " AND [T3].campusname = '" + req.body.campus + "' "


  }


  if (typeof req.body.building !== 'undefined') {
    sqlStat = 1
    andquery += " AND [T2].buildingname = '" + req.body.building + "' "


  }

  if (typeof req.body.equipment !== 'undefined') {
    sqlStat = 1

    andquery += " AND [T1].equipmentname in (select [Project].equipmentname from [" + dbName + "].[ECCAnalytics].[Project]"
    andquery += " where [equipmentid] = (SELECT  [equipmentid]  FROM [" + dbName + "].[ECCAnalytics].[Equipments] "
    andquery += " where equipmenttype = '" + req.body.equipment + "'))"
    //return res.status(200).json(sql)


  }

  if (typeof req.body.dt !== 'undefined') {
    sqlStat = 1
    // query += " AND FORMAT(alarmontimestamp,'dd-MM-yyyy') = '"+req.body.dt+"'"        
    // return res.status(200).json(sql)
    //query +=" AND FORMAT(alarmontimestamp,'dd-MM-yyyy')  between   '"+req.body.dt+"' and  '"+req.body.todt+"'"
    andquery += " AND FORMAT(alarmontimestamp,'dd-MM-yyyy')  between   '" + req.body.dt + "' and  '" + req.body.todt + "' "

  }

  //query +=" AND T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 "+andquery+" OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 "+andquery+" OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   "+andquery+""
  query += " AND T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 " + andquery + "  OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   " + andquery + ""

  query += " ORDER by T1.[alarmid] "

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    // var query = "SELECT [alarmid],[datapointrecordid] ,[ruleid] ,[deviceid],[analysisname] ,[analyticsummary],[measuretype] ,[costavoided] ,[energysaved] ,[alarmstatus],[alarmontimestamp] ,[alarmofftimestamp] ,[escalationstage] ,[buildingname] ,[taskstatus] from ["+dbName+"].[ECCAnalytics].[Alarm] where alarmstatus = 1 OR alarmstatus = 0 AND taskstatus = 2"


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        console.log(query);
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          //data.push({alarmid: records['recordsets'][0][i]['alarmid'],datapointrecordid: records['recordsets'][0][i]['datapointrecordid'],ruleid: records['recordsets'][0][i]['ruleid'],ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],equipmentname: records['recordsets'][0][i]['equipmentname'],subequipmentname: records['recordsets'][0][i]['subequipmenttype'],deviceid: records['recordsets'][0][i]['deviceid'],analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],measuretype:records['recordsets'][0][i]['measuretype'],assigndate: records['recordsets'][0][i]['alarmontimestamp'],costavoided:records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'],taskstatus: records['recordsets'][0][i]['taskstatus'],escalationstage: records['recordsets'][0][i]['escalationstage']});
          data.push({ alarmid: records['recordsets'][0][i]['alarmid'], datapointrecordid: records['recordsets'][0][i]['datapointrecordid'], ruleid: records['recordsets'][0][i]['ruleid'], ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'], equipmenttype: records['recordsets'][0][i]['associatedequipdesc'], equipmentname: records['recordsets'][0][i]['equipmentname'], subequipmentname: records['recordsets'][0][i]['subequipmenttype'], deviceid: records['recordsets'][0][i]['deviceid'], analysisname: records['recordsets'][0][i]['analysisname'], analyticsummary: records['recordsets'][0][i]['analyticsummary'], measuretype: records['recordsets'][0][i]['measuretype'], assigndate: records['recordsets'][0][i]['alarmontimestamp'], costavoided: records['recordsets'][0][i]['costavoided'], energysaved: records['recordsets'][0][i]['energysaved'], taskstatus: records['recordsets'][0][i]['taskstatus'], escalationstage: records['recordsets'][0][i]['escalationstage'] });

        }
        // return res.status(200).json(records['recordsets'][0])
        // console.log(query)
        return res.status(200).json(data)
      }

    }

    )
  })



}

const alarmfilterdata = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);



  try {

    await pool.connect();

    const request = pool.request();


    var query = "SELECT [T10].[associatedequipdesc],[T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T1].[ruleno],[T1].[equipmentname] FROM [" + dbName + "].[ECCAnalytics].[Alarm] T1  left JOIN [" + dbName + "].[ECCAnalytics].[Buildings] T2 "

    query += "on [T1].buildingname =  [T2].buildingname "
    query += " left JOIN [" + dbName + "].[ECCAnalytics].[Campuses] T3 "
    query += " on [T2].[campusname] = [T3].[campusname] "
    query += " left JOIN [" + dbName + "].[ECCAnalytics].[Cities] T4 "
    query += " on [T4].cityname = [T3].cityname "
    query += " LEFT JOIN [" + dbName + "].[ECCAnalytics].[Countries] T5 "
    query += " on [T5].countryname = [T4].countryname  "
    //query +=  " inner join ["+dbName+"].[ECCAnalytics].[DataPointValue] T6"
    query += " left join [" + dbName + "].[ECCAnalytics].[DataPointValue] T6"
    query += " on [T1].datapointrecordid = [T6].datapointrecordid "

    query += " left join [" + dbName + "].[ECCAnalytics].[Project] T10 ON [T1].[equipmentname] = T10.[equipmentname] where 1 =1 "
    //query += " on [T9].subequipmentname = [T10].subequipmenttype where 1 =1 "




    var sqlStat = 0
    andquery = ""
    //const campus = req.body.campus;

    if (typeof req.body.country !== 'undefined') {
      sqlStat = 1
      andquery += " AND [T5].countryname = '" + req.body.country + "' "


    }


    if (typeof req.body.city !== 'undefined') {
      sqlStat = 1
      andquery += " AND [T4].cityname = '" + req.body.city + "' "


    }

    if (typeof req.body.campus !== 'undefined') {
      sqlStat = 1
      andquery += " AND [T3].campusname = '" + req.body.campus + "' "


    }


    if (typeof req.body.building !== 'undefined') {
      sqlStat = 1
      andquery += " AND [T2].buildingname = '" + req.body.building + "' "


    }

    if (typeof req.body.equipment !== 'undefined') {
      sqlStat = 1

      andquery += " AND [T1].equipmentname in (select [Project].equipmentname from [" + dbName + "].[ECCAnalytics].[Project]"
      andquery += " where [equipmentid] = (SELECT  [equipmentid]  FROM [" + dbName + "].[ECCAnalytics].[Equipments] "
      andquery += " where equipmenttype = '" + req.body.equipment + "'))"
      //return res.status(200).json(sql)


    }

    if (typeof req.body.dt !== 'undefined') {
      sqlStat = 1
      // query += " AND FORMAT(alarmontimestamp,'dd-MM-yyyy') = '"+req.body.dt+"'"        
      // return res.status(200).json(sql)
      //query +=" AND FORMAT(alarmontimestamp,'dd-MM-yyyy')  between   '"+req.body.dt+"' and  '"+req.body.todt+"'"
      andquery += " AND FORMAT(alarmontimestamp,'dd-MM-yyyy')  between   '" + req.body.dt + "' and  '" + req.body.todt + "' "

    }

    //query +=" AND T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 "+andquery+" OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 "+andquery+" OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   "+andquery+""
    query += " AND T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 " + andquery + "  OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   " + andquery + ""

    query += " ORDER by T1.[alarmid] "

    records = await request.query(query)

    var data = [];
    for (var i = 0; i < records['recordsets'][0].length; i++) {
      //data.push({alarmid: records['recordsets'][0][i]['alarmid'],datapointrecordid: records['recordsets'][0][i]['datapointrecordid'],ruleid: records['recordsets'][0][i]['ruleid'],ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],equipmentname: records['recordsets'][0][i]['equipmentname'],subequipmentname: records['recordsets'][0][i]['subequipmenttype'],deviceid: records['recordsets'][0][i]['deviceid'],analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],measuretype:records['recordsets'][0][i]['measuretype'],assigndate: records['recordsets'][0][i]['alarmontimestamp'],costavoided:records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'],taskstatus: records['recordsets'][0][i]['taskstatus'],escalationstage: records['recordsets'][0][i]['escalationstage']});
      data.push({ alarmid: records['recordsets'][0][i]['alarmid'], datapointrecordid: records['recordsets'][0][i]['datapointrecordid'], ruleid: records['recordsets'][0][i]['ruleid'], ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'], equipmenttype: records['recordsets'][0][i]['associatedequipdesc'], equipmentname: records['recordsets'][0][i]['equipmentname'], subequipmentname: records['recordsets'][0][i]['subequipmenttype'], deviceid: records['recordsets'][0][i]['deviceid'], analysisname: records['recordsets'][0][i]['analysisname'], analyticsummary: records['recordsets'][0][i]['analyticsummary'], measuretype: records['recordsets'][0][i]['measuretype'], assigndate: records['recordsets'][0][i]['alarmontimestamp'], costavoided: records['recordsets'][0][i]['costavoided'], energysaved: records['recordsets'][0][i]['energysaved'], taskstatus: records['recordsets'][0][i]['taskstatus'], escalationstage: records['recordsets'][0][i]['escalationstage'] });

    }
    // return res.status(200).json(records['recordsets'][0])
    // console.log(query)
    return res.status(200).json(data)


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }


}

const closealarm_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  alarmid = req.body.alarmid
  // ruleno = req.body.ruleno
  equipment = req.body.equipment
  ruleid = req.body.ruleid

  query = "update  Alarm set [Alarm].[alarmstatus] = 0, [Alarm].[alarmofftimestamp] = CURRENT_TIMESTAMP from [" + dbName + "].[ECCAnalytics].[Alarm] Alarm where [Alarm].[alarmid] = " + alarmid + "; "
  //query2 = " update  Ruletimer set [Ruletimer].[timer] = 0 from ["+dbName+"].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '"+ruleno+"' and [Ruletimer].[ruleid] = "+ruleid+";"
  query2 = " update  Ruletimer set [Ruletimer].[timer] = 0 from [" + dbName + "].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '" + ruleid + "' and [Ruletimer].[equipment] = '" + equipment + "';"
  //updated on 30th April 2024 on request by Sumaya 
  query = query + query2


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    request.query(query, function (err, records) {
      if (err)
        console.log(query);
      else {
        console.log(query);
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        // var data = [];
        // return res.status(200).json(records['recordsets'][0])
        // console.log(records['recordsets'][0])
        return res.status(200).json({ 'status': 'success' })
      }

    }

    )
  })


}

const closealarm = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  alarmid = req.body.alarmid
  // ruleno = req.body.ruleno
  equipment = req.body.equipment
  ruleid = req.body.ruleid

  try {

    await pool.connect();

    const request = pool.request();

    var data = [];

    query = "update  Alarm set [Alarm].[alarmstatus] = 0, [Alarm].[alarmofftimestamp] = CURRENT_TIMESTAMP from [" + dbName + "].[ECCAnalytics].[Alarm] Alarm where [Alarm].[alarmid] = " + alarmid + "; "
    //query2 = " update  Ruletimer set [Ruletimer].[timer] = 0 from ["+dbName+"].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '"+ruleno+"' and [Ruletimer].[ruleid] = "+ruleid+";"
    query2 = " update  Ruletimer set [Ruletimer].[timer] = 0 from [" + dbName + "].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '" + ruleid + "' and [Ruletimer].[equipment] = '" + equipment + "';"
    //updated on 30th April 2024 on request by Sumaya 
    query = query + query2

    records = await request.query(query)
    return res.status(200).json({ 'status': 'success' })


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }





}


const addtask_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  alarmid = req.body.alarmid
  taskname = req.body.taskname
  //console.log(req.body);
  // return 0;
  //nameOfBuilding = req.body.buildingname
  //nameOfEquipment = req.body.equipmentname


  maxsql = "SELECT MAX(recordid) as maxid FROM [" + dbName + "].[ECCAnalytics].[Task]"




  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    request.query(maxsql, function (err, records) {
      if (err)
        console.log(err);
      else {
        //console.log(records['recordsets'][0][0]['maxid'])
        //return;
        if (records['recordsets'][0][0]['maxid'] == null) {
          taskid = "EA-TKT-1"
        }
        else {
          taskid = "EA-TKT-" + (parseInt(records['recordsets'][0][0]['maxid']) + 1).toString();
        }
        //query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].[Task] ([taskid],[alarmid],[taskname],[taskpriority],[taskassigneddate],[buildingname],[subequipmenttype],[taskstatus],[escalationstage]) VALUES ('"+taskid.toString()+"',"+req.body.alarmid.toString()+",'"+req.body.taskname.toString()+"','Low', CURRENT_TIMESTAMP,'"+req.body.buildingname.toString()+"','"+req.body.equipmentname.toString()+"','1','Stage1');"
        //query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].[Task] ([taskid],[alarmid],[taskname],[taskpriority],[taskassigneddate],[buildingname],[associatedequiptype],[taskstatus],[escalationstage]) VALUES ('"+taskid.toString()+"',"+req.body.alarmid.toString()+",'"+req.body.taskname.toString()+"','"+req.body.taskpriority.toString()+"', CURRENT_TIMESTAMP,'"+req.body.buildingname.toString()+"','"+req.body.associatedequiptype.toString()+"','1','"+req.body.escalationstage.toString()+"');"
        query2 = "INSERT INTO [" + dbName + "].[ECCAnalytics].[Task] ([taskid],[alarmid],[taskname],[taskpriority],[taskassigneddate],[buildingname],[associatedequiptype],[taskstatus],[escalationstage],[taskassignedemail]) VALUES ('" + taskid.toString() + "'," + req.body.alarmid + ",'" + req.body.taskname + "','" + req.body.taskprioirty + "', CURRENT_TIMESTAMP,'" + req.body.buildingname + "','" + req.body.equipmentname + "','1','" + req.body.escalationstage + "','" + req.body.taskassignedemail + "');"
        //console.log(query2)
        //return 0;
        updatequery = "update alarm set [alarm].[taskstatus] = 1 from [" + dbName + "].[ECCAnalytics].[alarm] alarm  where [alarm].[alarmid] = " + alarmid + ";"
        //console.log(query2)
        //return 0;
        //sql = "INSERT INTO ECCAnalytics.Task (taskid,alarmid,taskname,taskpriority,taskassigneddate,buildingname,equipmentname,taskstatus,escalationstage) VALUES ('"+taskid.toString()+""
        //return res.status(200).json(query2)
        query2 = query2 + updatequery
        console.log(query2)
        //return 0
        request.query(query2, function (err, records) {
          if (err)
            console.log(query2);
          else {
            console.log(query2);


            return res.status(200).json({ 'status': 'success' })


          }


        })



      }


    })
  })


}


const addtask = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  alarmid = req.body.alarmid
  taskname = req.body.taskname
  //console.log(req.body);
  // return 0;
  //nameOfBuilding = req.body.buildingname
  //nameOfEquipment = req.body.equipmentname


  try {

    await pool.connect();

    const request = pool.request();

    var data = [];
    maxsql = "SELECT MAX(recordid) as maxid FROM [" + dbName + "].[ECCAnalytics].[Task]"

    records = await request.query(maxsql)

    if (records['recordsets'][0][0]['maxid'] == null) {
      taskid = "EA-TKT-1"
    }
    else {
      taskid = "EA-TKT-" + (parseInt(records['recordsets'][0][0]['maxid']) + 1).toString();
    }

    query2 = "INSERT INTO [" + dbName + "].[ECCAnalytics].[Task] ([taskid],[alarmid],[taskname],[taskpriority],[taskassigneddate],[buildingname],[associatedequiptype],[taskstatus],[escalationstage],[taskassignedemail]) VALUES ('" + taskid.toString() + "'," + req.body.alarmid + ",'" + req.body.taskname + "','" + req.body.taskprioirty + "', CURRENT_TIMESTAMP,'" + req.body.buildingname + "','" + req.body.equipmentname + "','1','" + req.body.escalationstage + "','" + req.body.taskassignedemail + "');"
    //console.log(query2)
    //return 0;
    updatequery = "update alarm set [alarm].[taskstatus] = 1 from [" + dbName + "].[ECCAnalytics].[alarm] alarm  where [alarm].[alarmid] = " + alarmid + ";"
    //console.log(query2)
    //return 0;
    //sql = "INSERT INTO ECCAnalytics.Task (taskid,alarmid,taskname,taskpriority,taskassigneddate,buildingname,equipmentname,taskstatus,escalationstage) VALUES ('"+taskid.toString()+""
    //return res.status(200).json(query2)
    query2 = query2 + updatequery
    await request.query(query2)

    return res.status(200).json({ 'status': 'success' })

  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }

}

const taskfilterdata_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  //var query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Devices].[equipmentname]"
  /*
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
*/


  var query = "SELECT [T1].*, [T4].[cityname],[T3].[campusname] FROM [" + dbName + "].[ECCAnalytics].[Task] T1"
  query += " inner join [" + dbName + "].[ECCAnalytics].[Buildings] T2 "
  query += " on [T1].buildingname = [T2].buildingname "
  query += "inner join [" + dbName + "].[ECCAnalytics].[Campuses] T3 "
  query += "ON [T3].[campusname] = [T2].[campusname] "
  query += "inner join [" + dbName + "].[ECCAnalytics].[Cities] T4 "
  query += "on [T3].[cityname] = [T4].[cityname] "
  query += " inner join [" + dbName + "].[ECCAnalytics].[Countries] T5"
  query += " on [T4].[countryname] = [T5].[countryname] "
  //  query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T6 "
  // query += " on [T1].subequipmenttype = [T6].subequipmenttype where 1 = 1"
  query += " AND  [T1].[taskstatus] = 1"


  //const campus = req.body.campus;

  if (typeof req.body.country !== 'undefined') {
    // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus] "
    query += " and  [T5].countryname = '" + req.body.country + "'"
    // return res.status(200).json(sql)


  }


  if (typeof req.body.city !== 'undefined') {
    // query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus]  ,[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[Countries].countryname"
    query += " and [T4].cityname = '" + req.body.city + "'"
    // return res.status(200).json(sql)


  }

  if (typeof req.body.campus !== 'undefined') {
    // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Countries].countryname"
    query += " and [T3].campusname = '" + req.body.campus + "'"
    //return res.status(200).json(sql)


  }


  if (typeof req.body.building !== 'undefined') {
    //query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Countries].countryname"
    query += " and [T2].buildingname = '" + req.body.building + "'"
    // return res.status(200).json(sql)


  }

  if (typeof req.body.equipment !== 'undefined') {
    // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Devices].[equipmentname]"
    query += " and [T6].[equipmenttype] = '" + req.body.equipment + "'"
    //return res.status(200).json(sql)


  }

  if (typeof req.body.dt !== 'undefined') {
    //query += " AND FORMAT(taskassigneddate,'dd-MM-yyyy') = '"+req.body.dt+"'"        
    // return res.status(200).json(sql)
    query += " AND FORMAT(taskassigneddate,'dd-MM-yyyy')  between   '" + req.body.dt + "' and  '" + req.body.todt + "'"



  }



  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    // var query = "SELECT [alarmid],[datapointrecordid] ,[ruleid] ,[deviceid],[analysisname] ,[analyticsummary],[measuretype] ,[costavoided] ,[energysaved] ,[alarmstatus],[alarmontimestamp] ,[alarmofftimestamp] ,[escalationstage] ,[buildingname] ,[taskstatus] from ["+dbName+"].[ECCAnalytics].[Alarm] where alarmstatus = 1 OR alarmstatus = 0 AND taskstatus = 2"


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        console.log(query);
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          data.push({ alarmid: records['recordsets'][0][i]['alarmid'], ruleid: records['recordsets'][0][i]['ruleid'], buildingname: records['recordsets'][0][i]['buildingname'], equipmentname: 'AHU', analysisname: records['recordsets'][0][i]['analysisname'], analyticsummary: records['recordsets'][0][i]['analyticsummary'], costavoided: records['recordsets'][0][i]['costavoided'], energysaved: records['recordsets'][0][i]['energysaved'], taskstatus: records['recordsets'][0][i]['taskstatus'] });

        }
        return res.status(200).json(records['recordsets'][0])
        //return res.status(200).json(data)
      }

    }

    )
  })



}


const taskfilterdata_11_07_2024 = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  try {

    await pool.connect();

    const request = pool.request();


    var query = "SELECT [T1].*, [T4].[cityname],[T3].[campusname] FROM [" + dbName + "].[ECCAnalytics].[Task] T1"
    query += " inner join [" + dbName + "].[ECCAnalytics].[Buildings] T2 "
    query += " on [T1].buildingname = [T2].buildingname "
    query += "inner join [" + dbName + "].[ECCAnalytics].[Campuses] T3 "
    query += "ON [T3].[campusname] = [T2].[campusname] "
    query += "inner join [" + dbName + "].[ECCAnalytics].[Cities] T4 "
    query += "on [T3].[cityname] = [T4].[cityname] "
    query += " inner join [" + dbName + "].[ECCAnalytics].[Countries] T5"
    query += " on [T4].[countryname] = [T5].[countryname] "
    //  query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T6 "
    // query += " on [T1].subequipmenttype = [T6].subequipmenttype where 1 = 1"
    query += " AND  [T1].[taskstatus] = 1"


    //const campus = req.body.campus;

    if (typeof req.body.country !== 'undefined') {
      // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus] "
      query += " and  [T5].countryname = '" + req.body.country + "'"
      // return res.status(200).json(sql)


    }


    if (typeof req.body.city !== 'undefined') {
      // query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus]  ,[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[Countries].countryname"
      query += " and [T4].cityname = '" + req.body.city + "'"
      // return res.status(200).json(sql)


    }

    if (typeof req.body.campus !== 'undefined') {
      // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Countries].countryname"
      query += " and [T3].campusname = '" + req.body.campus + "'"
      //return res.status(200).json(sql)


    }


    if (typeof req.body.building !== 'undefined') {
      //query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Countries].countryname"
      query += " and [T2].buildingname = '" + req.body.building + "'"
      // return res.status(200).json(sql)


    }

    if (typeof req.body.equipment !== 'undefined') {
      // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Devices].[equipmentname]"
      query += " and [T6].[equipmenttype] = '" + req.body.equipment + "'"
      //return res.status(200).json(sql)


    }

    if (typeof req.body.dt !== 'undefined') {
      //query += " AND FORMAT(taskassigneddate,'dd-MM-yyyy') = '"+req.body.dt+"'"        
      // return res.status(200).json(sql)
      query += " AND FORMAT(taskassigneddate,'dd-MM-yyyy')  between   '" + req.body.dt + "' and  '" + req.body.todt + "'"



    }


    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }


}

const taskfilterdata = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  try {

    await pool.connect();

    const request = pool.request();


    var query = "SELECT [T1].*, [T4].[cityname],[T3].[campusname] FROM [" + dbName + "].[ECCAnalytics].[Task] T1"
    query += " inner join [" + dbName + "].[ECCAnalytics].[Buildings] T2 "
    query += " on [T1].buildingname = [T2].buildingname "
    query += "inner join [" + dbName + "].[ECCAnalytics].[Campuses] T3 "
    query += "ON [T3].[campusname] = [T2].[campusname] "
    query += "inner join [" + dbName + "].[ECCAnalytics].[Cities] T4 "
    query += "on [T3].[cityname] = [T4].[cityname] "
    query += " inner join [" + dbName + "].[ECCAnalytics].[Countries] T5"
    query += " on [T4].[countryname] = [T5].[countryname] "

    query += " inner join [" + dbName + "].[ECCAnalytics].[Alarm] T6"
    query += " on [T6].[alarmid] = [T1].[alarmid] "

    //  query += " inner join ["+dbName+"].[ECCAnalytics].[SubEquipments] T6 "
    // query += " on [T1].subequipmenttype = [T6].subequipmenttype where 1 = 1"
    //query += " AND  [T1].[taskstatus] = 1"
    query += " where  [T1].[taskstatus] = 1"


    //const campus = req.body.campus;

    if (typeof req.body.country !== 'undefined') {
      // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus] "
      query += " and  [T5].countryname = '" + req.body.country + "'"
      // return res.status(200).json(sql)


    }


    if (typeof req.body.city !== 'undefined') {
      // query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus]  ,[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[Countries].countryname"
      query += " and [T4].cityname = '" + req.body.city + "'"
      // return res.status(200).json(sql)


    }

    if (typeof req.body.campus !== 'undefined') {
      // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Countries].countryname"
      query += " and [T3].campusname = '" + req.body.campus + "'"
      //return res.status(200).json(sql)


    }


    if (typeof req.body.building !== 'undefined') {
      //query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Countries].countryname"
      query += " and [T2].buildingname = '" + req.body.building + "'"
      // return res.status(200).json(sql)


    }

    if (typeof req.body.equipment !== 'undefined') {
      // query = "SELECT [Alarm].[alarmid],[Alarm].[datapointrecordid] ,[Alarm].[ruleid] ,[Alarm].[deviceid] ,[Alarm].[analysisname] ,[Alarm].[analyticsummary] ,[Alarm].[measuretype] ,[Alarm].[costavoided] ,[Alarm].[energysaved] ,[Alarm].[alarmstatus]  ,[Alarm].[alarmontimestamp],[Alarm].[alarmofftimestamp],[Alarm].[escalationstage],[Alarm].[buildingname],[Alarm].[taskstatus],[Devices].[equipmentname]"
      //query += " and [T6].[equipmenttype] = '" + req.body.equipment + "'"
      query += "AND [T6].equipmentname in (select [Project].equipmentname from [" + dbName + "].[ECCAnalytics].[Project] "
      query += " where [equipmentid] = (SELECT [equipmentid]  FROM [" + dbName + "].[ECCAnalytics].[Equipments]  where equipmenttype = '" + req.body.equipment + "')) "

    }

    if (typeof req.body.dt !== 'undefined') {
      //query += " AND FORMAT(taskassigneddate,'dd-MM-yyyy') = '"+req.body.dt+"'"        
      // return res.status(200).json(sql)
      query += " AND FORMAT(taskassigneddate,'dd-MM-yyyy')  between   '" + req.body.dt + "' and  '" + req.body.todt + "'"



    }


    records = await request.query(query)
    console.log(query)
    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.log(query)

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }


}

/***************** */

const countryforcombo_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    var query = "SELECT [countryname]  FROM  [" + dbName + "].[ECCAnalytics].[Countries]"


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          data.push({ id: records['recordsets'][0][i]['alarmid'], taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'], buildingname: records['recordsets'][0][i]['buildingname'], assigneddate: records['recordsets'][0][i]['assigneddate'], priority: records['recordsets'][0][i]['priority'], taskcloseddate: records['recordsets'][0][i]['taskcloseddate'], closingdesc: records['recordsets'][0][i]['closingdesc'], repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'], equipment: 'AHU' });

        }
        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })
}


const countryforcombo = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  try {

    await pool.connect();

    const request = pool.request();


    var query = "SELECT [countryname]  FROM  [" + dbName + "].[ECCAnalytics].[Countries]"

    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }


}

const cityforcombo_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    var query = "SELECT [cityname]  FROM  [" + dbName + "].[ECCAnalytics].[Cities]"


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          data.push({ id: records['recordsets'][0][i]['alarmid'], taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'], buildingname: records['recordsets'][0][i]['buildingname'], assigneddate: records['recordsets'][0][i]['assigneddate'], priority: records['recordsets'][0][i]['priority'], taskcloseddate: records['recordsets'][0][i]['taskcloseddate'], closingdesc: records['recordsets'][0][i]['closingdesc'], repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'], equipment: 'AHU' });

        }
        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })
}

const cityforcombo = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  try {

    await pool.connect();

    const request = pool.request();

    var query = "SELECT [cityname]  FROM  [" + dbName + "].[ECCAnalytics].[Cities]"

    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }

}


const campusforcombo_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    var query = "SELECT [campusname] as campus  FROM  [" + dbName + "].[ECCAnalytics].[Campuses]"


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          data.push({ id: records['recordsets'][0][i]['alarmid'], taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'], buildingname: records['recordsets'][0][i]['buildingname'], assigneddate: records['recordsets'][0][i]['assigneddate'], priority: records['recordsets'][0][i]['priority'], taskcloseddate: records['recordsets'][0][i]['taskcloseddate'], closingdesc: records['recordsets'][0][i]['closingdesc'], repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'], equipment: 'AHU' });

        }
        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })
}


const campusforcombo = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  try {

    await pool.connect();

    const request = pool.request();

    var data = [];

    var query = "SELECT [campusname] as campus  FROM  [" + dbName + "].[ECCAnalytics].[Campuses]"

    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }




}


const buildingforcombo_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    var query = "SELECT [buildingname] as building FROM  [" + dbName + "].[ECCAnalytics].[Buildings]"


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          data.push({ id: records['recordsets'][0][i]['alarmid'], taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'], buildingname: records['recordsets'][0][i]['buildingname'], assigneddate: records['recordsets'][0][i]['assigneddate'], priority: records['recordsets'][0][i]['priority'], taskcloseddate: records['recordsets'][0][i]['taskcloseddate'], closingdesc: records['recordsets'][0][i]['closingdesc'], repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'], equipment: 'AHU' });

        }
        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })
}


const buildingforcombo = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  try {

    await pool.connect();

    const request = pool.request();

    var data = [];

    var query = "SELECT [buildingname] as building FROM  [" + dbName + "].[ECCAnalytics].[Buildings]"

    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }

}

const citycampus_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  var building = req.query.building;

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    var query = "SELECT Building.[buildingname],Campuses.[campusname],Cities.[cityname]  FROM  [" + dbName + "].[ECCAnalytics].[Buildings] Building inner join [" + dbName + "].[ECCAnalytics].[Campuses] Campuses  on Building.[campusname] = Campuses.[campusname] inner join [" + dbName + "].[ECCAnalytics].[Cities] Cities  on Cities.[cityname] = Campuses.[cityname] where Building.[buildingname] = '" + building + "'"


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          data.push({ id: records['recordsets'][0][i]['alarmid'], taskid: records['recordsets'][0][i]['taskid'], taskname: records['recordsets'][0][i]['taskname'], buildingname: records['recordsets'][0][i]['buildingname'], assigneddate: records['recordsets'][0][i]['assigneddate'], priority: records['recordsets'][0][i]['priority'], taskcloseddate: records['recordsets'][0][i]['taskcloseddate'], closingdesc: records['recordsets'][0][i]['closingdesc'], repeated: records['recordsets'][0][i]['repeated'], escalationstage: records['recordsets'][0][i]['escalationstage'], equipment: 'AHU' });

        }
        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })
}

const citycampus = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  var building = req.query.building;

  try {

    await pool.connect();

    const request = pool.request();


    var query = "SELECT Building.[buildingname],Campuses.[campusname],Cities.[cityname]  FROM  [" + dbName + "].[ECCAnalytics].[Buildings] Building inner join [" + dbName + "].[ECCAnalytics].[Campuses] Campuses  on Building.[campusname] = Campuses.[campusname] inner join [" + dbName + "].[ECCAnalytics].[Cities] Cities  on Cities.[cityname] = Campuses.[cityname] where Building.[buildingname] = '" + building + "'"

    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }

}


const avgdatapointvalue_OLDv = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  var deviceid = req.query.deviceid;
  var datapoint = req.query.datapoint;

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    var query = "SELECT TOP (60) AVG(convert(float,[DataPointValue].[datapointvalue])) as [average-datapointvalue]  FROM  [" + dbName + "].[ECCAnalytics].[DataPointValue] DataPointValue where [DataPointValue].deviceid = '" + deviceid + "' and [DataPointValue].datapoint = '" + datapoint + "'"


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })
}



const avgdatapointvalue_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  var equipmentname = req.query.equipmentname;
  var dt = req.query.dt;
  //var datapoint = req.query.datapoint;

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT TOP (60) AVG(convert(float,[DataPointValue].[datapointvalue])) as [average-datapointvalue]  FROM  ["+dbName+"].[ECCAnalytics].[DataPointValue] DataPointValue where [DataPointValue].deviceid = '"+deviceid+"' and [DataPointValue].datapoint = '"+datapoint+"'"
    var query = "SELECT AVG(convert(float,[DataPointValue].[datapointvalue])) as avg"
    query += " FROM [" + dbName + "].[ECCAnalytics].[DataPointValue] where pointid in "
    query += " (SELECT [DataPoint].[pointid] FROM [" + dbName + "].[ECCAnalytics].[DataPoint] inner join [" + dbName + "].[ECCAnalytics].[Devices]"
    query += " on [Devices].deviceid = [DataPoint]. deviceid and [Devices].recordid = [DataPoint].devicerecordid"
    query += " where [Devices].equipmentname='" + equipmentname + " and [DataPoint].[isenergyvalue] = 1' ) and FORMAT(dated,'dd-MM-yyyy HH:mm:ss') >'" + dt + "'"

    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        console.log(query);

        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })
}

const avgdatapointvalue = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  var equipmentname = req.query.equipmentname;
  var dt = req.query.dt;
  //var datapoint = req.query.datapoint;

  try {

    await pool.connect();

    const request = pool.request();

    var data = [];

    var query = "SELECT AVG(convert(float,[DataPointValue].[datapointvalue])) as avg"
    query += " FROM [" + dbName + "].[ECCAnalytics].[DataPointValue] where pointid in "
    query += " (SELECT [DataPoint].[pointid] FROM [" + dbName + "].[ECCAnalytics].[DataPoint] inner join [" + dbName + "].[ECCAnalytics].[Devices]"
    query += " on [Devices].deviceid = [DataPoint]. deviceid and [Devices].recordid = [DataPoint].devicerecordid"
    query += " where [Devices].equipmentname='" + equipmentname + " and [DataPoint].[isenergyvalue] = 1' ) and FORMAT(dated,'dd-MM-yyyy HH:mm:ss') >'" + dt + "'"

    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }

}




const avgdpval_9_7_2024 = (req, res) => {


  // const currentDateTime = getCurrentDateTime()
  console.log(req.originalUrl);

  dbName = config.databse

  var equipmentname = req.query.equipmentname;
  var dt = req.query.dt;
  //var datapoint = req.query.datapoint;

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT TOP (60) AVG(convert(float,[DataPointValue].[datapointvalue])) as [average-datapointvalue]  FROM  ["+dbName+"].[ECCAnalytics].[DataPointValue] DataPointValue where [DataPointValue].deviceid = '"+deviceid+"' and [DataPointValue].datapoint = '"+datapoint+"'"
    /*
     var query =  "SELECT AVG(convert(float,[DataPointValue].[datapointvalue])) as avg"
      query += " FROM ["+dbName+"].[ECCAnalytics].[DataPointValue] where pointid in "
      query += " (SELECT [DataPoint].[pointid] FROM ["+dbName+"].[ECCAnalytics].[DataPoint] inner join ["+dbName+"].[ECCAnalytics].[Devices]"
      query += " on [Devices].deviceid = [DataPoint]. deviceid and [Devices].recordid = [DataPoint].devicerecordid"
      query += " where [Devices].equipmentname='"+equipmentname+"' and [DataPoint].[isenergyvalue] = 1' ) and FORMAT(dated,'dd-MM-yyyy HH:mm:ss') >'"+dt+"'"    
  */

    var query = "SELECT AVG(convert(float,DPV.[datapointvalue])) as avg FROM [" + dbName + "].[ECCAnalytics].[DataPointValue] DPV "
    query += " left Join [" + dbName + "].[ECCAnalytics].[DataPoint] DP on DPV.[pointid] = DP.[pointid]  and DPV.[datapointid] = DP.[datapointid]  "
    query += " inner JOIN  [" + dbName + "].[ECCAnalytics].[Devices] DV  "
    query += " on DV.deviceid = DP.deviceid and [DV].recordid = [DP].devicerecordid "
    query += " where [DV].equipmentname='" + equipmentname + "' and [DP].[isenergyvalue] = 2 and FORMAT(DPV.dated,'dd-MM-yyyy HH:mm:ss') >'" + dt + "'"

    request.query(query, function (err, records) {
      if (err)
        console.log(query);
      else {
        console.log(query);
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        console.log(records['recordsets'][0][0].avg);

        //**************************************************************** */



        if (records['recordsets'][0][0].avg == null) {

          var query2 = "SELECT [datapointvalue]  FROM [" + dbName + "].[ECCAnalytics].[DataPointValue] DPV "
          query2 += " left Join [" + dbName + "].[ECCAnalytics].[DataPoint] DP on DPV.[pointid] = DP.[pointid]  and DPV.[datapointid] = DP.[datapointid]  "
          query2 += " inner JOIN  [" + dbName + "].[ECCAnalytics].[Devices] DV  "
          query2 += " on DV.deviceid = DP.deviceid and [DV].recordid = [DP].devicerecordid "
          query2 += " where [DV].equipmentname='" + equipmentname + "' and [DP].[isenergyvalue] = 1 and FORMAT(DPV.dated,'dd-MM-yyyy HH:mm:ss') >'" + dt + "'"

          //var query3 = "SELECT Building.[buildingname] FROM  ["+dbName+"].[ECCAnalytics].[Buildings] Building "


          request.query(query2, function (err, records2) {
            if (err)
              console.log(query2);
            else {
              console.log(query2);
              //res.send(records['recordsets'][0]);
              //  your out put as records  

              //console.log(query2)
              lngth = records2['recordsets'][0].length
              console.log(records2['recordsets'][0].length)

              //                       console.log(records2['recordsets'][0][lngth-1].buildingname )
              if (lngth == 0) {
                // console.log(records2['recordsets'][0] )

                return res.status(200).json({ "value": lngth, "isENGVal": "1" })


              } else {
                // return res.status(200).json(records2['recordsets'][0])
                val = records2['recordsets'][0][lngth - 1].datapointvalue - records2['recordsets'][0][0].datapointvalue

                return res.status(200).json({ "value": val, "isENGVal": "1" })
              }
              // return res.status(200).json(data)
            }

          }

          )




          //**************************************** ELSE      ******** */

        } else {

          return res.status(200).json({ "value": records['recordsets'][0][0].avg, "isENGVal": "2" })
        }
        // return res.status(200).json(data)
      }

    }

    )
  })
}

const avgdpval = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  var equipmentname = req.query.equipmentname;
  var dt = req.query.dt;
  //var datapoint = req.query.datapoint;

  try {
    await pool.connect();
    const request = pool.request();

    var data = [];
    firstAvgSQL = "SELECT [datapointvalue]  FROM [" + dbName + "].[ECCAnalytics].[DataPointValue] DPV "
    firstAvgSQL += " left Join [" + dbName + "].[ECCAnalytics].[DataPoint] DP on DPV.[pointid] = DP.[pointid]  and DPV.[datapointid] = DP.[datapointid]  "
    firstAvgSQL += " inner JOIN  [" + dbName + "].[ECCAnalytics].[Devices] DV  "
    firstAvgSQL += " on DV.deviceid = DP.deviceid and [DV].recordid = [DP].devicerecordid "
    firstAvgSQL += " where [DV].equipmentname='" + equipmentname + "' and [DP].[isenergyvalue] = 1 and FORMAT(DPV.dated,'dd-MM-yyyy HH:mm:ss') >'" + dt + "'"
    firstAvgQueryResult = await request.query(firstAvgSQL)

    if (firstAvgQueryResult['recordsets'][0].length > 0) {
      val = firstAvgQueryResult['recordsets'][0][lngth - 1].datapointvalue - firstAvgQueryResult['recordsets'][0][0].datapointvalue
      return res.status(200).json({ "value": val, "isENGVal": "1" })
    } else {
      evarvalOfEngValOneSQL = "SELECT [evarvalue] from  [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation] where equipmentname = '" + equipmentname + "' and isenergyvalue = 1; "
      evarvalOfEngValOneSQLResult = await request.query(evarvalOfEngValOneSQL)

      if (evarvalOfEngValOneSQLResult['recordsets'][0].length > 0) {
        return res.status(200).json({ "evarvalue": evarvalOfEngValOneSQLResult['recordsets'][0][0].evarvalue })

      } else {
        var secondAvgSQL = "SELECT AVG(convert(float,DPV.[datapointvalue])) as avg FROM [" + dbName + "].[ECCAnalytics].[DataPointValue] DPV "
        secondAvgSQL += " left Join [" + dbName + "].[ECCAnalytics].[DataPoint] DP on DPV.[pointid] = DP.[pointid]  and DPV.[datapointid] = DP.[datapointid]  "
        secondAvgSQL += " inner JOIN  [" + dbName + "].[ECCAnalytics].[Devices] DV  "
        secondAvgSQL += " on DV.deviceid = DP.deviceid and [DV].recordid = [DP].devicerecordid "
        secondAvgSQL += " where [DV].equipmentname='" + equipmentname + "' and [DP].[isenergyvalue] = 2 and FORMAT(DPV.dated,'dd-MM-yyyy HH:mm:ss') >'" + dt + "'"
        secondAvgQueryResult = await request.query(secondAvgSQL)
        if (secondAvgQueryResult['recordsets'][0].length > 0) {
          return res.status(200).json({ "value": secondAvgQueryResult['recordsets'][0][0].avg, "isENGVal": "2" })
        } else {
          evarvalOfEngValTwoSQL = "SELECT [evarvalue] from  [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation] where equipmentname = '" + equipmentname + "' and isenergyvalue = 2; "
          evarvalOfEngValTwoResult = await request.query(evarvalOfEngValTwoSQL)
          if (evarvalOfEngValTwoResult['recordsets'][0].length > 0) {
            return res.status(200).json({ "evarvalue": evarvalOfEngValTwoResult['recordsets'][0][0].evarvalue })

          } else {
            return res.status(200).json('No data found')

          }

        }

      }
    }
  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }
}



const closetask_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse


  alarmid = req.body.alarmid
  closingdesc = req.body.closingdesc
  costavoided = req.body.costavoided
  energysaved = req.body.energysaved
  equipment = req.body.equipment
  ruleid = req.body.ruleid
  feedback = '4'

  query = " update Task set [Task].[taskstatus] = '0',  [Task].[taskcloseddate] = CURRENT_TIMESTAMP, [Task].[taskcloseddesc] = '" + closingdesc + "', [Task].[closingdesc] = '" + closingdesc + "', [Task].[feedback] = '" + feedback + "' from  [" + dbName + "].[ECCAnalytics].[Task] Task where [Task].[alarmid] = " + alarmid + ";"
  query2 = " update Alarm set [Alarm].[costavoided] = " + costavoided + ", [Alarm].[energysaved] = " + energysaved + ", [Alarm].[alarmstatus] = 0, [Alarm].[alarmofftimestamp] = CURRENT_TIMESTAMP,  [Alarm].[taskstatus] = '2' from  [" + dbName + "].[ECCAnalytics].[Alarm] Alarm where [Alarm].[alarmid] = " + alarmid + ";"
  //query3 = " update Ruletimer set [Ruletimer].[timer] = 0 from  ["+dbName+"].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '"+ruleno+"';"
  query3 = " update Ruletimer set [Ruletimer].[timer] = 0 from  [" + dbName + "].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '" + ruleid + "' and equipment = '" + equipment + "';"
  query = query + query2 + query3


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    request.query(query, function (err, records) {
      if (err)
        console.log(query);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        // var data = [];
        // return res.status(200).json(records['recordsets'][0])
        // console.log(records['recordsets'][0])
        return res.status(200).json({ 'status': 'success' })
      }

    }

    )
  })


}

const closetask = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  alarmid = req.body.alarmid
  closingdesc = req.body.closingdesc
  costavoided = req.body.costavoided
  energysaved = req.body.energysaved
  equipment = req.body.equipment
  ruleid = req.body.ruleid
  feedback = '4'


  try {

    await pool.connect();

    const request = pool.request();

    var data = [];

    query = " update Task set [Task].[taskstatus] = '0',  [Task].[taskcloseddate] = CURRENT_TIMESTAMP, [Task].[taskcloseddesc] = '" + closingdesc + "', [Task].[closingdesc] = '" + closingdesc + "', [Task].[feedback] = '" + feedback + "' from  [" + dbName + "].[ECCAnalytics].[Task] Task where [Task].[alarmid] = " + alarmid + ";"
    query2 = " update Alarm set [Alarm].[costavoided] = " + costavoided + ", [Alarm].[energysaved] = " + energysaved + ", [Alarm].[alarmstatus] = 0, [Alarm].[alarmofftimestamp] = CURRENT_TIMESTAMP,  [Alarm].[taskstatus] = '2' from  [" + dbName + "].[ECCAnalytics].[Alarm] Alarm where [Alarm].[alarmid] = " + alarmid + ";"
    //query3 = " update Ruletimer set [Ruletimer].[timer] = 0 from  ["+dbName+"].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '"+ruleno+"';"
    query3 = " update Ruletimer set [Ruletimer].[timer] = 0 from  [" + dbName + "].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '" + ruleid + "' and equipment = '" + equipment + "';"
    query = query + query2 + query3

    records = await request.query(query)

    return res.status(200).json({ 'status': 'success' })


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }


}


const buildingname_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  var datapointrecordid = req.query.datapointrecordid;
  var deviceid = req.query.deviceid;

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT [buildingname] as building FROM ["+dbName+"].[ECCAnalytics].[Buildings]"
    var query = " SELECT  Project.buildingname "

    query += "FROM  [" + dbName + "].[ECCAnalytics].[DataPointValue] DataPointValue "
    query += "inner join  [" + dbName + "].[ECCAnalytics].[DataPoint] DataPoint on DataPoint.datapointid =  DataPointValue.datapointid "
    query += "inner join  [" + dbName + "].[ECCAnalytics].[Devices] Devices on Devices.deviceid = DataPoint.deviceid "
    query += "inner join  [" + dbName + "].[ECCAnalytics].[Project] Project on Project.equipmentname = Devices.equipmentname"
    query += " where  DataPointValue.[datapointrecordid] = " + datapointrecordid + " AND DataPointValue.[deviceid] = " + deviceid + ";"





    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })
}

const buildingname = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  var datapointrecordid = req.query.datapointrecordid;
  var deviceid = req.query.deviceid;

  try {

    await pool.connect();

    const request = pool.request();


    var query = " SELECT  Project.buildingname "

    query += "FROM  [" + dbName + "].[ECCAnalytics].[DataPointValue] DataPointValue "
    query += "inner join  [" + dbName + "].[ECCAnalytics].[DataPoint] DataPoint on DataPoint.datapointid =  DataPointValue.datapointid "
    query += "inner join  [" + dbName + "].[ECCAnalytics].[Devices] Devices on Devices.deviceid = DataPoint.deviceid "
    query += "inner join  [" + dbName + "].[ECCAnalytics].[Project] Project on Project.equipmentname = Devices.equipmentname"
    query += " where  DataPointValue.[datapointrecordid] = " + datapointrecordid + " AND DataPointValue.[deviceid] = " + deviceid + ";"

    records = await request.query(query)
    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }

}



const equipmentname_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  var datapointrecordid = req.query.datapointrecordid;
  var deviceid = req.query.deviceid;

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT [buildingname] as building FROM ["+dbName+"].[ECCAnalytics].[Buildings]"
    var query = " SELECT Devices.equipmentname "

    query += "FROM  [" + dbName + "].[ECCAnalytics].[DataPointValue] DataPointValue "
    query += "inner join  [" + dbName + "].[ECCAnalytics].[DataPoint] DataPoint on DataPoint.datapointid =  DataPointValue.datapointid "
    query += "inner join  [" + dbName + "].[ECCAnalytics].[Devices] Devices on Devices.deviceid = DataPoint.deviceid "
    query += " where  DataPointValue.[datapointrecordid] = " + datapointrecordid + " AND DataPointValue.[deviceid] = " + deviceid + ";"





    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })
}


const equipmentname = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  var datapointrecordid = req.query.datapointrecordid;
  var deviceid = req.query.deviceid;

  try {

    await pool.connect();

    const request = pool.request();


    var query = " SELECT Devices.equipmentname "

    query += "FROM  [" + dbName + "].[ECCAnalytics].[DataPointValue] DataPointValue "
    query += "inner join  [" + dbName + "].[ECCAnalytics].[DataPoint] DataPoint on DataPoint.datapointid =  DataPointValue.datapointid "
    query += "inner join  [" + dbName + "].[ECCAnalytics].[Devices] Devices on Devices.deviceid = DataPoint.deviceid "
    query += " where  DataPointValue.[datapointrecordid] = " + datapointrecordid + " AND DataPointValue.[deviceid] = " + deviceid + ";"

    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }


}


const email_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  //ruleid = req.body.ruleid
  dbName = config.databse


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT [buildingname] as building FROM ["+dbName+"].[ECCAnalytics].[Buildings]"
    // query = "SELECT [ruleid],[ruleno],[possiblecauses],[recommendations],[duration],[inputname],[alarmemailid],[escalationemailid] FROM  ["+dbName+"].[ECCAnalytics].[Rules] where [Rules].[ruleid] = '"+req.query.ruleid+"';"

    query = "SELECT  [recordid],[ruleid],[equipmentid],[associatedequipmentid],[analysisid],[duration],[escalationduration],[pointsconsidered],[alarm],[recommendations],[measure],[priority],[multiplicationfactor] FROM  [" + dbName + "].[ECCAnalytics].[Rules] where [Rules].[ruleid] = '" + req.query.ruleid + "';"




    request.query(query, function (err, records) {
      if (err)
        console.log(query);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        return res.status(200).json(records['recordsets'][0])
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          //data.push({ruleid: records['recordsets'][0][i]['ruleid'],ruleno: records['recordsets'][0][i]['ruleno'],possiblecauses: records['recordsets'][0][i]['possiblecauses'],recommendations: records['recordsets'][0][i]['recommendations'], duration: records['recordsets'][0][i]['duration'],inputname: records['recordsets'][0][i]['inputname'],alarmemailid: records['recordsets'][0][i]['alarmemailid'],escalationemailid: records['recordsets'][0][i]['escalationemailid']});
          data.push({ ruleid: records['recordsets'][0][i]['ruleid'], ruleno: records['recordsets'][0][i]['ruleno'], recommendations: records['recordsets'][0][i]['recommendations'], duration: records['recordsets'][0][i]['duration'], inputname: records['recordsets'][0][i]['inputname'] });
        }

        return res.status(200).json(data)
      }

    }

    )
  })
}


const email = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  try {

    await pool.connect();

    const request = pool.request();

    var data = [];

    query = "SELECT  [recordid],[ruleid],[equipmentid],[associatedequipmentid],[analysisid],[duration],[escalationduration],[pointsconsidered],[alarm],[recommendations],[measure],[priority],[multiplicationfactor] FROM  [" + dbName + "].[ECCAnalytics].[Rules] where [Rules].[ruleid] = '" + req.query.ruleid + "';"

    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }


}

const addalarmdata_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  ruleid = req.body.ruleid
  ruleno = req.body.ruleno// not in use
  deviceid = req.body.deviceid
  analysisname = req.body.analysisname
  analyticsummary = req.body.analyticsummary
  measuretype = req.body.measuretype
  alarmstatus = req.body.alarmstatus
  building = req.body.buildingname
  escalationstage = req.body.escalationstage
  datapointrecordid = req.body.datapointrecordid //changes done  on 4/1/2023
  equipmentname = req.body.equipmentname
  //nameOfBuilding = req.body.buildingname
  //nameOfEquipment = req.body.equipmentname


  //sql = "INSERT INTO ECCAnalytics.Alarm (datapointrecordid,ruleid,deviceid,analysisname,analyticsummary,measuretype,alarmstatus,buildingname,alarmontimestamp,escalationstage,ruleno) VALUES ("+datapointrecordid+",'"+ruleid+"','"+deviceid+"','"+analysisname+"','"+analyticsummary+"','"+measuretype+"',"+alarmstatus+",'"+buildingname+"',CURRENT_TIMESTAMP,'"+escalationstage+"','"+ruleno+"');"
  query = "INSERT INTO  [" + dbName + "].[ECCAnalytics].[Alarm] ([datapointrecordid],[ruleid],[deviceid],[analysisname],[analyticsummary],[measuretype],[alarmstatus],[buildingname],[alarmontimestamp],[escalationstage],[ruleno],[equipmentname]) VALUES (" + datapointrecordid + ",'" + ruleid + "','" + deviceid + "','" + analysisname + "','" + analyticsummary + "','" + measuretype + "'," + alarmstatus + ",'" + building + "',CURRENT_TIMESTAMP,'" + escalationstage + "','" + ruleno + "','" + equipmentname + "');"


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        return res.status(200).json({ 'status': 'success' })

      }


    })
  })


}


const addalarmdata = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  ruleid = req.body.ruleid
  ruleno = req.body.ruleno// not in use
  deviceid = req.body.deviceid
  analysisname = req.body.analysisname
  analyticsummary = req.body.analyticsummary
  measuretype = req.body.measuretype
  alarmstatus = req.body.alarmstatus
  building = req.body.buildingname
  escalationstage = req.body.escalationstage
  datapointrecordid = req.body.datapointrecordid //changes done  on 4/1/2023
  equipmentname = req.body.equipmentname
  //nameOfBuilding = req.body.buildingname
  //nameOfEquipment = req.body.equipmentname


  //sql = "INSERT INTO ECCAnalytics.Alarm (datapointrecordid,ruleid,deviceid,analysisname,analyticsummary,measuretype,alarmstatus,buildingname,alarmontimestamp,escalationstage,ruleno) VALUES ("+datapointrecordid+",'"+ruleid+"','"+deviceid+"','"+analysisname+"','"+analyticsummary+"','"+measuretype+"',"+alarmstatus+",'"+buildingname+"',CURRENT_TIMESTAMP,'"+escalationstage+"','"+ruleno+"');"


  try {

    await pool.connect();

    const request = pool.request();

    query = "INSERT INTO  [" + dbName + "].[ECCAnalytics].[Alarm] ([datapointrecordid],[ruleid],[deviceid],[analysisname],[analyticsummary],[measuretype],[alarmstatus],[buildingname],[alarmontimestamp],[escalationstage],[ruleno],[equipmentname]) VALUES (" + datapointrecordid + ",'" + ruleid + "','" + deviceid + "','" + analysisname + "','" + analyticsummary + "','" + measuretype + "'," + alarmstatus + ",'" + building + "',CURRENT_TIMESTAMP,'" + escalationstage + "','" + ruleno + "','" + equipmentname + "');"

    await request.query(query)
    return res.status(200).json({ 'status': 'success' })


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }


}


const getcalculation_9_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  var ruleid = req.query.ruleid;

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT [buildingname] as building FROM ["+dbName+"].[ECCAnalytics].[Buildings]"
    var query = " SELECT [multiplicationfactor] FROM [" + dbName + "].[ECCAnalytics].[Rules] where ruleid ='" + ruleid + "'"






    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        return res.status(200).json(records['recordsets'][0])
        // return res.status(200).json(data)
      }

    }

    )
  })
}


const getcalculation = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  var ruleid = req.query.ruleid;

  try {

    await pool.connect();

    const request = pool.request();

    var query = " SELECT [multiplicationfactor] FROM [" + dbName + "].[ECCAnalytics].[Rules] where ruleid ='" + ruleid + "'"

    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }


}



const dashboardlogin_9_7_2024 = (req, res) => {
  //ruleid = req.body.ruleid
  console.log(req.originalUrl)

  username = req.body.uid
  password = req.body.pass

  sql.connect(config, function (err) {
    if (err) console.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
    dbName = config.databse
    login_query = "SELECT * FROM [" + dbName + "].ECCAnalytics.Users where username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' and pswd COLLATE SQL_Latin1_General_CP1_CS_AS ='" + password + "'"
    request.query(login_query, function (err, records) {

      if (err)
        console.log(err);
      else {
        if (records['recordsets'][0].length != 0) {

          // if(records['recordsets'][0][0].loginstatus == 1 && records['recordsets'][0][0].roles !='MasterAdmin'){
          if (records['recordsets'][0][0].analyticloginstatus == 1 && records['recordsets'][0][0].roles != 'MasterAdmin') {
            data = { 'status': 'Already loggedin' }
            return res.status(200).json(data)
          } else {
            data = { 'userid': records['recordsets'][0][0].userid, 'mailid': records['recordsets'][0][0].useremailid, 'roles': records['recordsets'][0][0].roles, 'loginstatus': records['recordsets'][0][0].loginstatus }
            console.log(records['recordsets'][0][0].username)
            //------------------------
            let updateQuery = "update [" + dbName + "].ECCAnalytics.Users set [analyticloginstatus] = 1 where  username ='" + username + "';"
            //updateQuery += "insert into ["+dbName+"].ECCAnalytics.UserLog ([username],[userrole],[logintime]) values ('"+username+"','"+records['recordsets'][0][0].roles+"', CURRENT_TIMESTAMP);"
            updateQuery += "insert into [" + dbName + "].ECCAnalytics.UserLog ([username],[userrole],[logintime],app) values ('" + username + "','" + records['recordsets'][0][0].roles + "', CURRENT_TIMESTAMP,2);"
            request.query(updateQuery, function (err, records) {
              if (err)
                console.log(err);
              else {
                //return res.status(200).json({'status': 'success'})
                return res.status(200).json(data)
              }

            })

          }
          //----------------------
          // return res.status(200).json(data)
        }
        else {
          data = { 'status': 'No Data Found' }
          return res.status(200).json(data)
        }
      }

    }

    )
  })
}

const dashboardlogin = async (req, res) => {
  //ruleid = req.body.ruleid
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  username = req.body.uid
  password = req.body.pass

  try {

    await pool.connect();

    const request = pool.request();

    login_query = "SELECT * FROM [" + dbName + "].ECCAnalytics.Users where username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' and pswd COLLATE SQL_Latin1_General_CP1_CS_AS ='" + password + "'"

    records = await request.query(login_query)

    if (records['recordsets'][0].length != 0) {

      // if(records['recordsets'][0][0].loginstatus == 1 && records['recordsets'][0][0].roles !='MasterAdmin'){
      if (records['recordsets'][0][0].analyticloginstatus == 1 && records['recordsets'][0][0].roles != 'MasterAdmin') {
        data = { 'status': 'Already loggedin' }
        return res.status(200).json(data)
      } else {
        data = { 'userid': records['recordsets'][0][0].userid, 'mailid': records['recordsets'][0][0].useremailid, 'roles': records['recordsets'][0][0].roles, 'loginstatus': records['recordsets'][0][0].loginstatus }
        console.log(records['recordsets'][0][0].username)
        //------------------------
        let updateQuery = "update [" + dbName + "].ECCAnalytics.Users set [analyticloginstatus] = 1 where  username ='" + username + "';"
        //updateQuery += "insert into ["+dbName+"].ECCAnalytics.UserLog ([username],[userrole],[logintime]) values ('"+username+"','"+records['recordsets'][0][0].roles+"', CURRENT_TIMESTAMP);"
        updateQuery += "insert into [" + dbName + "].ECCAnalytics.UserLog ([username],[userrole],[logintime],app) values ('" + username + "','" + records['recordsets'][0][0].roles + "', CURRENT_TIMESTAMP,2);"
        await request.query(updateQuery)
        return res.status(200).json(data)

      }

    }
    else {
      data = { 'status': 'No Data Found' }
      return res.status(200).json(data)
    }

  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }

}

const dashboardlogout_9_7_2024 = (req, res) => {
  dbName = config.databse
  username = req.query.uid
  console.log(req.originalUrl)

  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var request = new sql.Request();


    //query = "SELECT [userid],[username],[roles],[useremailid],[pswd],[loginstatus] FROM ["+dbName+"].[ECCAnalytics].Users"
    // query = "update ["+dbName+"].ECCAnalytics.Users set [loginstatus] = 0 where  username ='"+username+ "';"
    query = "update [" + dbName + "].ECCAnalytics.Users set [analyticloginstatus] = 0 where  username ='" + username + "';"
    //query += "update  ["+dbName+"].ECCAnalytics.UserLog set [logouttime] = CURRENT_TIMESTAMP where  username ='"+username+"' and logouttime IS NULL;"
    query += "update  [" + dbName + "].ECCAnalytics.UserLog set [logouttime] = CURRENT_TIMESTAMP where  username  COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' and [app] = 2 and logouttime IS NULL and recordid = (SELECT TOP (1) [recordid] from  [" + dbName + "].[ECCAnalytics].[UserLog] where username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' order by recordid desc);"

    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        return res.status(200).json({ "status": "success" })
      }

    }

    )
  })
}


const dashboardlogout = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  username = req.query.uid

  try {

    await pool.connect();

    const request = pool.request();

    query = "update [" + dbName + "].ECCAnalytics.Users set [analyticloginstatus] = 0 where  username ='" + username + "';"
    //query += "update  ["+dbName+"].ECCAnalytics.UserLog set [logouttime] = CURRENT_TIMESTAMP where  username ='"+username+"' and logouttime IS NULL;"
    query += "update  [" + dbName + "].ECCAnalytics.UserLog set [logouttime] = CURRENT_TIMESTAMP where  username  COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' and [app] = 2 and logouttime IS NULL and recordid = (SELECT TOP (1) [recordid] from  [" + dbName + "].[ECCAnalytics].[UserLog] where username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' order by recordid desc);"

    await request.query(query)
    return res.status(200).json({ "status": "success" })


  } catch (err) {

    console.error('Error with SQL Server:', err);

  } finally {

    // Close the connection pool

    pool.close();
  }


}

const getbuildingvariablevalue = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  try {
    await pool.connect();
    const request = pool.request();

    buildingName = req.query.buildingname
    bvarid = req.query.bvarid
    cvarid = 'CVAR-' + bvarid.split("-")[1]
    BVOTableSQL = "select * FROM [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation]  where [buildingname] = '" + buildingName + "' and [bvarid] = '" + bvarid + "';"
    records = await request.query(BVOTableSQL)
    if (records['recordsets'][0].length > 0) {
      return res.status(200).json({ "bvarvalue": records['recordsets'][0][0]['bvarvalue'] })
    } else {
      splittedValue = bvarid.split("-")
      buildingSQL = "select campusname FROM [" + dbName + "].[ECCAnalytics].[Buildings]  where [buildingname] = '" + buildingName + "';"

      records = await request.query(buildingSQL)
      if (records['recordsets'][0].length < 1) {
        return res.status(200).json('no data')

      }
      campusName = records['recordsets'][0][0]['campusname']

      campusVarOpSQL = "select * FROM [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation]  where [campusname] = '" + campusName + "' and [cvarid] = '" + cvarid + "';"
      campusVarOpRecords = await request.query(campusVarOpSQL)

      if (campusVarOpRecords['recordsets'][0].length > 0) {
        return res.status(200).json({ "cvarvalue": campusVarOpRecords['recordsets'][0][0]['cvarvalue'] })
      } else {
        return res.status(200).json('no data')
      }

    }
  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();

  }


}



/*********************************************TEST API ********************************************************* */
const test = (req, res) => {
  var qid = req.query.id;
  //alarmid = req.body.alarmid

  //return res.status(200).json(qid)


  const pool = new sql.ConnectionPool(config);

  // Connect to the SQL Server
  pool.connect().then(() => {
    // Query example
    pool.request().query('SELECT TOP (1000) [recordid],[campusname],[buildingname] FROM [ECCDB].[ECCAnalytics].[Buildings]').then(result => {
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
  dashboardlogin,
  dashboardlogout,
  avgdpval,
  getbuildingvariablevalue,
  test

}