const express = require('express');
const sql = require('mssql/msnodesqlv8');
const request = require('request');


var config = require('../model/model-db');
//const {checkdeviceidpointidpair} = require('../util/function');

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



const login = (req,res)=>{
  //ruleid = req.body.ruleid
  console.log(req.originalUrl)

  username = req.body.uid
  password = req.body.pass

  sql.connect(config,function(err){
      if(err)console.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
     dbName = config.databse
     login_query = "SELECT * FROM ["+dbName+"].ECCAnalytics.Users where username COLLATE SQL_Latin1_General_CP1_CS_AS ='"+username+ "' and pswd COLLATE SQL_Latin1_General_CP1_CS_AS ='"+password+"'"
     request.query(login_query,function(err,records){

                      if(err)
                      console.log(err);
                      else{
                                  if(records['recordsets'][0].length !=0){

                                   // if(records['recordsets'][0][0].loginstatus == 1 && records['recordsets'][0][0].roles !='MasterAdmin'){
                                      if(records['recordsets'][0][0].configloginstatus == 1 && records['recordsets'][0][0].roles !='MasterAdmin'){
                                        data = {'status':'Already loggedin'}
                                      return res.status(200).json(data)
                                    }else{
                                          data = {'userid': records['recordsets'][0][0].userid,'mailid': records['recordsets'][0][0].useremailid, 'roles': records['recordsets'][0][0].roles, 'loginstatus': records['recordsets'][0][0].loginstatus, 'accexpire': records['recordsets'][0][0].accexpire}
                                          console.log(records['recordsets'][0][0].username)
                                          //------------------------
                                            let updateQuery = "update ["+dbName+"].ECCAnalytics.Users set [configloginstatus] = 1 where  username ='"+username+ "';"
                                            updateQuery += "insert into ["+dbName+"].ECCAnalytics.UserLog ([username],[userrole],[logintime],app) values ('"+username+"','"+records['recordsets'][0][0].roles+"', CURRENT_TIMESTAMP,1);"
                                            request.query(updateQuery,function(err,records){
                                                      if(err)
                                                      console.log(err);
                                                      else{
                                                        //return res.status(200).json({'status': 'success'})
                                                        return res.status(200).json(data)
                                                      }
                                    
                                              })
                                              
                                            }          
                                          //----------------------
                                          // return res.status(200).json(data)
                                  }
                                  else{   
                                    data = {'status':'No Data Found'}
                                    return res.status(200).json(data)
                                  }  
                  }
  
      }
  
  )
  })
}


const logout = (req,res)=>{
  dbName = config.databse
  username = req.query.uid
  console.log(req.originalUrl)

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [userid],[username],[roles],[useremailid],[pswd],[loginstatus] FROM ["+dbName+"].[ECCAnalytics].Users"
    // query = "update ["+dbName+"].ECCAnalytics.Users set [loginstatus] = 0 where  username ='"+username+ "';"
     query = "update ["+dbName+"].ECCAnalytics.Users set [configloginstatus] = 0 where  username  COLLATE SQL_Latin1_General_CP1_CS_AS ='"+username+ "';"
     query += "update  ["+dbName+"].ECCAnalytics.UserLog set [logouttime] = CURRENT_TIMESTAMP where  username  COLLATE SQL_Latin1_General_CP1_CS_AS ='"+username+"' and [app] = 1 and logouttime IS NULL;"

      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
            console.log(query);
          return res.status(200).json({"status":"success"})
      }
  
      }
  
  )
  })
}


const closealarm = (req,res)=>{
  alarmid = req.body.alarmid
  ruleno = req.body.ruleno
  ruleid = req.body.ruleid
  console.log(req.originalUrl)

  closealarm_query = "update  Alarm set [Alarm].[alarmstatus] = 0, [Alarm].[alarmofftimestamp] = CURRENT_TIMESTAMP from [ECCDB].[ECCAnalytics].[Alarm] Alarm where [Alarm].[alarmid] = "+alarmid+"; "
  closealarm_query2 = " update  Ruletimer set [Ruletimer].[timer] = 0 from [ECCDB].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '"+ruleno+"' and [Ruletimer].[ruleid] = "+ruleid+";"

  closealarm_query = closealarm_query + closealarm_query2


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(closealarm_query,function(err,records){
          if(err)
          console.log(closealarm_query);
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
  dbName = config.databse
  console.log(req.originalUrl)


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
     //projview_query = "SELECT [recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[equipmentid],[associatedequipid],[associatedequipdesc],[users]  FROM ["+dbName+"].[ECCAnalytics].[Project]"
     projview_query = "SELECT [Project].[recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[Project].[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[equipmentid],[associatedequipid],[associatedequipdesc],[users],[CampusScale].[campusscale]  FROM ["+dbName+"].[ECCAnalytics].[Project] left join ["+dbName+"].[ECCAnalytics].[CampusScale] on [Project].[campusname] = [CampusScale].[campusname]"
      request.query(projview_query,function(err,records){
          if(err)
          console.log(err);
          else{
            console.log(projview_query);
            //res.send(records['recordsets'][0]);
             //  your out put as records  
         // return res.status(200).json(records['recordsets'][0])
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmentid: records['recordsets'][0][i]['equipmentid'],associatedequipid: records['recordsets'][0][i]['associatedequipid'],associatedequipdesc: records['recordsets'][0][i]['associatedequipdesc'],campuscale:records['recordsets'][0][i]['campusscale']});
           //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
          }

          return res.status(200).json(data)
      }
  
      }
  
  )
  })
}




const deleteproject = (req,res)=>{
  console.log(req.originalUrl)

  deleteproject_query = ""
  if (typeof req.query.cn !== 'undefined') {
    dbName = config.databse
    //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [countryname] = '"+req.query.cn+"'";
    
    query1 = "delete  FROM ["+dbName+"].[ECCAnalytics].[DataPoint] where devicerecordid in "
    //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
    query1 += " (select recordid from ["+dbName+"].[ECCAnalytics].devices where [equipmentname] in "
    query1 += " (select equipmentname  from  ["+dbName+"].[ECCAnalytics].[Project] where [countryname] = '"+req.query.cn+"')); "
    //return res.status(200).json(query)
    query2 = " delete from ["+dbName+"].[ECCAnalytics].devices where [equipmentname] in "
    query2 += " (select equipmentname  from  ["+dbName+"].[ECCAnalytics].[Project] where [countryname] = '"+req.query.cn+"'); "

    query3 = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [countryname] = '"+req.query.cn+"'";
    
    deleteproject_query =query1 + query2 + query3;

  }

  if (typeof req.query.ct !== 'undefined') {
    dbName = config.databse
    //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [cityname] = '"+req.query.ct+"'";
    //return res.status(200).json(query)

    query1 = "delete  FROM ["+dbName+"].[ECCAnalytics].[DataPoint] where devicerecordid in "
    //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
    query1 += " (select recordid from ["+dbName+"].[ECCAnalytics].devices where [equipmentname] in "
    query1 += " (select equipmentname  from  ["+dbName+"].[ECCAnalytics].[Project] where [cityname] = '"+req.query.ct+"')); "
    //return res.status(200).json(query)
    query2 = " delete from ["+dbName+"].[ECCAnalytics].devices where [equipmentname] in "
    query2 += " (select equipmentname  from  ["+dbName+"].[ECCAnalytics].[Project] where [cityname] = '"+req.query.ct+"'); "

    query3 = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [cityname] = '"+req.query.ct+"'";
    
    deleteproject_query =query1 + query2 + query3;



  }

  if (typeof req.query.cm !== 'undefined') {
    dbName = config.databse
    //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [campusname] = '"+req.query.cm+"'";
    //return res.status(200).json(query)

    query1 = "delete  FROM ["+dbName+"].[ECCAnalytics].[DataPoint] where devicerecordid in "
    //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
    query1 += " (select recordid from ["+dbName+"].[ECCAnalytics].devices where [equipmentname] in "
    query1 += " (select equipmentname  from  ["+dbName+"].[ECCAnalytics].[Project] where [campusname] = '"+req.query.cm+"')); "
    //return res.status(200).json(query)
    query2 = " delete from ["+dbName+"].[ECCAnalytics].devices where [equipmentname] in "
    query2 += " (select equipmentname  from  ["+dbName+"].[ECCAnalytics].[Project] where [campusname] = '"+req.query.cm+"'); "

    query3 = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [campusname] = '"+req.query.cm+"'";
    
    deleteproject_query =query1 + query2 + query3;


  }

  if (typeof req.query.bl !== 'undefined') {
    dbName = config.databse
    //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [buildingname] = '"+req.query.bl+"'";
    //return res.status(200).json(query)

    query1 = "delete  FROM ["+dbName+"].[ECCAnalytics].[DataPoint] where devicerecordid in "
    //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
    query1 += " (select recordid from ["+dbName+"].[ECCAnalytics].devices where [equipmentname] in "
    query1 += " (select equipmentname  from  ["+dbName+"].[ECCAnalytics].[Project] where [buildingname] = '"+req.query.bl+"')); "
    //return res.status(200).json(query)
    query2 = " delete from ["+dbName+"].[ECCAnalytics].devices where [equipmentname] in "
    query2 += " (select equipmentname  from  ["+dbName+"].[ECCAnalytics].[Project] where [buildingname] = '"+req.query.bl+"'); "

    query3 = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [buildingname] = '"+req.query.bl+"'";
    
    deleteproject_query =query1 + query2 + query3;


  }


  if (typeof req.query.eq !== 'undefined') {
    dbName = config.databse
    //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [equipmentname] = '"+req.query.eq+"'";
    //return res.status(200).json(query)

    query1 = "delete  FROM ["+dbName+"].[ECCAnalytics].[DataPoint] where devicerecordid in "
    //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
    query1 += " (select recordid from ["+dbName+"].[ECCAnalytics].devices where [equipmentname] in "
    query1 += " (select equipmentname  from  ["+dbName+"].[ECCAnalytics].[Project] where [equipmentname] = '"+req.query.eq+"')); "
    //return res.status(200).json(query)
    query2 = " delete from ["+dbName+"].[ECCAnalytics].devices where [equipmentname] in "
    query2 += " (select equipmentname  from  ["+dbName+"].[ECCAnalytics].[Project] where [equipmentname] = '"+req.query.eq+"'); "

    query3 = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [equipmentname] = '"+req.query.eq+"'";
    
    deleteproject_query =query1 + query2 + query3;


  }


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(deleteproject_query,function(err,records){
          if(err){
          console.log(query);
          return res.status(200).json('failed')

          }else{
                  
            console.log('success');
            return res.status(200).json('success')

          }
      
  
      })
  })


}




