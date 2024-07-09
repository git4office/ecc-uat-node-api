const express = require('express');
var async = require("async");
const sql = require('mssql/msnodesqlv8');

//var port = require('./const');
var config = require('../model/model-db');
var DB = config.databse
var dbName = config.databse

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

const addalarmdata = (req,res)=>{
  console.log(req.originalUrl);

  ruleid =  req.body.ruleid
  ruleno = req.body.ruleno
  deviceid = req.body.deviceid
  analysisname = req.body.analysisname
  analyticsummary = req.body.analyticsummary
  measuretype = req.body.measuretype
  alarmstatus = req.body.alarmstatus
  building = req.body.buildingname
  escalationstage = req.body.escalationstage
  datapointrecordid = req.body.datapointrecordid //changes done  on 4/1/2023 req by Sumaya
  equipmentname = req.body.equipmentname


  //sql = "INSERT INTO ECCAnalytics.Alarm (datapointrecordid,ruleid,deviceid,analysisname,analyticsummary,measuretype,alarmstatus,buildingname,alarmontimestamp,escalationstage,ruleno) VALUES ("+datapointrecordid+",'"+ruleid+"','"+deviceid+"','"+analysisname+"','"+analyticsummary+"','"+measuretype+"',"+alarmstatus+",'"+buildingname+"',CURRENT_TIMESTAMP,'"+escalationstage+"','"+ruleno+"');"
  query = "INSERT INTO ["+dbName+"].[ECCAnalytics].[Alarm] ([datapointrecordid],[ruleid],[deviceid],[analysisname],[analyticsummary],[measuretype],[alarmstatus],[buildingname],[alarmontimestamp],[escalationstage],[ruleno],[equipmentname]) VALUES ("+datapointrecordid+",'"+ruleid+"','"+deviceid+"','"+analysisname+"','"+analyticsummary+"','"+measuretype+"',"+alarmstatus+",'"+building+"',CURRENT_TIMESTAMP,'"+escalationstage+"','"+ruleno+"','"+equipmentname+"');"


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(query,function(err,records){
          if(err)
          console.log(query);
          else{
              return res.status(200).json({'status': 'success'})
                  
               }
      
  
      })
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
       query = "SELECT [recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[equipmenttype],[subequipmentname],[subequipmentdesc],[users]  FROM ["+dbName+"].[ECCAnalytics].[Project]"
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




const email = (req,res)=>{
  //ruleid = req.body.ruleid

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
     //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
     //query = "SELECT [ruleid],[ruleno],[possiblecauses],[recommendations],[duration],[inputname],[alarmemailid],[escalationemailid] FROM ["+dbName+"].[ECCAnalytics].[Rules] where [Rules].[ruleid] = '"+req.query.ruleid+"';"
     query = "SELECT [recordid],[ruleid],[equipmentid],[associatedequipmentid],[recommendations],[pointsconsidered],[priority] FROM ["+dbName+"].[ECCAnalytics].[Rules] where [Rules].[ruleid] = '"+req.query.ruleid+"';"



         
  
      request.query(query,function(err,records){
          if(err)
          console.log(query);
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



const updatetask = (req,res)=>{
  console.log(req.originalUrl);

  query = '';
  dt = 22;
  for (let i = 268; i < 279; i++) {
    query += "update ["+dbName+"].[ECCAnalytics].[Task]  set [taskassigneddate] = cast('2022-07-"+dt+"' as date),[taskcloseddate] = cast('2022-07-"+dt+"' as date) from [ECCDB].[ECCAnalytics].[Task] Task  where [Task].[recordid] = "+i+";";
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




const datapoints = (req,res)=>{
  console.log(req.originalUrl);

  //ruleid = req.body.ruleid
  dbName = config.databse

  //deviceid = req.query.deviceid
  //deviceid = req.query.deviceid
  eqpname = req.query.eqpname
  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
     query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].DataPoint WHERE DATEDIFF(HOUR, dated, GETDATE()) > 24;"
     //query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].DataPoint WHERE  deviceid ="+deviceid+";"
     //query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].DataPoint WHERE devicerecordid in (SELECT [recordid] FROM ["+dbName+"].[ECCAnalytics].[Devices] where equipmentname = '"+eqpname+"') and DATEDIFF(HOUR, dated, GETDATE()) > 24;"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
             //res.send(records['recordsets'][0]);
             //  your out put as records  
         // return res.status(200).json(records['recordsets'][0])
         console.log(query)
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
            //data.push({datapointid: records['recordsets'][0][i]['datapointid'],deviceid: records['recordsets'][0][i]['deviceid'],datapoint: records['recordsets'][0][i]['datapoint'],actualpoint: records['recordsets'][0][i]['actualpoint'], multiply: records['recordsets'][0][i]['multiply'],addition: records['recordsets'][0][i]['addition'],time: records['recordsets'][0][i]['dated'],type: records['recordsets'][0][i]['objtype'],instance: records['recordsets'][0][i]['objinstance']});
            data.push({datapointid: records['recordsets'][0][i]['datapointid'],deviceid: records['recordsets'][0][i]['deviceid'],pointid: records['recordsets'][0][i]['pointid'],actualpoint: records['recordsets'][0][i]['actualpoint'], multiply: records['recordsets'][0][i]['multiply'],addition: records['recordsets'][0][i]['addition'],time: records['recordsets'][0][i]['dated'],objtype: records['recordsets'][0][i]['objtype'],objinstance: records['recordsets'][0][i]['objinstance'],devicerecordid: records['recordsets'][0][i]['devicerecordid']});
            //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
          }

          return res.status(200).json(data)
      }
  
      }
  
  )
  })
}



