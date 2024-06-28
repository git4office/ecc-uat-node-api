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




const closealarm = (req,res)=>{
    alarmid = req.body.alarmid
    ruleno = req.body.ruleno
    ruleid = req.body.ruleid

    query = "update  Alarm set [Alarm].[alarmstatus] = 0, [Alarm].[alarmofftimestamp] = CURRENT_TIMESTAMP from [ECCDB].[ECCAnalytics].[Alarm] Alarm where [Alarm].[alarmid] = "+alarmid+"; "
    query2 = " update  Ruletimer set [Ruletimer].[timer] = 0 from [ECCDB].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '"+ruleno+"' and [Ruletimer].[ruleid] = "+ruleid+";"

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


const projview = (req,res)=>{
    //ruleid = req.body.ruleid

    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
       //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
       query = "SELECT [recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[equipmenttype],[subequipmentname],[subequipmentdesc],[users]  FROM [ECCDB].[ECCAnalytics].[Project]"
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               //res.send(records['recordsets'][0]);
               //  your out put as records  
           // return res.status(200).json(records['recordsets'][0])
            var data = [];
            for (var i = 0; i < records['recordsets'][0].length; i++) { 
             data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
             //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
            }

            return res.status(200).json(data)
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

const bulkalarmdata = (req,res)=>{
  const pollname = req.body.pollname;
  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
      //var query = "SELECT [alarmid],[datapointrecordid] ,[ruleid] ,[deviceid],[analysisname] ,[analyticsummary],[measuretype] ,[costavoided] ,[energysaved] ,[alarmstatus],[alarmontimestamp] ,[alarmofftimestamp] ,[escalationstage] ,[buildingname] ,[taskstatus] from [ECCDB].[ECCAnalytics].[Alarm] where alarmstatus = 1 OR alarmstatus = 0 AND taskstatus = 2"
/*        var query = "SELECT [T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T7].[equipmenttype],[T7].[subequipmenttype]  FROM [ECCDB].[ECCAnalytics].[Alarm] T1  left JOIN [ECCDB].[ECCAnalytics].[Buildings] T2 on [T1].buildingname =  [T2].buildingname left JOIN [ECCDB].[ECCAnalytics].[Campuses] T3 on [T2].[campusname] = [T3].[campusname] left JOIN [ECCDB].[ECCAnalytics].[Cities] T4 on [T4].cityname = [T3].cityname LEFT JOIN [ECCDB].[ECCAnalytics].[Countries] T5 on [T5].countryname = [T4].countryname "
      query +=  " left join [ECCDB].[ECCAnalytics].[Devices] T6 "
      query += " on [T1].[deviceid] = [T6].[deviceid] "
      query += " inner join [ECCDB].[ECCAnalytics].[SubEquipments] T7 "
      query += " on [T6].equipmentname = [T7].equipmenttype where 1 = 1 "
*/
var query = "SELECT [T10].[subequipmenttype],[T10].[equipmenttype],[T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T1].[ruleno] FROM [ECCDB].[ECCAnalytics].[Alarm] T1  left JOIN [ECCDB].[ECCAnalytics].[Buildings] T2 "

query +=  "on [T1].buildingname =  [T2].buildingname "
query +=  " left JOIN [ECCDB].[ECCAnalytics].[Campuses] T3 "
query += " on [T2].[campusname] = [T3].[campusname] "
query +=  " left JOIN [ECCDB].[ECCAnalytics].[Cities] T4 "
query += " on [T4].cityname = [T3].cityname "
query += " LEFT JOIN [ECCDB].[ECCAnalytics].[Countries] T5 "
query += " on [T5].countryname = [T4].countryname  "
query +=  " inner join [ECCDB].[ECCAnalytics].[DataPointValue] T6"
query +=  " on [T1].datapointrecordid = [T6].datapointrecordid "
query += " inner join [ECCDB].[ECCAnalytics].[DataPoint] T7 "
query +=  " on [T6].datapoint = [T7].datapoint "
query += " inner join [ECCDB].[ECCAnalytics].[Devices] T8 "
query +=  " on [T7].deviceid = [T8].deviceid  "
query += " inner join [ECCDB].[ECCAnalytics].[Project] T9 "
query += " on [T8].equipmentname = [T9].equipmentname "
query += " inner join [ECCDB].[ECCAnalytics].[SubEquipments] T10 " 
//query += " on [T9].subequipmentname = [T10].subequipmenttype where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmid] "
query += " on [T9].subequipmentname = [T10].subequipmenttype where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmontimestamp] "
             
  
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
          return res.status(200).json(data)
      }
  
      }
  
  )
  })
}


const updatetask = (req,res)=>{

  query = '';
  dt = 22;
  for (let i = 268; i < 279; i++) {
    query += "update [ECCDB].[ECCAnalytics].[Task]  set [taskassigneddate] = cast('2022-07-"+dt+"' as date),[taskcloseddate] = cast('2022-07-"+dt+"' as date) from [ECCDB].[ECCAnalytics].[Task] Task  where [Task].[recordid] = "+i+";";
    dt++;
  }


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(query,function(err,records){
          if(err)
          console.log(query);
          else{
                  
            console.log('success');
            return res.status(200).json('success')

          }
      
  
      })
  })


}


module.exports = {

    projview,
    updatetask,
    test
    
}