const postprojectview = (req,res)=>{
  console.log(req.originalUrl)

  dbName = config.databse
  projname = req.body.projname
  projdesc = req.body.projdesc
  countryname = req.body.countryname
  countrydesc = req.body.countrydesc
  cityname = req.body.cityname
  citydesc = req.body.citydesc
  campusname = req.body.campusname
  campusscale = req.body.campusscale
  campusdesc = req.body.campusdesc
  buildingname = req.body.buildingname
  buildingdesc = req.body.buildingdesc
  equipmentname = req.body.equipmentname
  equipmentid = req.body.equipmentid
  associatedequipid = req.body.associatedequipid
  associatedequipdesc = req.body.associatedequipdesc
  users = req.body.users


 


  //query = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmenttype,subequipmentname,subequipmentdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmenttype+"','"+subequipmentname+"','"+subequipmentdesc+"',"+users+");"

    //return res.status(200).json(query)
    //query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].[Task] ([taskid],[alarmid],[taskname],[taskpriority],[taskassigneddate],[buildingname],[subequipmenttype],[taskstatus],[escalationstage]) VALUES ('"+taskid.toString()+"',"+req.body.alarmid.toString()+",'"+req.body.taskname.toString()+"','Low', CURRENT_TIMESTAMP,'"+req.body.buildingname.toString()+"','"+req.body.equipmentname.toString()+"','1','Stage1');"



  sql.connect(config,function(err){
                        if(err)conole.log(err)

                        var request = new sql.Request();
                        
                       // query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].[CampusScale] where [campusname] ='"+campusname+ "' and campusscale = '"+campusscale+"'"

                        //query = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmentid+"','"+associatedequipid+"','"+associatedequipdesc+"',"+users+");"
                        chkEquipmentQuery = " SELECT [equipmentname] FROM ["+dbName+"].[ECCAnalytics].[Project] where [equipmentname] ='"+equipmentname+ "'"
                        request.query(chkEquipmentQuery,function(err,chkEquipmentRecords){
                          if(err)
                          console.log(query);
                          else{
                            //console.log(query);
                            if(chkEquipmentRecords['recordsets'][0].length !=0)
                            //console.log('success');
                            return res.status(200).json('equipment exists')
                            else{

                              query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].[CampusScale] where [campusname] ='"+campusname+ "'"

//**********************************************check equipment********************* */
                        request.query(query,function(err,records){
                            if(err)
                            console.log(query);
                            else{
                                      console.log(query);
                            
                                      //console.log('success');
                                      if(records['recordsets'][0].length !=0){
                                        //query = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmentid+"','"+associatedequipid+"','"+associatedequipdesc+"',"+users+");"
                                        query1 = "update ["+dbName+"].[ECCAnalytics].[CampusScale] set [campusscale] =  '"+campusscale+"' where [campusname] = '"+campusname+"';"  
                                        
                                        query2 = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmentid+"','"+associatedequipid+"','"+associatedequipdesc+"',"+users+");"
                                        query = query1+query2;
                                        //query = query2;

                                                  request.query(query,function(err,records){
                                                      if(err)
                                                      console.log(query);
                                                      else{
                                                        console.log(query);
                                              
                                                        //console.log('success');
                                                        return res.status(200).json('success')
                          
                                                      }
                                                  
                                              
                                                  })
                                      }else{
                                        query1 = "INSERT INTO ["+dbName+"].[ECCAnalytics].[CampusScale] ([campusname] ,[campusscale]) values ('"+campusname+"','"+campusscale+"');"  
                                        //query1 = "update ["+dbName+"].[ECCAnalytics].[CampusScale] set [campusscale] =  '"+campusscale+"';"  
                                        query2 = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmentid+"','"+associatedequipid+"','"+associatedequipdesc+"',"+users+");"
                                                  query = query1+query2;
                                                  request.query(query,function(err,records){
                                                      if(err)
                                                      console.log(query);
                                                      else{
                                                        console.log(query);
                                              
                                                        //console.log('success');
                                                        return res.status(200).json('success')
                          
                                            }
                                        
                                    
                                        })
                                      }
                                     // return res.status(200).json('success')

                            }
                        
                    
                        })
//********************************** CHECK EQUIPMENT NAME******************* */    
                  }
              }
          })


  })


}





const deleteuser = async (req,res)=>{
  console.log(req.originalUrl)
  dbName = config.databse
  //modifier = req.query.modifier
  query = ""
  //if (typeof req.query.id !== 'undefined') {
   // dbName = config.databse

    //getUsernameQuery = "SELECT [username] FROM ["+dbName+"].ECCAnalytics.Users where [userid] = "+req.query.id+";";

    deletequery = " delete  FROM ["+dbName+"].[ECCAnalytics].[Users] where [userid] = "+req.query.id+";";

    //return res.status(200).json(query)

  //}



  //sql.connect(config,function(err){
    try{
    await sql.connect(config)
    var request = new sql.Request();

      //if(err)conole.log(err)
      //userData = await request.query(getUsernameQuery)
      //username = userData['recordsets'][0][0].username
      //deletequery += " INSERT INTO ["+dbName+"].ECCAnalytics.UserAudit (modifier,userid,event,dated) VALUES ('"+modifier+"','"+username+"','delete',CURRENT_TIMESTAMP); "

      //var request = new sql.Request();
  
      request.query(deletequery,function(err,records){
          if(err){
          console.log(deletequery);
          return res.status(200).json('failed')

          }else{
            console.log(deletequery);
            console.log('success');
            return res.status(200).json('success')

          }
      
  
      })
  //})
    }catch(err){
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
  
    }


}