const totaldatapoints = (req,res)=>{
  console.log(req.originalUrl);

  //ruleid = req.body.ruleid

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
     query = "SELECT count(*) as totalrecord FROM ["+dbName+"].[ECCAnalytics].DataPoint;"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
             //res.send(records['recordsets'][0]);
             //  your out put as records  
         // return res.status(200).json(records['recordsets'][0])
         // var data = [];

          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}




const postdatapointvalue = (req,res)=>{
  console.log(req.originalUrl);

//  dic =  req.body.ruleid
 
//for (const dic of req.body) { console.log(x); }
qry2Values=""
//sql = "" 
count = 0
for (const dic of req.body.data) {  
  //qry2Values+="('"+dic['datapointid']+"', '"+dic['deviceid']+"', '"+dic['datapoint']+"', '"+dic['datapointvalue']+"', CURRENT_TIMESTAMP,'"+dic['units']+"'),"
  qry2Values+="('"+dic['datapointid']+"', '"+dic['deviceid']+"', '"+dic['pointid']+"','"+dic['datapointvalue']+"', CURRENT_TIMESTAMP),"
 //console.log(x); 
} 

var qry = "INSERT INTO ["+dbName+"].[ECCAnalytics].DataPointValue ( datapointid,deviceid,pointid,datapointvalue,dated) VALUES " + qry2Values

qry = qry.substring(0, qry.length - 1);

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(qry,function(err,records){
          if(err)
          console.log(err);
          else{
            console.log(qry)
              return res.status(200).json({'status': 'success'})
                  
               }
  
      })
  })

}


/*888888888********/

function callingAddrule(ruleid,equipmentid,associatedequipmentid,analysisid,duration,escalationduration,pointsconsidered,alarm,recommendations,measure,priority,multiplicationfactor){


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
     // for(;i<req.body.data.length; i++){
        chkquery = "SELECT  [ruleid] FROM ["+dbName+"].[ECCAnalytics].[Rules] where ruleid ='"+ruleid+"';"
       // chkquery = "SELECT  [ruleid] FROM ["+dbName+"].[ECCAnalytics].[Rules] where ruleid ='"+req.body.data[i].ruleid+"';"

  
      request.query(chkquery,function(err,records){
          if(err)
          console.log(err);
          else{
                        if(records['recordsets'][0].length ==0){
                                  //return res.status(200).json('User exists')

                                  query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].Rules ([ruleid],[equipmentid],[associatedequipmentid],[analysisid],[duration],[escalationduration],[pointsconsidered],[alarm],[recommendations],[measure],[priority],[multiplicationfactor]) VALUES ('"+ruleid+"','"+equipmentid+"','"+associatedequipmentid+"','"+analysisid+"','"+duration+"','"+escalationduration+"','"+pointsconsidered+"','"+alarm+"','"+recommendations+"','"+measure+"','"+priority+"','"+multiplicationfactor+"')"
                                  //query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].Rules ([ruleid],[equipmentid],[associatedequipmentid],[analysisid],[duration],[escalationduration],[pointsconsidered],[alarm],[recommendations],[measure],[priority],[multiplicationfactor]) VALUES ('"+req.body.data[i].ruleid+"','"+req.body.data[i].equipmentid+"','"+req.body.data[i].associatedequipmentid+"','"+req.body.data[i].analysisid+"','"+req.body.data[i].duration+"','"+req.body.data[i].escalationduration+"','"+req.body.data[i].pointsconsidered+"','"+req.body.data[i].alarm+"','"+req.body.data[i].recommendations+"','"+req.body.data[i].measure+"','"+req.body.data[i].priority+"','"+req.body.data[i].multiplicationfactor+"')"
                                  request.query(query2,function(err,records){
                                    if(err)
                                    console.log(query2);
                                    else{
                                      console.log(query2);

                                  return 1
                                    }
                                  }
                                  )
                        }
                        else   {
                                   // query2 = "update ["+dbName+"].ECCAnalytics.Rules set  [equipmentid]='"+req.body.data[i].equipmentid+"',[associatedequipmentid]='"+req.body.data[i].associatedequipmentid+"',[analysisid]='"+req.body.data[i].analysisid+"',[duration]='"+req.body.data[i].duration+"',[escalationduration]='"+req.body.data[i].escalationduration+"',[pointsconsidered]='"+req.body.data[i].pointsconsidered+"',[alarm]='"+req.body.data[i].alarm+"',[recommendations]='"+req.body.data[i].recommendations+"',[measure]='"+req.body.data[i].measure+"',[priority]='"+req.body.data[i].priority+"',[multiplicationfactor]='"+req.body.data[i].multiplicationfactor+"' where [ruleid]='"+req.body.data[i].ruleid+"'"
                                    query2 = "update ["+dbName+"].ECCAnalytics.Rules set  [equipmentid]='"+equipmentid+"',[associatedequipmentid]='"+associatedequipmentid+"',[analysisid]='"+analysisid+"',[duration]='"+duration+"',[escalationduration]='"+escalationduration+"',[pointsconsidered]='"+pointsconsidered+"',[alarm]='"+alarm+"',[recommendations]='"+recommendations+"',[measure]='"+measure+"',[priority]='"+priority+"',[multiplicationfactor]='"+multiplicationfactor+"' where [ruleid]='"+ruleid+"'"
                                    request.query(query2,function(err,records){
                                      if(err)
                                      console.log(err);
                                      else{
                                        console.log(query2);

                                    return 2
                                      }
                                    }
                                    )
                             }
              
                              
                  }
                  
  
              })
           // }
          //  return res.status(200).json('completed')

  })

}


function callingUpdaterule(ruleid,equipmentid,associatedequipmentid,analysisid,duration,escalationduration,pointsconsidered,alarm,recommendations,measure,priority,multiplicationfactor){


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
     // for(;i<req.body.data.length; i++){
        chkquery = "SELECT  [ruleid] FROM ["+dbName+"].[ECCAnalytics].[Rules] where ruleid ='"+ruleid+"';"
       // chkquery = "SELECT  [ruleid] FROM ["+dbName+"].[ECCAnalytics].[Rules] where ruleid ='"+req.body.data[i].ruleid+"';"

  
      request.query(chkquery,function(err,records){
          if(err)
          console.log(chkquery);
          else{
            console.log(query2);

                        if(records['recordsets'][0].length ==0){
                                  //return res.status(200).json('User exists')

                                  query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].Rules ([ruleid],[equipmentid],[associatedequipmentid],[analysisid],[duration],[escalationduration],[pointsconsidered],[alarm],[recommendations],[measure],[priority],[multiplicationfactor]) VALUES ('"+ruleid+"','"+equipmentid+"','"+associatedequipmentid+"','"+analysisid+"','"+duration+"','"+escalationduration+"','"+pointsconsidered+"','"+alarm+"','"+recommendations+"','"+measure+"','"+priority+"','"+multiplicationfactor+"')"
                                  //query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].Rules ([ruleid],[equipmentid],[associatedequipmentid],[analysisid],[duration],[escalationduration],[pointsconsidered],[alarm],[recommendations],[measure],[priority],[multiplicationfactor]) VALUES ('"+req.body.data[i].ruleid+"','"+req.body.data[i].equipmentid+"','"+req.body.data[i].associatedequipmentid+"','"+req.body.data[i].analysisid+"','"+req.body.data[i].duration+"','"+req.body.data[i].escalationduration+"','"+req.body.data[i].pointsconsidered+"','"+req.body.data[i].alarm+"','"+req.body.data[i].recommendations+"','"+req.body.data[i].measure+"','"+req.body.data[i].priority+"','"+req.body.data[i].multiplicationfactor+"')"
                                  request.query(query2,function(err,records){
                                    if(err)
                                    console.log(query2);
                                    else{
                                      console.log(query2);

                                  return 1
                                    }
                                  }
                                  )
                        }
                        else   {
                                    query2 = "update ["+dbName+"].ECCAnalytics.Rules set  [equipmentid]='"+equipmentid+"',[associatedequipmentid]='"+associatedequipmentid+"',[analysisid]='"+analysisid+"',[duration]='"+duration+"',[escalationduration]='"+escalationduration+"',[pointsconsidered]='"+pointsconsidered+"',[alarm]='"+alarm+"',[recommendations]='"+recommendations+"',[measure]='"+measure+"',[priority]='"+priority+"',[multiplicationfactor]='"+multiplicationfactor+"' where [ruleid]='"+ruleid+"'"
                                    request.query(query2,function(err,records){
                                      if(err)
                                      console.log(query2);
                                      else{
                                        console.log(query2);

                                    return 2
                                      }
                                    }
                                    )
                             }
              
                              
                  }
                  
  
              })
           // }
          //  return res.status(200).json('completed')

  })

}