const updateuser = async (req,res)=>{
  console.log(req.originalUrl)

  dbName = config.databse
  //modifier = req.body.modifier
    userid = req.query.userid
  if (typeof req.body.roles !== 'undefined') {
    dbName = config.databse
    username = req.body.username

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"'where username = '"+username+"'";
    updateuser_query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"'where userid = '"+userid+"'";

  }


  if (typeof req.body.pswd !== 'undefined') {
    pswd = req.body.pswd

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
    updateuser_query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where userid = '"+userid+"'";

  }

  if (typeof req.body.accexpire !== 'undefined') {
    accexpire = req.body.accexpire

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
    updateuser_query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [accexpire] = '"+req.body.accexpire+"' where userid = '"+userid+"'";

  }

  

  if (typeof req.body.pswd !== 'undefined' && typeof req.body.roles !== 'undefined') {
    pswd = req.body.pswd

   updateuser_query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"', [roles] = '"+req.body.roles+"' where userid = '"+userid+"'";

  }


  if (typeof req.body.pswd !== 'undefined' && req.body.accexpire !== 'undefined') {
    pswd = req.body.pswd

   updateuser_query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"', [accexpire] = '"+req.body.accexpire+"' where userid = '"+userid+"'";

  }



  if (typeof req.body.roles !== 'undefined' && req.body.accexpire !== 'undefined') {
    roles = req.body.roles

   updateuser_query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"', [accexpire] = '"+req.body.accexpire+"' where userid = '"+userid+"'";

  }


  if (typeof req.body.pswd !== 'undefined' && typeof req.body.roles !== 'undefined' && req.body.accexpire !== 'undefined') {
    pswd = req.body.pswd

   updateuser_query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"', [roles] = '"+req.body.roles+"', [accexpire] = '"+req.body.accexpire+"' where userid = '"+userid+"'";

  }


  //sql.connect(config,function(err){
   await sql.connect(config)
      //if(err)conole.log(err)
  
      var updateuser_request = new sql.Request();
  
      updateuser_request.query(updateuser_query,function(err,records){
          if(err){
          console.log(updateuser_query);
         // return res.status(200).json('failed')

          }else{
                  
            console.log(updateuser_query);
            return res.status(200).json('success')

          }
      
  
      })

      /*
      try{
        getUsernameQuery = "SELECT [username] FROM ["+dbName+"].ECCAnalytics.Users where [userid] = "+userid+";";
        userData = await updateuser_request.query(getUsernameQuery)
      }catch (err){
        console.log(err)
        return res.status(200).json('Could not update audit trail')

      }  
      try{
        username = userData['recordsets'][0][0].username
        updateAudituserTblQuery = " INSERT INTO ["+dbName+"].ECCAnalytics.UserAudit (modifier,userid,event,dated) VALUES ('"+modifier+"','"+username+"','update',CURRENT_TIMESTAMP); "
        await  updateuser_request.query(updateAudituserTblQuery)
            return res.status(200).json('success')

      } catch (err){
        console.log(err)
        return res.status(200).json('Could not update audit trail')

      }  
*/
  //})


}





const getbuilding = (req,res)=>{
  console.log(req.originalUrl)

  cm = req.query.cm
  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var getbuilding_request = new sql.Request();
  
  
      getbuilding_query = "SELECT [recordid],[buildingname] as building FROM ["+dbName+"].[ECCAnalytics].[Buildings] where campusname = '"+cm+"'"
      getbuilding_request.query(getbuilding_query,function(err,records){
          if(err)
          console.log(err);
          else{
/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}




const getcampus = (req,res)=>{
  console.log(req.originalUrl)

  ct = req.query.ct
  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var getcampus_request = new sql.Request();
  
  
      getcampus_query = "SELECT [recordid],[campusname] as campus FROM ["+dbName+"].[ECCAnalytics].[Campuses] where cityname = '"+ct+"'"
      getcampus_request.query(getcampus_query,function(err,records){
          if(err)
          console.log(err);
          else{
/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}


const getcity = (req,res)=>{
  console.log(req.originalUrl)

  cn = req.query.cn
  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var getcity_request = new sql.Request();
  
  
      getcity_query = "SELECT [recordid],[cityname] FROM ["+dbName+"].[ECCAnalytics].[Cities] where countryname = '"+cn+"'"
      getcity_request.query(getcity_query,function(err,records){
          if(err)
          console.log(err);
          else{
/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}



const getcountry = (req,res)=>{
  console.log(req.originalUrl)

  cn = req.query.cn
  dbName = config.databse
console.log(req.originalUrl)
  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}


const getdevices = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     query = "SELECT [equipmentname],[deviceid],[ip],[port],[network],[manufacturer],[modelname] FROM ["+dbName+"].[ECCAnalytics].Devices"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })

/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}


const getusers = (req,res)=>{
  console.log(req.originalUrl);
  dbName = config.databse

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     //query = "SELECT [userid],[username],[roles],[useremailid],[pswd],[loginstatus] ,[accexpire] FROM ["+dbName+"].[ECCAnalytics].Users"
     query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].Users"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })

/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}



const adduser = (req,res)=>{
  //ruleid = req.body.ruleid
  console.log(req.originalUrl);

  username = req.body.username
  roles = req.body.roles
  useremailid = req.body.useremailid
  pswd = req.body.pswd
  accexpire = req.body.accexpire
  //modifier = req.body.modifier
  //userloc = req.body.userloc
  //usercampus = req.body.usercampus


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
     dbName = config.databse
    query = "SELECT * FROM ["+dbName+"].ECCAnalytics.Users where username COLLATE SQL_Latin1_General_CP1_CS_AS ='"+username+"'"
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
          //query2 = "INSERT INTO ["+dbName+"].ECCAnalytics.Users (username, roles,useremailid,pswd,userloc,usercampus) VALUES ('"+username+"','"+roles+"','"+useremailid+"','"+pswd+"','"+userloc+"','"+usercampus+"')"
          query2 = "INSERT INTO ["+dbName+"].ECCAnalytics.Users (username, roles,useremailid,pswd,configloginstatus,analyticloginstatus,accexpire) VALUES ('"+username+"','"+roles+"','"+useremailid+"','"+pswd+"','0','0','"+accexpire+"');"
          //query2 += " INSERT INTO ["+dbName+"].ECCAnalytics.UserAudit (modifier,userid,event,dated) VALUES ('"+modifier+"','"+username+"','add',CURRENT_TIMESTAMP); "
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



const subequipmentdatapoint = (req, res) => {
  console.log(req.originalUrl);
  dbName = config.databse

  eqptid = req.query.eqptid
  assoeqptid = req.query.aeid


  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var request = new sql.Request();


    query = "select [T1].[pointid], [T1].[pointdesc],[T2].[associatedequipid], [T3].[associatedequiptype] from [" + dbName + "].[ECCAnalytics].[PointType] T1 left join [" + dbName + "].ECCAnalytics.AssociatedEquipments_DataPoints T2 on [T1].[pointid] =  [T2].[pointid] left join [" + dbName + "].[ECCAnalytics].[AssociatedEquipments]  T3 on [T2].[associatedequipid] = [T3].[associatedequipid] where [T2].equipmentid ='" + eqptid + "' and [T2].associatedequipid  in(" + assoeqptid + ")"

    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })

        /*
                  var data = [];
                  for (var i = 0; i < records['recordsets'][0].length; i++) { 
                   data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
                  }
        */
        console.log(query);

        return res.status(200).json(records['recordsets'][0])
      }

    }

    )
  })
}



const subequipmentlist_OLD = (req,res)=>{
  dbName = config.databse

  eqp = req.query.eqp
  


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     query = "SELECT [subequiprecordid] as recordid  ,[subequipmenttype] FROM ["+dbName+"].ECCAnalytics.SubEquipments where equipmenttype ='"+eqp+"'"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })

/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/
          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}




const subequipmentlist = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse

  eqpid = req.query.eqpid
  


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     query = "SELECT [assoequiprecordid],[associatedequipid],[associatedequiptype] FROM ["+dbName+"].ECCAnalytics.AssociatedEquipments where equipmentid ='"+eqpid+"'"
      request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
           // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })

/*
          var data = [];
          for (var i = 0; i < records['recordsets'][0].length; i++) { 
           data.push({recordid: records['recordsets'][0][i]['recordid'],projname: records['recordsets'][0][i]['projname'],projdesc: records['recordsets'][0][i]['projdesc'],countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'],cityname: records['recordsets'][0][i]['cityname'],citydesc: records['recordsets'][0][i]['citydesc'],campusname: records['recordsets'][0][i]['campusname'],campusdesc: records['recordsets'][0][i]['campusdesc'],buildingname: records['recordsets'][0][i]['buildingname'],buildingdesc: records['recordsets'][0][i]['buildingdesc'],equipmentname: records['recordsets'][0][i]['equipmentname'],equipmenttype: records['recordsets'][0][i]['equipmenttype'],subequipmentname: records['recordsets'][0][i]['subequipmentdesc'],subequipmentdesc: records['recordsets'][0][i]['subequipmentdesc']});
          }
*/          console.log(query);

          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}

/********************************************************************** */