/************************** */
const addrules = (req,res)=>{
  console.log(req.originalUrl);
  let i =0;

data = req.body.data;
//console.log(req.body.data.length);
//console.log(req.body.data[0].ruleid);

ruleid = req.body.data[0].ruleid
equipmentid = req.body.data[0].equipmentid
associatedequipmentid = req.body.data[0].associatedequipmentid
analysisid = req.body.data[0].analysisid
duration = req.body.data[0].duration
escalationduration = req.body.data[0].escalationduration
pointsconsidered = req.body.data[0].pointsconsidered
alarm = req.body.data[0].alarm
recommendations = req.body.data[0].recommendations
measure = req.body.data[0].measure
priority =  req.body.data[0].priority
multiplicationfactor = req.body.data[0].multiplicationfactor


for(;i<req.body.data.length; i++){
  ruleid = req.body.data[i].ruleid
  equipmentid = req.body.data[i].equipmentid
  associatedequipmentid = req.body.data[i].associatedequipmentid
  analysisid = req.body.data[i].analysisid
  duration = req.body.data[i].duration
  escalationduration = req.body.data[i].escalationduration
  pointsconsidered = req.body.data[i].pointsconsidered
  alarm = req.body.data[i].alarm
  recommendations = req.body.data[i].recommendations
  measure = req.body.data[i].measure
  priority =  req.body.data[i].priority
  multiplicationfactor = req.body.data[i].multiplicationfactor
  
  callingAddrule(ruleid,equipmentid,associatedequipmentid,analysisid,duration,escalationduration,pointsconsidered,alarm,recommendations,measure,priority,multiplicationfactor)
}
/*
for(;i<req.body.data.length; i++){
  ruleid = req.body.data[i].ruleid
  equipmentid = req.body.data[i].equipmentid
  associatedequipmentid = req.body.data[i].associatedequipmentid
  analysisid = req.body.data[i].analysisid
  duration = req.body.data[i].duration
  escalationduration = req.body.data[i].escalationduration
  pointsconsidered = req.body.data[i].pointsconsidered
  alarm = req.body.data[i].alarm
  recommendations = req.body.data[i].recommendations
  measure = req.body.data[i].measure
  priority =  req.body.data[i].priority
  multiplicationfactor = req.body.data[i].multiplicationfactor
  
  callingUpdaterule(ruleid,equipmentid,associatedequipmentid,analysisid,duration,escalationduration,pointsconsidered,alarm,recommendations,measure,priority,multiplicationfactor)
}

*/

return res.status(200).json('done')
  ruleid = req.body.ruleid
  equipmentid = req.body.equipmentid
  associatedequipmentid = req.body.associatedequipmentid
  analysisid = req.body.analysisid
  duration = req.body.duration
  escalationduration = req.body.escalationduration
  pointsconsidered = req.body.pointsconsidered
  alarm = req.body.alarm
  recommendations = req.body.recommendations
  measure = req.body.measure
  priority =  req.body.priority
  multiplicationfactor = req.body.multiplicationfactor
/*


  //sql = "INSERT INTO ECCAnalytics.Alarm (datapointrecordid,ruleid,deviceid,analysisname,analyticsummary,measuretype,alarmstatus,buildingname,alarmontimestamp,escalationstage,ruleno) VALUES ("+datapointrecordid+",'"+ruleid+"','"+deviceid+"','"+analysisname+"','"+analyticsummary+"','"+measuretype+"',"+alarmstatus+",'"+buildingname+"',CURRENT_TIMESTAMP,'"+escalationstage+"','"+ruleno+"');"
  //query = "INSERT INTO [ECCDB].[ECCAnalytics].[Alarm] ([datapointrecordid],[ruleid],[deviceid],[analysisname],[analyticsummary],[measuretype],[alarmstatus],[buildingname],[alarmontimestamp],[escalationstage],[ruleno]) VALUES ("+datapointrecordid+",'"+ruleid+"','"+deviceid+"','"+analysisname+"','"+analyticsummary+"','"+measuretype+"',"+alarmstatus+",'"+building+"',CURRENT_TIMESTAMP,'"+escalationstage+"','"+ruleno+"');"
  //query = "INSERT INTO ["+dbName+"].[ECCAnalytics].Rules (analysisname,equipmentname,ruleno,measuretype,analysissummary,possiblecauses,recommendations,duration,escalationtime) VALUES ('"+analysisname+"','"+equipmentname+"','"+ruleno+"','"+measuretype+"','"+analysissummary+"','"+possiblecauses+"','"+recommendations+"',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);"

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
      for(;i<req.body.data.length; i++){
       // chkquery = "SELECT  [ruleid] FROM ["+dbName+"].[ECCAnalytics].[Rules] where ruleid ='"+ruleid+"';"
        chkquery = "SELECT  [ruleid] FROM ["+dbName+"].[ECCAnalytics].[Rules] where ruleid ='"+req.body.data[i].ruleid+"';"

  
      request.query(chkquery,function(err,records){
          if(err)
          console.log(err);
          else{
                        if(records['recordsets'][0].length ==0){
                                  //return res.status(200).json('User exists')

                                  //query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].Rules ([ruleid],[equipmentid],[associatedequipmentid],[analysisid],[duration],[escalationduration],[pointsconsidered],[alarm],[recommendations],[measure],[priority],[multiplicationfactor]) VALUES ('"+ruleid+"','"+equipmentid+"','"+associatedequipmentid+"','"+analysisid+"','"+duration+"','"+escalationduration+"','"+pointsconsidered+"','"+alarm+"','"+recommendations+"','"+measure+"','"+priority+"','"+multiplicationfactor+"')"
                                  query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].Rules ([ruleid],[equipmentid],[associatedequipmentid],[analysisid],[duration],[escalationduration],[pointsconsidered],[alarm],[recommendations],[measure],[priority],[multiplicationfactor]) VALUES ('"+req.body.data[i].ruleid+"','"+req.body.data[i].equipmentid+"','"+req.body.data[i].associatedequipmentid+"','"+req.body.data[i].analysisid+"','"+req.body.data[i].duration+"','"+req.body.data[i].escalationduration+"','"+req.body.data[i].pointsconsidered+"','"+req.body.data[i].alarm+"','"+req.body.data[i].recommendations+"','"+req.body.data[i].measure+"','"+req.body.data[i].priority+"','"+req.body.data[i].multiplicationfactor+"')"
                                  request.query(query2,function(err,records){
                                    if(err)
                                    console.log(query2);
                                    else{
                                      console.log(query2);

                                  //return res.status(200).json('added')
                                    }
                                  }
                                  )
                        }
                        else   {
                                    query2 = "update ["+dbName+"].ECCAnalytics.Rules set  [equipmentid]='"+req.body.data[i].equipmentid+"',[associatedequipmentid]='"+req.body.data[i].associatedequipmentid+"',[analysisid]='"+req.body.data[i].analysisid+"',[duration]='"+req.body.data[i].duration+"',[escalationduration]='"+req.body.data[i].escalationduration+"',[pointsconsidered]='"+req.body.data[i].pointsconsidered+"',[alarm]='"+req.body.data[i].alarm+"',[recommendations]='"+req.body.data[i].recommendations+"',[measure]='"+req.body.data[i].measure+"',[priority]='"+req.body.data[i].priority+"',[multiplicationfactor]='"+req.body.data[i].multiplicationfactor+"' where [ruleid]='"+req.body.data[i].ruleid+"'"
                                    request.query(query2,function(err,records){
                                      if(err)
                                      console.log(err);
                                      else{
                                        console.log(query2);

                                    //return res.status(200).json('updated')
                                      }
                                    }
                                    )
                             }
              
                              
                  }
                  
  
              })
            }
            return res.status(200).json('completed')

  })

  */

}