const postdatapoint_NOT_IN_USE = (req,res)=>{
  dbName = config.databse

  //deviceid = req.body.deviceid
  datapoint = req.body.datapoint
  actualpoint = req.body.actualpoint
  multiply = req.body.multiply
  addition = req.body.addition
  objtype = req.body.objtype
  objinstance = req.body.objinstance
  devicerecordid = req.body.devicerecordid
  devices = req.body.devices
  deviceid = devices[0]['deviceid']

  const devicearr = []
  const deviceids = []
  var query = ""
  chkquery = "select [deviceid] from  ["+dbName+"].ECCAnalytics.Devices where equipmentname ='"+req.body.equipmentname+"' and deviceid in("

  for ( jLength=0; jLength<req.body.devices.length; jLength++ ){
    if(req.body.devices.length - jLength!= 1)
    chkquery += "'"+req.body.devices[jLength].deviceid+"',"
  else
  chkquery += "'"+req.body.devices[jLength].deviceid+"'"

  }
   
  chkquery += ")"
  //console.log(chkquery)

  sql.connect(config,function(err){
    if(err)console.log('Erro is coming')
    //else console.log('conected')
     var request = new sql.Request();
//console.log(request)

   request.query(chkquery,function(err,records){
    if(err){console.log(err)}
    else{
         // console.log(query)

       // console.log(records['recordsets'][0]);
        for(ar=0; ar<records['recordsets'][0].length; ar++){
          devicearr.push(records['recordsets'][0][ar].deviceid)
        }
       // return 0
        query = "insert into ["+dbName+"].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values "
        f = 0
        totalDeviceAdded = 0
        for ( i=0; i<devices.length;i++ ){
          console.log(devices[i]['equipmentname'])
          if(!devicearr.includes(devices[i]['deviceid'])){
         // if(i ==devices.length -1 ){
          if(f == 1){
          query+=","
          f=1
          }
           // query+="('"+req.body.equipmentname+"', '"+devices[i]['deviceid']+"', '"+devices[i]['ip']+"', '"+devices[i]['port']+"', '"+devices[i]['network']+"', '"+devices[i]['manufacturer']+"', '"+devices[i]['modelname']+"');"
       
          //}else{
         query+="('"+req.body.equipmentname+"', '"+devices[i]['deviceid']+"', '"+devices[i]['ip']+"', '"+devices[i]['port']+"', '"+devices[i]['network']+"', '"+devices[i]['manufacturer']+"', '"+devices[i]['modelname']+"')"
         f=1
         totalDeviceAdded++
         deviceids.push(devices[i]['deviceid'])
          //}
        }          
        }
        query+=";"
        //res.status(200).json(records['recordsets'][0])
        //console.log(query)

      }


      request.query(query,function(err,records){
        if(err)
        console.log(err);
        else{
          //-----------------------
          dvctblidarray = []
          query2 = "select TOP ("+totalDeviceAdded+") recordid,deviceid FROM ["+dbName+"].[ECCAnalytics].[Devices] order by recordid DESC;"
          request.query(query2,function(err,records){
            if(err)
            console.log(query2);
            else{
              console.log(query2);

           data = {'status':'success'}
           for(dvctblid=0; dvctblid<records['recordsets'][0].length; dvctblid++){
            dvctblidarray.push(records['recordsets'][0][dvctblid].recordid)
          }
  
           //return res.status(200).json(records['recordsets'][0])
           dvctblidarray.reverse()
           console.log(dvctblidarray)
            query3 = "INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "

           // for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
            comma = 0
            for ( dp=0; dp<req.body.devices.length;dp++ ){
                             if(deviceids.includes(req.body.devices[dp].deviceid)){
                            console.log('match')
                            for ( dtapnt=0; dtapnt<req.body.devices[dp].datapoint.length;dtapnt++ ){
                             // console.log(dtapnt)
                              console.log(dp+","+req.body.devices.length)
    
                         // if(dtapnt ==req.body.devices[dp].datapoint.length -1 && dp ==req.body.devices.length-1 ){
                          //records['recordsets'][0][j]
                        //query3 += "('"+deviceids[j]+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+");"
                        //query3 += "('"+req.body.devices[dp].deviceid+"','"+req.body.devices[dp].datapoint[dtapnt].pointid+"','"+req.body.devices[dp].datapoint[dtapnt].actualpoint+"','"+req.body.devices[dp].datapoint[dtapnt].multiply+"','"+req.body.devices[dp].datapoint[dtapnt].addition+"', CURRENT_TIMESTAMP, '"+req.body.devices[dp].datapoint[dtapnt].objtype+"', '"+req.body.devices[dp].datapoint[dtapnt].objinstance+"', "+dvctblidarray[dp]+");"
                        //}else{
                          //query3 += "('"+deviceids[dp]+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+"),"
                          if(comma == 1){
                            query3+=","
                            comma=1
                            }
                          query3 += "('"+req.body.devices[dp].deviceid+"','"+req.body.devices[dp].datapoint[dtapnt].pointid+"','"+req.body.devices[dp].datapoint[dtapnt].actualpoint+"','"+req.body.devices[dp].datapoint[dtapnt].multiply+"','"+req.body.devices[dp].datapoint[dtapnt].addition+"', CURRENT_TIMESTAMP, '"+req.body.devices[dp].datapoint[dtapnt].objtype+"', '"+req.body.devices[dp].datapoint[dtapnt].objinstance+"', "+dvctblidarray[dp]+",'"+req.body.devices[dp].datapoint[dtapnt].isenergyvalue+"')"
                          
                            comma = 1
                  
                          console.log(comma)

                       // }
                      //}
                    }   
                  }
             }
             query3+=";"
             console.log(query3);
             //return res.status(200).json(query3)               
             //return query3;
//-----------------------------------------------------------  
             request.query(query3,function(err,records){
              if(err){
              console.log(query3);
              return res.status(200).json('failed')
    
              }else{
                      
                console.log('success');
                return res.status(200).json('success')
    
              }
          
      
          })
//------------------------------------------------------     


           // return res.status(200).json(query3)
        }
    
        })
          //---------------------
      // data = {'status':'success'}
       // return res.status(200).json(query2)
    }

    })







/*EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE*/
    })
})  

}

/******************************************** */



const postdatapoint_24_05_2024 = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse

  //deviceid = req.body.deviceid
  datapoint = req.body.datapoint
  actualpoint = req.body.actualpoint
  multiply = req.body.multiply
  addition = req.body.addition
  objtype = req.body.objtype
  objinstance = req.body.objinstance
  devicerecordid = req.body.devicerecordid
  devices = req.body.devices
  deviceid = devices[0]['deviceid']

 
  query = "insert into ["+dbName+"].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values "

  for ( i=0; i<devices.length;i++ ){
    if(i ==devices.length -1 ){
      query+="('"+ req.body.equipmentname+"', '"+devices[i]['deviceid']+"', '"+devices[i]['ip']+"', '"+devices[i]['port']+"', '"+devices[i]['network']+"', '"+devices[i]['manufacturer']+"', '"+devices[i]['modelname']+"');"
 
    }else{
   query+="('"+req.body.equipmentname+"', '"+devices[i]['deviceid']+"', '"+devices[i]['ip']+"', '"+devices[i]['port']+"', '"+devices[i]['network']+"', '"+devices[i]['manufacturer']+"', '"+devices[i]['modelname']+"'),"
    }
  }          

  sql.connect(config,function(err){
      if(err)
        console.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
      chkquery = "SELECT * FROM ["+dbName+"].ECCAnalytics.Devices where equipmentname ='"+req.body.equipmentname+ "' and deviceid = '"+deviceid+"'"
      request.query(chkquery,function(err,records){
        if(err)
        console.log(err);
        else{
             if(records['recordsets'][0].length ==0){ // if no devices in the device table with the given device id then add new
              console.log('If case')

     request.query(query,function(err,records){ // if no devices in the device table with the given device id then add a device here
          if(err)
          console.log(query);
          else{
            //-----------------------
            //console.log(query);

            query2 = "select TOP ("+devices.length+") recordid FROM ["+dbName+"].[ECCAnalytics].[Devices] where deviceid = '"+deviceid+"' order by recordid DESC;"
            request.query(query2,function(err,records){
              if(err)
              console.log(query2);
              else{
             //data = {'status':'success'}

             /*
              query3 = "INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "

              for ( j=0; j<records['recordsets'][0].length;j++ ){
                for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
                  if(dp ==devices[j]['datapoint'].length -1 ){
                  //records['recordsets'][0][j]
                  //console.log(query3)
                query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
                }else{
                  query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"'),"
                  //console.log(query3)
  
                }
              }
               }
              */

               //query3 = "INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
               query3 = ""
               for ( j=0; j<records['recordsets'][0].length;j++ ){
                        for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
                                    //if(dp ==devices[j]['datapoint'].length -1 ){
                                      if(devices[j]['datapoint'][dp]['datapointid'] == null ){
                                                  //records['recordsets'][0][j]
                                              //console.log(query3)
                                                query3 += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                                                query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
                                      }else{
                                              //query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"'),"
                                              //console.log(query3)
                                              query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+deviceid+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+records['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[j]['datapoint'][dp]['datapointid']+"; "
                    
                                      }
                      }
                }
 
               request.query(query3,function(err,records){
                if(err){
                console.log(query3);
                return res.status(200).json('failed')
      
                }else{
                        
                  console.log('success');
                  return res.status(200).json('success')
      
                }
            
        
            })
          }
      
          })

          //&&&&&&
      }
  
      })


    }else{
      console.log('Else case')
     // chkquery = "SELECT * FROM ["+dbName+"].ECCAnalytics.Devices where equipmentname ='"+req.body.equipmentname+ "' and deviceid = '"+deviceid+"'"

     // request.query(chkquery,function(err,records){
       // if(err)
        //console.log(chkquery);
        //else{
       //data = {'status':'success'}
       /*
        query3 = "INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
        //for ( j=0; j<records['recordsets'][0].length;j++ ){
          j=0;
          for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
            if(dp ==devices[j]['datapoint'].length -1 ){
            //records['recordsets'][0][j]
            //console.log(query3)
          query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
          }else{
            query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"'),"
            //console.log(query3)

          }
        }
        */
        query3 = ""
        //for ( j=0; j<records['recordsets'][0].length;j++ ){
          j=0;
          for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
                  if(devices[j]['datapoint'][dp]['datapointid'] == null ){
                        query3 += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                        query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
                  }else{
                        query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+deviceid+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+records['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[j]['datapoint'][dp]['datapointid']+"; "

                }
        }


        // }
         request.query(query3,function(err,records){
          if(err){
          console.log(query3);
          return res.status(200).json('failed')

          }else{
            console.log(query3);
  
            console.log('success');
            return res.status(200).json('success')

          }
      
  
      })

    }

  }
    })
  })
}



const postdatapoint__from_OLD_FILE = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse

  //deviceid = req.body.deviceid
  datapoint = req.body.datapoint
  actualpoint = req.body.actualpoint
  multiply = req.body.multiply
  addition = req.body.addition
  objtype = req.body.objtype
  objinstance = req.body.objinstance
  devicerecordid = req.body.devicerecordid
  devices = req.body.devices
  deviceid = devices[0]['deviceid']

 
  query = "insert into ["+dbName+"].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values "

  for ( i=0; i<devices.length;i++ ){
    console.log(devices[i]['equipmentname'])
    if(i ==devices.length -1 ){
      query+="('"+ req.body.equipmentname+"', '"+devices[i]['deviceid']+"', '"+devices[i]['ip']+"', '"+devices[i]['port']+"', '"+devices[i]['network']+"', '"+devices[i]['manufacturer']+"', '"+devices[i]['modelname']+"');"
 
    }else{
   query+="('"+req.body.equipmentname+"', '"+devices[i]['deviceid']+"', '"+devices[i]['ip']+"', '"+devices[i]['port']+"', '"+devices[i]['network']+"', '"+devices[i]['manufacturer']+"', '"+devices[i]['modelname']+"'),"
    }
  }          

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
      chkquery = "SELECT * FROM ["+dbName+"].ECCAnalytics.Devices where equipmentname ='"+req.body.equipmentname+ "' and deviceid = '"+deviceid+"'"
      request.query(chkquery,function(err,records){
        if(err)
        console.log(err);
        else{
             if(records['recordsets'][0].length ==0){
 
     request.query(query,function(err,records){
          if(err)
          console.log(query);
          else{
            //-----------------------
            console.log(query);

            query2 = "select TOP ("+devices.length+") recordid FROM ["+dbName+"].[ECCAnalytics].[Devices] where deviceid = '"+deviceid+"' order by recordid DESC;"
            request.query(query2,function(err,records){
              if(err)
              console.log(query2);
              else{
             data = {'status':'success'}
              query3 = "INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "

              for ( j=0; j<records['recordsets'][0].length;j++ ){
                for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
                  if(dp ==devices[j]['datapoint'].length -1 ){
                  //records['recordsets'][0][j]
                  //console.log(query3)
                query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
                }else{
                  query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"'),"
                  //console.log(query3)
  
                }
              }
               }
               request.query(query3,function(err,records){
                if(err){
                console.log(query3);
                return res.status(200).json('failed')
      
                }else{
                        
                  console.log('success');
                  return res.status(200).json('success')
      
                }
            
        
            })
          }
      
          })

          //&&&&&&
      }
  
      })


    }else{
      chkquery = "SELECT * FROM ["+dbName+"].ECCAnalytics.Devices where equipmentname ='"+req.body.equipmentname+ "' and deviceid = '"+deviceid+"'"

      request.query(chkquery,function(err,records){
        if(err)
        console.log(chkquery);
        else{
       data = {'status':'success'}
        query3 = "INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "

        for ( j=0; j<records['recordsets'][0].length;j++ ){
          for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
            if(dp ==devices[j]['datapoint'].length -1 ){
            //records['recordsets'][0][j]
            //console.log(query3)
          query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
          }else{
            query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"'),"
            //console.log(query3)

          }
        }
         }
         request.query(query3,function(err,records){
          if(err){
          console.log(query3);
          return res.status(200).json('failed')

          }else{
                  
            console.log('success');
            return res.status(200).json('success')

          }
      
  
      })
    }

    })


     // return res.status(200).json({status:'point added'})

    }

  }
    })
  })
}