const getinputdatapointvalue = (req,res)=>{
  console.log(req.originalUrl);

 // var num = "100";
  if(typeof req.query.num !== 'undefined')
  num = req.query.num;


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
      //query = "SELECT TOP "+num + " datapointid,deviceid,datapoint,datapointvalue,dated FROM ["+dbName+"].[ECCAnalytics].DataPointValue ORDER BY dated DESC;"
      // IN the new table datapoint column has been removed so following query is being used.
      //query = "SELECT TOP "+num + " datapointid,deviceid,datapointvalue,dated FROM ["+dbName+"].[ECCAnalytics].DataPointValue ORDER BY dated DESC;"
      query = "SELECT TOP (SELECT count(*) FROM ["+dbName+"].[ECCAnalytics].DataPoint WHERE DATEDIFF(HOUR, dated, GETDATE()) > 24) datapointrecordid,datapointid,deviceid,pointid,datapointvalue,dated FROM ["+dbName+"].[ECCAnalytics].DataPointValue ORDER BY dated DESC;"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{

          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}




const getalarmdata = (req,res)=>{
  var rl = req.query.rl
  //var dv = req.query.dv
  var eqpname = req.query.eqpname // updated on 27.8.24 as per sumaya


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();

      //query = "SELECT TOP 1 alarmid,datapointrecordid,ruleid,deviceid,analysisname,analyticsummary,measuretype,costavoided,energysaved,alarmstatus,alarmontimestamp,alarmofftimestamp,escalationstage FROM ["+dbName+"].[ECCAnalytics].Alarm where ruleid = '"+ rl +"' and deviceid = '"+ dv +"' ORDER BY alarmontimestamp DESC;"
      query = "SELECT TOP 1 alarmid,datapointrecordid,ruleid,deviceid,analysisname,analyticsummary,measuretype,costavoided,energysaved,alarmstatus,alarmontimestamp,alarmofftimestamp,escalationstage FROM ["+dbName+"].[ECCAnalytics].Alarm where ruleid = '"+ rl +"' and equipmentname = '"+ eqpname +"' ORDER BY alarmontimestamp DESC;"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{

          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}



const getescalation = (req,res)=>{
  console.log(req.originalUrl);

  var id = req.query.id


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
      //cursor.execute("SELECT * FROM ECCAnalytics.Alarm where alarmid = "+ id +"")

     query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].Alarm where alarmid = "+ id +";"
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'alarmid': row[0],'datapointrecordid': row[1],'ruleid': row[2],'deviceid': row[3],'analysisname': row[4],'analyticsummary': row[5],'measuretype': row[6],'costavoided': row[7],'energysaved': row[8],'alarmstatus': row[9],'alarmontimestamp': row[10],'alarmofftimestamp': row[11],'escalationstage': row[12] })

            var data = [];
            for (var i = 0; i < records['recordsets'][0].length; i++) { 
              data.push({alarmid: records['recordsets'][0][i]['alarmid'],datapointrecordid: records['recordsets'][0][i]['datapointrecordid'],ruleid: records['recordsets'][0][i]['ruleid'],deviceid: records['recordsets'][0][i]['deviceid'], analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],measuretype: records['recordsets'][0][i]['measuretype'],costavoided: records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'], alarmstatus: records['recordsets'][0][i]['alarmstatus'], alarmontimestamp: records['recordsets'][0][i]['alarmontimestamp'], alarmofftimestamp: records['recordsets'][0][i]['alarmofftimestamp'], escalationstage: records['recordsets'][0][i]['escalationstage']});             //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
            }
  
            return res.status(200).json(data)
        }
  
      }
  
  )
  })
}