const postdatapoint_7_6_2024 = (req,res)=>{
  console.log(req.originalUrl);

  function findValueIndex(array, value) {
    const index = array.indexOf(value);
    return index !== -1 ? index : null;
  }

  dbName = config.databse

  //deviceid = req.body.deviceid
  datapoint = req.body.datapoint
  actualpoint = req.body.actualpoint
  multiply = req.body.multiply
  addition = req.body.addition
  objtype = req.body.objtype
  objinstance = req.body.objinstance
  devicerecordid = req.body.devicerecordid
  devices = req.body.devices
  deviceid = devices[0]['deviceid']


//Checking if device id and equipment are present in the db or not
  chkquery = "SELECT *  FROM ("
    for ( i=0; i<devices.length;i++ ){
      if(i ==devices.length -1 ){
        chkquery += " SELECT * FROM ["+dbName+"].ECCAnalytics.Devices where equipmentname ='"+req.body.equipmentname+ "' and deviceid = '"+devices[i]['deviceid']+"' "
      }else{
        chkquery += " SELECT * FROM ["+dbName+"].ECCAnalytics.Devices where equipmentname ='"+req.body.equipmentname+ "' and deviceid = '"+devices[i]['deviceid']+"' UNION ALL "
      }
}          

chkquery +=") AS combined_results;"

//console.log(chkquery)
//return 0;
existingDeviceId = []
newDeviceId = []
newDeviceTblRecordId = []
sql.connect(config,function(err){
  if(err)
    console.log(err)

  // make a request as

  var request = new sql.Request();

  request.query(chkquery,function(err,chkqueryrecords){
    if(err)
    console.log(err);
    else{
       // }
       //if records present in device table pushing deviceids to an array
       newDeviceAndEqpmntAdded =0
        for(total = 0; total < chkqueryrecords['recordsets'][0].length; total++ ){
          val = chkqueryrecords['recordsets'][0][total].deviceid
          existingDeviceId.push(chkqueryrecords['recordsets'][0][total].deviceid)
        }
        query = ""
        newRecordAdded = 0
        //console.log(existingDeviceId)
       // return 0;
        //Createing insert query in case  at least a single device from json string does not exist in the device table
        for ( i=0; i<devices.length;i++ ){
                if(existingDeviceId.includes(devices[i]['deviceid']) == false){
                  newRecordAdded = newRecordAdded+1;
                  query+=" insert into ["+dbName+"].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values  ('"+ req.body.equipmentname+"', '"+devices[i]['deviceid']+"', '"+devices[i]['ip']+"', '"+devices[i]['port']+"', '"+devices[i]['network']+"', '"+devices[i]['manufacturer']+"', '"+devices[i]['modelname']+"');"
                }

        }         
       // console.log(newRecordAdded)
       // return 0
        if(newRecordAdded > 0){
         // console.log("IF is running as ")

         // return 0
          request.query(query,function(err,records){ // if no devices in the device table with the given device id then add new device here
          if(err)
          console.log(err);
          else{
            // Picking up records for newly added devices from the table
            query2 = "select * from ( select TOP ("+newRecordAdded+")  recordid, deviceid FROM ["+dbName+"].[ECCAnalytics].[Devices] where equipmentname = '"+req.body.equipmentname+"' order by recordid DESC) devices_tbl order by devices_tbl.recordid;"
            query3 = ""
            request.query(query2,function(err,records){
              if(err)
              console.log(err);
              else{

                for(total = 0; total < records['recordsets'][0].length; total++ ){
                  val = records['recordsets'][0][total].deviceid
                  newDeviceId.push(records['recordsets'][0][total].deviceid)
                  newDeviceTblRecordId.push(records['recordsets'][0][total].recordid)
                }
                //console.log(newDeviceId);
                //return 0

                for ( dvc=0; dvc<devices.length;dvc++ ){
                          if(newDeviceId.includes(devices[dvc]['deviceid']) == true ){// for newly added device id
                            //console.log('1st if for newly added device id')
                            //return 0
                                  for ( dp=0; dp<devices[dvc]['datapoint'].length;dp++ ){
                                        if( devices[dvc]['datapoint'][dp]['datapointid'] == null){
                                          arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
                                          query3 += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                                          query3 += "('"+devices[dvc]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+newDeviceTblRecordId[arrayId]+", '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"');"
                                          //console.log(query3)
                                        }
                                    }
                                   // console.log(query3)

                          }else if(newDeviceId.includes(devices[dvc]['deviceid']) != true ){
                            //console.log('else if')
                           // console.log(devices[dvc]['deviceid'])
                            //console.log(devices[dvc]['datapoint'].length)
                                        for ( dp=0; dp<devices[dvc]['datapoint'].length;dp++ ){
                                         // console.log(devices[dvc]['datapoint'][dp])

                                        if( devices[dvc]['datapoint'][dp]['datapointid'] == null){
                                                 // query3 += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                                                 // query3 += "('"+devices[dvc]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+chkqueryrecords['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
                            

                                                  for ( j=0; j<chkqueryrecords['recordsets'][0].length;j++ ){
                                                    //console.log(chkqueryrecords['recordsets'][0][j])
                                                    if(chkqueryrecords['recordsets'][0][j]['deviceid'] == devices[dvc]['deviceid']){

                                                      //  for ( dp2=0; dp2<devices[dvc]['datapoint'].length;dp2++ ){

                                                                  if(devices[dvc]['datapoint'][dp]['datapointid'] == null ){
                                                                    //console.log('insert datapoint tbl value for existing deviceid in device tbl')
                                                                        query3 += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                                                                       // query3 += "('"+chkqueryrecords['recordsets'][0][j]['deviceid']+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+chkqueryrecords['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
                                                                       //query3 += "('"+chkqueryrecords['recordsets'][0][j]['deviceid']+"','"+devices[dvc]['datapoint'][dp2]['pointid']+"','"+devices[dvc]['datapoint'][dp2]['actualpoint']+"','"+devices[dvc]['datapoint'][dp2]['multiply']+"','"+devices[dvc]['datapoint'][dp2]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp2]['objtype']+"', '"+devices[dvc]['datapoint'][dp2]['objinstance']+"', "+chkqueryrecords['recordsets'][0][j]['recordid']+", '"+devices[dvc]['datapoint'][dp2]['isenergyvalue']+"');"
                                                                       query3 += "('"+chkqueryrecords['recordsets'][0][j]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+chkqueryrecords['recordsets'][0][j]['recordid']+", '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"');"
                                                                      }
                                                        //      }
                                                        }
                                            
                                                  }
                                                 // console.log(query3)
                                                  //return 0 
                                        }else{
                                         // console.log('update datapoint tbl value for existing deviceid in device tbl')

                                          for ( j=0; j<chkqueryrecords['recordsets'][0].length;j++ ){
                                            if(chkqueryrecords['recordsets'][0][j]['deviceid'] == devices[dvc]['deviceid']){

                                            //console.log(chkqueryrecords['recordsets'][0][j])
                                                    for ( dpu=0; dpu<devices[dvc]['datapoint'].length;dpu++ ){
                                                      if(devices[dvc]['datapoint'][dpu]['datapointid'] != null ){

                                                       // query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+deviceid+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+chkqueryrecords['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[j]['datapoint'][dp]['datapointid']+"; "
                                                      // query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+devices[dvc]['deviceid']+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+chkqueryrecords['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dpu]['datapointid']+"; "
                                                     // query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+devices[dvc]['deviceid']+"', pointid = '"+devices[dvc]['datapoint'][dpu]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dpu]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dpu]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dpu]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[dvc]['datapoint'][dpu]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dpu]['objinstance']+"',devicerecordid = "+chkqueryrecords['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[dvc]['datapoint'][dpu]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dpu]['datapointid']+"; "
                                                      query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+devices[dvc]['deviceid']+"', pointid = '"+devices[dvc]['datapoint'][dpu]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dpu]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dpu]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dpu]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dpu]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dpu]['objinstance']+"',devicerecordid = "+chkqueryrecords['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[dvc]['datapoint'][dpu]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dpu]['datapointid']+"; "
                                                    }
                                                       // }
                                                    }
                                                  }     
                                          }
                                          //console.log(query3)

                                             // return 0
                                        }


                                      }
                          }

                  }

                   
               // console.log(query3)
        
                 // query3 = ""
                  /*                  
                  for ( j=0; j<records['recordsets'][0].length;j++ ){
                        for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
                          // Creating SQL query for datapoint table. If datapoint id presents update else create new record
                                      if(devices[j]['datapoint'][dp]['datapointid'] == null ){
                                                query3 += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                                                query3 += "('"+records['recordsets'][0][j].deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
                                      }else{
                                              query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+deviceid+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+records['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[j]['datapoint'][dp]['datapointid']+"; "
                    
                                      }
                      }
                   }
                   

                   for ( j=0; j<records['recordsets'][0].length;j++ ){
                      for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
                      // Creating SQL query for datapoint table. If datapoint id presents update else create new record
                                  if(devices[j]['datapoint'][dp]['datapointid'] == null && existingDeviceId.includes(devices[j]['deviceid']) && devices[j]['deviceid'] == records['recordsets'][0][j].deviceid){
                                            query3 += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                                            query3 += "('"+records['recordsets'][0][j].deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
                                  }else if (devices[j]['datapoint'][dp]['datapointid'] != null){
                                          query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+deviceid+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+records['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[j]['datapoint'][dp]['datapointid']+"; "
                
                                  }
                    }
               }

               */
                           
                    //console.log(query3)
                   // return 0
               request.query(query3,function(err,records){
                if(err){
                console.log(err);
                return res.status(200).json('failed')
      
                }else{
                        
                 // console.log('success');
                  return res.status(200).json('success')
      
                }
            
        
            })
          }
      
          })

      }
  
      })

    }


    else{   //Else case for  device and equipment are already present in the device table
//console.log("else is running as device is already there")
//return 0      
query3 = ""
      for ( j=0; j<chkqueryrecords['recordsets'][0].length;j++ ){
       // console.log(chkqueryrecords['recordsets'][0][j])
                for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
                      if(devices[j]['datapoint'][dp]['datapointid'] == null ){
                            query3 += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                            query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+chkqueryrecords['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
                      }else{
                        //query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+deviceid+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+chkqueryrecords['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[j]['datapoint'][dp]['datapointid']+"; "
                        query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+deviceid+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"', objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+chkqueryrecords['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[j]['datapoint'][dp]['datapointid']+"; "

                    }
                 }

       }
       //console.log(query3)
       //return 0
       request.query(query3,function(err,records){
        if(err){
        console.log(query3);
        return res.status(200).json('failed')
        }else{
          //console.log(query3);

          //console.log('success');
          return res.status(200).json('success')

        }
    

    })


    }

return 0 
  }
      })


})
  
return 0

}