const updateescalationstage = (req,res)=>{
  console.log(req.originalUrl);

  escalationstage = req.body.escalationstage

  var rl = req.query.rl
  var dv = req.query.dv

  //sql = "INSERT INTO ECCAnalytics.Alarm (datapointrecordid,ruleid,deviceid,analysisname,analyticsummary,measuretype,alarmstatus,buildingname,alarmontimestamp,escalationstage,ruleno) VALUES ("+datapointrecordid+",'"+ruleid+"','"+deviceid+"','"+analysisname+"','"+analyticsummary+"','"+measuretype+"',"+alarmstatus+",'"+buildingname+"',CURRENT_TIMESTAMP,'"+escalationstage+"','"+ruleno+"');"
  //query = "INSERT INTO [ECCDB].[ECCAnalytics].[Alarm] ([datapointrecordid],[ruleid],[deviceid],[analysisname],[analyticsummary],[measuretype],[alarmstatus],[buildingname],[alarmontimestamp],[escalationstage],[ruleno]) VALUES ("+datapointrecordid+",'"+ruleid+"','"+deviceid+"','"+analysisname+"','"+analyticsummary+"','"+measuretype+"',"+alarmstatus+",'"+building+"',CURRENT_TIMESTAMP,'"+escalationstage+"','"+ruleno+"');"
  query = "UPDATE ["+dbName+"].[ECCAnalytics].Alarm  set escalationstage = '"+escalationstage+"' where ruleid = '"+rl+"' and deviceid = '"+dv+"'"


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



const subequipmentname = (req,res)=>{
  console.log(req.originalUrl);


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
      //cursor.execute("SELECT * FROM ECCAnalytics.Alarm where alarmid = "+ id +"")

     query = "SELECT [recordid]     ,[projname]     ,[projdesc]     ,[countryname]     ,[countrydesc]     ,[cityname]     ,[citydesc]     ,[campusname]     ,[campusdesc]     ,[buildingname]     ,[buildingdesc]     ,[equipmentname]     ,[equipmenttype]     ,[subequipmentname]     ,[subequipmentdesc]     ,[users] FROM ["+dbName+"].[ECCAnalytics].Project ;"
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'alarmid': row[0],'datapointrecordid': row[1],'ruleid': row[2],'deviceid': row[3],'analysisname': row[4],'analyticsummary': row[5],'measuretype': row[6],'costavoided': row[7],'energysaved': row[8],'alarmstatus': row[9],'alarmontimestamp': row[10],'alarmofftimestamp': row[11],'escalationstage': row[12] })

            var data = [];
            for (var i = 0; i < records['recordsets'][0].length; i++) { 
              data.push({alarmid: records['recordsets'][0][i]['alarmid'],datapointrecordid: records['recordsets'][0][i]['datapointrecordid'],ruleid: records['recordsets'][0][i]['ruleid'],deviceid: records['recordsets'][0][i]['deviceid'], analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],measuretype: records['recordsets'][0][i]['measuretype'],costavoided: records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'], alarmstatus: records['recordsets'][0][i]['alarmstatus'], alarmontimestamp: records['recordsets'][0][i]['alarmontimestamp'], alarmofftimestamp: records['recordsets'][0][i]['alarmofftimestamp'], escalationstage: records['recordsets'][0][i]['escalationstage']});             //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
            }
  
            return res.status(200).json( records['recordsets'][0])
        }
  
      }
  
  )
  })
}




const getbuildingname = (req,res)=>{
  console.log(req.originalUrl);

  datapointid = req.query.dpid

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
      //cursor.execute("SELECT * FROM ECCAnalytics.Alarm where alarmid = "+ id +"")

     query = "SELECT [buildingname],[equipmentname] FROM ["+dbName+"].[ECCAnalytics].[Project] where Project.equipmentname in(";
     query+= " select [Devices].equipmentname from ["+dbName+"].[ECCAnalytics].[Devices] where[Devices].recordid in(";
     query+= " select [DataPoint].devicerecordid from ["+dbName+"].[ECCAnalytics].[DataPoint] where [DataPoint].datapointid= "+datapointid+"))";
     
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'alarmid': row[0],'datapointrecordid': row[1],'ruleid': row[2],'deviceid': row[3],'analysisname': row[4],'analyticsummary': row[5],'measuretype': row[6],'costavoided': row[7],'energysaved': row[8],'alarmstatus': row[9],'alarmontimestamp': row[10],'alarmofftimestamp': row[11],'escalationstage': row[12] })

            var data = [];
            for (var i = 0; i < records['recordsets'][0].length; i++) { 
              data.push({alarmid: records['recordsets'][0][i]['alarmid'],datapointrecordid: records['recordsets'][0][i]['datapointrecordid'],ruleid: records['recordsets'][0][i]['ruleid'],deviceid: records['recordsets'][0][i]['deviceid'], analysisname: records['recordsets'][0][i]['analysisname'],analyticsummary: records['recordsets'][0][i]['analyticsummary'],measuretype: records['recordsets'][0][i]['measuretype'],costavoided: records['recordsets'][0][i]['costavoided'],energysaved: records['recordsets'][0][i]['energysaved'], alarmstatus: records['recordsets'][0][i]['alarmstatus'], alarmontimestamp: records['recordsets'][0][i]['alarmontimestamp'], alarmofftimestamp: records['recordsets'][0][i]['alarmofftimestamp'], escalationstage: records['recordsets'][0][i]['escalationstage']});             //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
            }
  
            return res.status(200).json( records['recordsets'][0])
        }
  
      }
  
  )
  })
}




const updatetimerrecord = async (req,res)=>{
  console.log(req.originalUrl);

  equipment = req.body.equipment
  workflowname = req.body.workflowname
 // ruleid = req.body.ruleid // changed on 27.4.24 as per sumaya
  timer = req.body.timer


 // maxsql = "SELECT count(*) as total FROM ["+dbName+"].[ECCAnalytics].[Ruletimer] where equipment = '"+equipment+"' and workflowname = '"+workflowname+"' and ruleid = "+ruleid+";"
  maxsql = "SELECT count(*) as total FROM ["+dbName+"].[ECCAnalytics].[Ruletimer] where equipment = '"+equipment+"' and workflowname = '"+workflowname+"';"


  sql.connect(config,function(err){
      if(err)
        console.log(maxsql)
  
      var request = new sql.Request();
  
      request.query(maxsql,function(err,records){
          if(err)
          console.log(err);
          else{
           // return 0;
            if(records['recordsets'][0][0].total > 0){
              console.log(records['recordsets'][0][0].total);

             // query = "UPDATE ["+dbName+"].[ECCAnalytics].[Ruletimer] set timer = "+timer+"  where equipment = '"+equipment+"' and workflowname = '"+workflowname+"' and ruleid = "+ruleid+";"
              query = "UPDATE ["+dbName+"].[ECCAnalytics].[Ruletimer] set timer = "+timer+"  where equipment = '"+equipment+"' and workflowname = '"+workflowname+"';"

              request.query(query,function(err,records){
                if(err)
                console.log(err);
                else{
                    return res.status(200).json({'status': 'success'})
                        
                     }
            
        
            })

            }
            else{
              return res.status(200).json({'status': 'No Data Found'})
            }
                  
               }
      
  
      })//*

  })


}



 const createtimerrecord = async (req,res)=>{
  console.log(req.originalUrl);

  equipment = req.body.equipment
  workflowname = req.body.workflowname
  //ruleid = req.body.ruleid
  timer = req.body.timer


  //maxsql = "SELECT count(*) as total FROM ["+dbName+"].[ECCAnalytics].[Ruletimer] where equipment = '"+equipment+"' and workflowname = '"+workflowname+"' and ruleid = "+ruleid+";"
 // maxsql = "SELECT count(*) as total FROM ["+dbName+"].[ECCAnalytics].[Ruletimer] where equipment = '"+equipment+"' and workflowname = '"+workflowname+"' and ruleid = '"+ruleid+"';"
  maxsql = "SELECT count(*) as total FROM ["+dbName+"].[ECCAnalytics].[Ruletimer] where equipment = '"+equipment+"' and workflowname = '"+workflowname+"';"


  sql.connect(config,function(err){
      if(err)console.log(maxsql)
  
      var request = new sql.Request();
  
      request.query(maxsql,function(err,records){
          if(err)
          console.log(err);
          else{
           // return 0;
            if(records['recordsets'][0][0].total == 0){

              //query = "UPDATE ["+dbName+"].[ECCAnalytics].[Ruletimer] set timer = "+timer+"  where equipment = '"+equipment+"' and workflowname = '"+workflowname+"' and ruleid = "+ruleid+";"
              //query = "INSERT INTO ["+dbName+"].[ECCAnalytics].[Ruletimer] (equipment,workflowname,ruleid) VALUES ('"+equipment+"','"+workflowname+"','"+ruleid+"')"
              query = "INSERT INTO ["+dbName+"].[ECCAnalytics].[Ruletimer] (equipment,workflowname) VALUES ('"+equipment+"','"+workflowname+"')"

              request.query(query,function(err,records){
                if(err)
                console.log(query);
                else{
                    return res.status(200).json({'status': 0})
                        
                     }
            
        
            })

            }
            else{ /************ */
              //console.log(records['recordsets'][0]['total']);

              //query = "UPDATE ["+dbName+"].[ECCAnalytics].[Ruletimer] set timer = "+timer+"  where equipment = '"+equipment+"' and workflowname = '"+workflowname+"' and ruleid = "+ruleid+";"
              //query = "INSERT INTO ECCAnalytics.Ruletimer (equipment,workflowname,ruleid) VALUES ('"+equipment+"','"+workflowname+"',"+ruleid+")"
              //query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].[Ruletimer] where equipment = '"+equipment+"' and workflowname = '"+workflowname+"' and ruleid = '"+ruleid+"';"
              query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].[Ruletimer] where equipment = '"+equipment+"' and workflowname = '"+workflowname+"';"

              request.query(query,function(err,records){
                if(err)
                console.log(err);
                else{
                  console.log(records['recordsets'][0][0])
                    return res.status(200).json( records['recordsets'][0][0])
                        
                     }
            
        
            })

            }
                  
               }
      
  
      })//*

  })


}