const postdatapoint = async (req,res)=>{
  console.log(req.originalUrl);

  function findValueIndex(array, value) {
    const index = array.indexOf(value);
    return index !== -1 ? index : null;
  }

  dbName = config.databse

  datapoint = req.body.datapoint
  actualpoint = req.body.actualpoint
  multiply = req.body.multiply
  addition = req.body.addition
  objtype = req.body.objtype
  objinstance = req.body.objinstance
  devicerecordid = req.body.devicerecordid

  devices = req.body.devices
  //deviceid = devices[0]['deviceid']

 
existingDeviceId = []
newDeviceId = []
newDeviceTblRecordId = []
existingDeviceRecordId =[]

try{
  await sql.connect(config)
    var request = new sql.Request();
   
    chkquery = "SELECT *  FROM ("
    for ( i=0; i<devices.length;i++ ){
      if(i ==devices.length -1 ){
        chkquery += " SELECT * FROM ["+dbName+"].ECCAnalytics.Devices where equipmentname ='"+req.body.equipmentname+ "' and deviceid = '"+devices[i]['deviceid']+"' "
      }else{
        chkquery += " SELECT * FROM ["+dbName+"].ECCAnalytics.Devices where equipmentname ='"+req.body.equipmentname+ "' and deviceid = '"+devices[i]['deviceid']+"' UNION ALL "
      }
  }      
  
  chkquery +=") AS combined_results;"

//return 0
  
    chkqueryrecords = await request.query(chkquery)
    newRecordAdded = 0
    console.log(chkqueryrecords)
    //return 0

    existingDeviceIdWithRecordId = {}
    for(total = 0; total < chkqueryrecords['recordsets'][0].length; total++ ){
          val = chkqueryrecords['recordsets'][0][total].deviceid
          existingDeviceId.push(chkqueryrecords['recordsets'][0][total].deviceid)
          existingDeviceRecordId.push(chkqueryrecords['recordsets'][0][total].recordid)
          existingDeviceIdWithRecordId[chkqueryrecords['recordsets'][0][total].deviceid] = chkqueryrecords['recordsets'][0][total].recordid;  
    }

    console.log(existingDeviceIdWithRecordId)
    //console.log(existingDeviceIdWithRecordId[2537082])
    //return 0
    insertQueryForNewDevice = ''
    for ( i=0; i<devices.length;i++ ){
      if(existingDeviceId.includes(devices[i]['deviceid']) != true){
        insertQueryForNewDevice +=" insert into ["+dbName+"].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values  ('"+ req.body.equipmentname+"', '"+devices[i]['deviceid']+"', '"+devices[i]['ip']+"', '"+devices[i]['port']+"', '"+devices[i]['network']+"', '"+devices[i]['manufacturer']+"', '"+devices[i]['modelname']+"');"
        newRecordAdded += 1
      }
}         

    console.log(insertQueryForNewDevice)

    //sql.close()
    //await sql.connect(config)

    /******************************************************************************************************** */

    if(newRecordAdded > 0){
      await request.query(insertQueryForNewDevice)
      queryToPickLastAddedRecord = "select * from ( select TOP ("+newRecordAdded+")  recordid, deviceid FROM ["+dbName+"].[ECCAnalytics].[Devices] where equipmentname = '"+req.body.equipmentname+"' order by recordid DESC) devices_tbl order by devices_tbl.recordid;"
      console.log()
      lastAddedRecord = await request.query(queryToPickLastAddedRecord)
      console.log(lastAddedRecord)
      for(total = 0; total < lastAddedRecord['recordsets'][0].length; total++ ){
        val = lastAddedRecord['recordsets'][0][total].deviceid
        newDeviceId.push(lastAddedRecord['recordsets'][0][total].deviceid)
        newDeviceTblRecordId.push(lastAddedRecord['recordsets'][0][total].recordid)
      }

   // }

    console.log(newDeviceTblRecordId)


    // Existing Device

    DPAddQueryForOldDevice = ""


    for ( dvc=0; dvc<devices.length;dvc++ ){
         if(existingDeviceId.includes(devices[dvc]['deviceid']) == true ){// for already added device id
                 for ( dp=0; dp<devices[dvc]['datapoint'].length;dp++ ){
                       if( devices[dvc]['datapoint'][dp]['datapointid'] == null){
                         //arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
                         DPAddQueryForOldDevice += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                         DPAddQueryForOldDevice += "('"+devices[dvc]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+existingDeviceIdWithRecordId[devices[dvc]['deviceid']]+", '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"');"
   
                       }
                   }
                   //console.log(query3)
   
         }
   }
   
    console.log(DPAddQueryForOldDevice)
    await request.query(DPAddQueryForOldDevice)


//return 0
       // Newly added Device


    DPAddQueryForNewlyAddedDevice = ""

for ( dvc=0; dvc<devices.length;dvc++ ){
      if(newDeviceId.includes(devices[dvc]['deviceid']) == true ){// for newly added device id
              for ( dp=0; dp<devices[dvc]['datapoint'].length;dp++ ){
                    if( devices[dvc]['datapoint'][dp]['datapointid'] == null){
                      arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
                      DPAddQueryForNewlyAddedDevice += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                      DPAddQueryForNewlyAddedDevice += "('"+devices[dvc]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+newDeviceTblRecordId[arrayId]+", '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"');"

                    }
                }
                //console.log(query3)

      }
}

 await request.query(DPAddQueryForNewlyAddedDevice)


 //For newly added device and update datapoint with existing datapoint

 DPupdateQueryForNewlyAddedDevice = ""

 for ( dvc=0; dvc<devices.length;dvc++ ){
  if(newDeviceId.includes(devices[dvc]['deviceid']) == true ){// for newly added device id
          for ( dp=0; dp<devices[dvc]['datapoint'].length;dp++ ){
                if( devices[dvc]['datapoint'][dp]['datapointid'] != null){
                  arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
                  //DPAddQueryForNewlyAddedDevice += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                  //DPAddQueryForNewlyAddedDevice += "('"+devices[dvc]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+newDeviceTblRecordId[arrayId]+", '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"');"
                  DPupdateQueryForNewlyAddedDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET  deviceid = '"+devices[dvc]['deviceid']+"', pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',devicerecordid = "+newDeviceTblRecordId[arrayId]+" ,isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "

                }
            }
            //console.log(query3)
  }
}

 

await request.query(DPupdateQueryForNewlyAddedDevice)


// Update existing

 DPupdateQueryForOldDevice = ""
 for ( dvc=0; dvc<devices.length;dvc++ ){
  if(existingDeviceId.includes(devices[dvc]['deviceid']) == true ){// for update of already added device id
          for ( dp=0; dp<devices[dvc]['datapoint'].length;dp++ ){
                if( devices[dvc]['datapoint'][dp]['datapointid'] != null){
                  //DPupdateQueryForOldDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET  pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "
                  DPupdateQueryForOldDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+devices[dvc]['deviceid']+"',  pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',devicerecordid = "+existingDeviceIdWithRecordId[devices[dvc]['deviceid']]+",isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "


                }
            }
            //console.log(query3)

  }
}
console.log(DPupdateQueryForOldDevice)

await request.query(DPupdateQueryForOldDevice)

}else{

  DPAddQueryForOldDevice = ""


  for ( dvc=0; dvc<devices.length;dvc++ ){
       if(existingDeviceId.includes(devices[dvc]['deviceid']) == true ){// for already added device id
               for ( dp=0; dp<devices[dvc]['datapoint'].length;dp++ ){
                     if( devices[dvc]['datapoint'][dp]['datapointid'] == null){
                       //arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
                       DPAddQueryForOldDevice += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                       DPAddQueryForOldDevice += "('"+devices[dvc]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+existingDeviceIdWithRecordId[devices[dvc]['deviceid']]+", '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"');"
 
                     }
                 }
                 //console.log(query3)
 
       }
 }
 await request.query(DPAddQueryForOldDevice)


  DPupdateQueryForOldDevice = ""
 for ( dvc=0; dvc<devices.length;dvc++ ){
  if(existingDeviceId.includes(devices[dvc]['deviceid']) == true ){// for update of already added device id
          for ( dp=0; dp<devices[dvc]['datapoint'].length;dp++ ){
                if( devices[dvc]['datapoint'][dp]['datapointid'] != null){
                  //DPupdateQueryForOldDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET  pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "
                  DPupdateQueryForOldDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+devices[dvc]['deviceid']+"',  pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "

                }
            }
            //console.log(query3)

  }
}

await request.query(DPupdateQueryForOldDevice)


}
return res.status(200).json('success');


  } //end try block
  
  
  
  
  catch(err) {
    console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
  
  }
  
  

}  







const addsubequipment = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse

equipmenttype = req.body.equipmenttype
subequipmenttype = req.body.subequipmenttype
query = "INSERT INTO ["+dbName+"].ECCAnalytics.SubEquipments (equipmenttype,subequipmenttype) VALUES ('"+equipmenttype+"','"+subequipmenttype+"')"

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
 
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
         data = {'status':'success'}
          return res.status(200).json(data)
      }
  
      }
  
  )
  })
}



const addequipment = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse
 
equipmenttype = req.body.equipmenttype
query = "INSERT INTO ["+dbName+"].ECCAnalytics.Equipments_Old (equipmenttype) VALUES ('"+equipmenttype+"')"

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
 
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
         data = {'status':'success'}
          return res.status(200).json(data)
      }
  
      }
  
  )
  })
}



const equipmentlist = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse

  eqp = req.query.eqp
  


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
  
      var request = new sql.Request();
  
  
     //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
     query = "SELECT [recordid],[equipmentid],[equipmenttype] FROM ["+dbName+"].ECCAnalytics.Equipments"
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