const getprojectfieldsforrules = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     var query = "SELECT recordid,buildingname,equipmentname,equipmentid,associatedequipid  FROM  ["+dbName+"].[ECCAnalytics].[Project]"
         
  
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
          return res.status(200).json(records['recordsets'][0])
         // return res.status(200).json(data)
      }
  
      }
  
  )
  })
}





const adduser = (req,res)=>{
  //ruleid = req.body.ruleid

  username = req.body.username
  roles = req.body.roles
  useremailid = req.body.useremailid
  pswd = req.body.pswd
  userloc = req.body.userloc
  usercampus = req.body.usercampus


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
     dbName = config.databse
    query = "SELECT * FROM ["+dbName+"].ECCAnalytics.Users where username ='"+username+ "'"
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
             //res.send(records['recordsets'][0]);
             //  your out put as records  
         // return res.status(200).json(records['recordsets'][0])
         if(records['recordsets'][0].length !=0)
         return res.status(200).json('User exists')
         else   {
              query2 = "INSERT INTO ["+dbName+"].ECCAnalytics.Users (username, roles,useremailid,pswd,userloc,usercampus) VALUES ('"+username+"','"+roles+"','"+useremailid+"','"+pswd+"','"+userloc+"','"+usercampus+"')"
              request.query(query2,function(err,records){
                if(err)
                console.log(err);
                else{

              return res.status(200).json('success')
                }
              }
              )
       }
        }
  
      }
  
  )
  })
}



const getpointdescription = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse
  pointids = req.query.pointids

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     var query = "SELECT [pointid],[pointdesc] FROM  ["+dbName+"].[ECCAnalytics].[PointType] where [pointid] in("+pointids+")"
         
  
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}



const getruletimerrecord = async (req,res)=>{
  console.log(req.originalUrl);
  dbName = config.databse

 // equipment = req.body.equipment
 // workflowname = req.body.workflowname
 // timer = req.body.timer



//  sql.connect(config,function(err){
  try {

    await sql.connect(config)
      //if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].[Ruletimer];"

     records = await request.query(query)
       return res.status(200).json( records['recordsets'][0])
     sql.close()

} catch(err) {
  console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

}

}



const updateallruletimerrecord = async (req,res)=>{

  console.log(req.originalUrl);
  dbName = config.databse

  newRecordList = req.body.recordlist

  try {

    await sql.connect(config)
  
      var request = new sql.Request();
  
     query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].[Ruletimer];"

     records = await request.query(query)
      
       sqlQuery =""
       for(firstcount = 0; firstcount < newRecordList.length; firstcount++){

        sqlQuery += " IF EXISTS (SELECT 1 FROM ["+dbName+"].[ECCAnalytics].[Ruletimer] " 
        sqlQuery += " WHERE workflowname = '"+newRecordList[firstcount].workflowname+"' and projectrecordid = '"+newRecordList[firstcount].projectrecordid+"')"
        sqlQuery +=" BEGIN "
        
        sqlQuery += " UPDATE ["+dbName+"].[ECCAnalytics].[Ruletimer] "
        sqlQuery += "  SET timer = '"+newRecordList[firstcount].timer+"', equipment =  '"+newRecordList[firstcount].equipment+"' "       
        sqlQuery +=" WHERE workflowname = '"+newRecordList[firstcount].workflowname+"' and projectrecordid = '"+newRecordList[firstcount].projectrecordid+"'; "
        sqlQuery += " END "
        sqlQuery += " ELSE "
        sqlQuery +=" BEGIN "
          
        sqlQuery +=" INSERT INTO ["+dbName+"].[ECCAnalytics].[Ruletimer] (equipment, workflowname, timer,projectrecordid) "
        sqlQuery += " VALUES ('"+newRecordList[firstcount].equipment+"', '"+newRecordList[firstcount].workflowname+"', '"+newRecordList[firstcount].timer+"','"+newRecordList[firstcount].projectrecordid+"'); "
        sqlQuery += " END; "
        
      }
      console.log(sqlQuery)
      await request.query(sqlQuery)
      return res.status(200).json('success')

     sql.close()

} catch(err) {
  console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

}

}

/********************************************************************************************************************* */
module.exports = {

    projview,
    updatetask,
    addalarmdata,
    email,
    datapoints,
    totaldatapoints,
    postdatapointvalue,
    addrules,
    getinputdatapointvalue,
    getalarmdata,
    getescalation,
    updateescalationstage,
    subequipmentname,
    updatetimerrecord,
    createtimerrecord,
    getbuildingname,
    getprojectfieldsforrules,
    getpointdescription,
    getruletimerrecord,
    updateallruletimerrecord

    
}