const updateproject = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse
  recordid = req.query.recordid

  query = "update ["+dbName+"].[ECCAnalytics].[Project]  set ";
  flag = 0

  if (typeof req.body.equipmentname !== 'undefined') {
    equipmentname = req.body.equipmentname
    if(flag == 0){
    query += " [equipmentname] = '"+req.body.equipmentname+"'";
    flag = 1
    }
    else
    query += ", [equipmentname] = '"+req.body.equipmentname+"'";

    flag = 1

  }


  if (typeof req.body.equipmentid !== 'undefined') {
    equipmentid = req.body.equipmentid
    if(flag == 0){
    query += " [equipmentid] = '"+req.body.equipmentid+"'";
    flag = 1
    }
    else
    query += ", [equipmentid] = '"+req.body.equipmentid+"'";

    
  }

  if (typeof req.body.associatedequipid !== 'undefined') {
    associatedequipid = req.body.associatedequipid
    if(flag == 0){
    query += " [associatedequipid] = '"+req.body.associatedequipid+"'";
    flag = 1
    }
    else
    query += ", [associatedequipid] = '"+req.body.associatedequipid+"'";



  }


  if (typeof req.body.associatedequipdesc !== 'undefined') {
    associatedequipdesc = req.body.associatedequipdesc
    if(flag == 0){
    query += " [associatedequipdesc] = '"+req.body.associatedequipdesc+"'";
    flag = 1
    }
    else
    query += ", [associatedequipdesc] = '"+req.body.associatedequipdesc+"'";


  }


  
  if (typeof req.body.users !== 'undefined') {
    users = req.body.users
    if(flag == 0){
    query += " [users] = '"+req.body.users+"'";
    flag = 1
    }
    else
    query += ", [users] = '"+req.body.users+"'";


  }


  query += " where recordid = '"+recordid+"'";


/*
  if (typeof req.body.pswd !== 'undefined' && typeof req.body.roles !== 'undefined') {
    pswd = req.body.pswd

   query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"', [roles] = '"+req.body.roles+"' where username = '"+username+"'";

  }

  */
  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(query,function(err,records){
          if(err){
          console.log(query);
          return res.status(200).json('failed')

          }else{
                  
            console.log('success');
            console.log(query);
            return res.status(200).json('success')

          }
      
  
      })
  })


}


const getdatapointsforconfig = (req,res)=>{
  console.log(req.originalUrl);

  //ruleid = req.body.ruleid
  dbName = config.databse

  eqpname = req.query.eqpname
  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     //query = "SELECT [datapointid],[deviceid],[pointid],[actualpoint],[multiply],[addition],[dated],[objtype],[objinstance],[devicerecordid] FROM ["+dbName+"].[ECCAnalytics].DataPoint WHERE devicerecordid in (SELECT [recordid] FROM ["+dbName+"].[ECCAnalytics].[Devices] where equipmentname = '"+eqpname+"');"
     query = "SELECT DV.[equipmentname],DV.[deviceid],DV.[ip],DV.[port],DV.[network],DV.[manufacturer],DV.[modelname],[datapointid],[pointid],[actualpoint],[multiply],[addition],[dated],[objtype],[objinstance],[devicerecordid],[isenergyvalue] FROM ["+dbName+"].[ECCAnalytics].DataPoint DP "
     query +=" left join ["+dbName+"].[ECCAnalytics].[Devices] DV on [DP].[devicerecordid] = [DV].[recordid] where DV.equipmentname = '"+eqpname+"';"
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

          return res.status(200).json(records['recordsets'][0])
      }
  
      }
  
  )
  })
}




const updatedatapoint = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse
//  username = req.body.username
datapointid = req.query.datapointid
  query = ""
  if (typeof req.body.multiply !== 'undefined') {
    multiply = req.body.multiply

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"'where username = '"+username+"'";
    query = "update ["+dbName+"].[ECCAnalytics].[DataPoint]  set [multiply] = '"+req.body.multiply+"'where datapointid = '"+datapointid+"'";

  }


  if (typeof req.body.addition !== 'undefined') {

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
    query = "update ["+dbName+"].[ECCAnalytics].[DataPoint]  set [addition] = '"+req.body.addition+"' where datapointid = '"+datapointid+"'";

  }


  if (typeof req.body.multiply !== 'undefined' && typeof req.body.addition !== 'undefined') {

   query = "update ["+dbName+"].[ECCAnalytics].[DataPoint]  set [multiply] = '"+req.body.multiply+"', [addition] = '"+req.body.addition+"' where datapointid = '"+datapointid+"'";

  }

  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(query,function(err,records){
          if(err){
          console.log(query);
          return res.status(200).json('failed')

          }else{
                  
            console.log(query);
            return res.status(200).json('success')

          }
      
  
      })
  })


}



const deletedatapoint = (req,res)=>{
  console.log(req.originalUrl);

  dbName = config.databse
//  username = req.body.username
datapointid = req.query.datapointid
  query = ""
  if (typeof req.query.datapointid !== 'undefined') {

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"'where username = '"+username+"'";
    query = "delete from ["+dbName+"].[ECCAnalytics].[DataPoint]  where datapointid = '"+datapointid+"'";

  }else{
    return res.status(200).json('failed')


  }


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      var request = new sql.Request();
  
      request.query(query,function(err,records){
          if(err){
          console.log(query);
          return res.status(200).json('failed')

          }else{
                  
            console.log(query);
            return res.status(200).json('success')

          }
      
  
      })
  })


}



const updateuserpassword = (req,res)=>{
  console.log(req.originalUrl);
  //ruleid = req.body.ruleid

  username = req.body.username
  oldpass = req.body.oldpass
  newpassword = req.body.newpassword


  sql.connect(config,function(err){
      if(err)conole.log(err)
  
      // make a request as
  
      var request = new sql.Request();
  
     //make the query
  
     //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
     dbName = config.databse
    //query = "SELECT * FROM ["+dbName+"].ECCAnalytics.Users where username ='"+username+ "'"
    query = "SELECT * FROM ["+dbName+"].ECCAnalytics.Users where username ='"+username+ "' and pswd ='"+oldpass+"'"
    request.query(query,function(err,records){
      if(err)
      console.log(err);
      else{
        if(records['recordsets'][0].length == 0)
         return res.status(200).json('not found')
        else{
    query = "update ["+dbName+"].[ECCAnalytics].[Users] set pswd = '"+newpassword+ "' where  username = '"+username+ "' and pswd = '"+oldpass+ "'"
     request.query(query,function(err,records){
          if(err)
          console.log(err);
          else{
             //res.send(records['recordsets'][0]);
             //  your out put as records  
         // return res.status(200).json(records['recordsets'][0])
         console.log(records['recordsets'][0])
         return res.status(200).json('updated')
        }
  //
      })
    }
    }
    }
  
  )
  })
}




/*********************************************TEST API ********************************************************* */
const test = (req,res)=>{
    var qid = req.query.id;
    //alarmid = req.body.alarmid

    function downloadPage(eqpname,deviceid) {
      dbName = config.databse

      return new Promise((resolve, reject) => {
        query = "select count(*) as total from  ["+dbName+"].ECCAnalytics.Devices where equipmentname ='"+eqpname+"' and deviceid = '"+deviceid+"'"
        sql.connect(config,function(err){
            if(err){
              console.log('Erro is coming')
              reject(err)
            }
            else console.log('conected')
        
            // make a request as
        
            var request = new sql.Request();
        //console.log(request)
       
           request.query(query,function(err,records){
            if(err){
              console.log(err);
              reject(err)
            return query}
              else{
               // console.log(records['recordsets'][0][0].total);
    
               resolve(records['recordsets'][0][0].total)
                //return records['recordsets'][0]
               // return 1
    
              }
    
           })
        })  
    

      });
  }

  async function myBackEndLogic(eqpname,deviceid) {
    try {
        const html = await downloadPage(eqpname,deviceid)
        console.log('SHOULD WORK:');
       console.log(html);
        //return html;

        // try downloading an invalid url
       // await downloadPage('http://      .com')
    } catch (error) {
        console.error('ERROR:');
        console.error(error);
    }
}
  myBackEndLogic('A2-1F-AHU1','1010101');
 myBackEndLogic('A2-1F-AHU1','3610796');
 myBackEndLogic('A2-1F-AHU1','361079699');

//     console.log(page);

return 0 
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



/*************************************************** END OF TEST API************************************************* */




module.exports = {

    projview,
    updatetask,
    deleteproject,
    postprojectview,
    login,
    logout,
    deleteuser,
    updateuser,
    getbuilding,
    getcampus,
    getcity,
    getcountry,
    getdevices,
    getusers,
    adduser,
    subequipmentdatapoint,
    subequipmentlist,
    postdatapoint,
    addsubequipment,
    addequipment,
    equipmentlist,
    updateproject,
    getdatapointsforconfig,
    updatedatapoint,
    deletedatapoint,
    updateuserpassword,
    test
    
}