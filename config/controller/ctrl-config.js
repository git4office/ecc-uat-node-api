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



const login_6_7_2024 = (req, res) => {
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
          if (records['recordsets'][0][0].configloginstatus == 1 && records['recordsets'][0][0].roles != 'MasterAdmin') {
            data = { 'status': 'Already loggedin' }
            return res.status(200).json(data)
          } else {
            data = { 'userid': records['recordsets'][0][0].userid, 'mailid': records['recordsets'][0][0].useremailid, 'roles': records['recordsets'][0][0].roles, 'loginstatus': records['recordsets'][0][0].loginstatus, 'accexpire': records['recordsets'][0][0].accexpire }
            console.log(records['recordsets'][0][0].username)
            //------------------------
            let updateQuery = "update [" + dbName + "].ECCAnalytics.Users set [configloginstatus] = 1 where  username ='" + username + "';"
            updateQuery += "insert into [" + dbName + "].ECCAnalytics.UserLog ([username],[userrole],[logintime],app) values ('" + username + "','" + records['recordsets'][0][0].roles + "', CURRENT_TIMESTAMP,1);"
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

const login_8_8_2024 = async (req, res) => {
  //ruleid = req.body.ruleid
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  username = req.body.uid
  password = req.body.pass


  try {
    await pool.connect();
    const request = pool.request();

    var data = [];
    login_query = "SELECT * FROM [" + dbName + "].ECCAnalytics.Users where username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' and pswd COLLATE SQL_Latin1_General_CP1_CS_AS ='" + password + "'"
    records = await request.query(login_query)


    if (records['recordsets'][0].length != 0) {

      if (records['recordsets'][0][0].configloginstatus == 1 && records['recordsets'][0][0].roles != 'MasterAdmin') {
        data = { 'status': 'Already loggedin' }
        return res.status(200).json(data)
      } else {
        data = { 'userid': records['recordsets'][0][0].userid, 'mailid': records['recordsets'][0][0].useremailid, 'roles': records['recordsets'][0][0].roles, 'loginstatus': records['recordsets'][0][0].loginstatus, 'accexpire': records['recordsets'][0][0].accexpire }
        console.log(records['recordsets'][0][0].username)
        //------------------------
        let updateQuery = "update [" + dbName + "].ECCAnalytics.Users set [configloginstatus] = 1 where  username ='" + username + "';"
        updateQuery += "insert into [" + dbName + "].ECCAnalytics.UserLog ([username],[userrole],[logintime],app) values ('" + username + "','" + records['recordsets'][0][0].roles + "', CURRENT_TIMESTAMP,1);"
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

const login = async (req, res) => {
  //ruleid = req.body.ruleid
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  username = req.body.uid
  password = req.body.pass


  try {
    await pool.connect();
    const request = pool.request();

    var data = [];
    //login_query = "SELECT * FROM [" + dbName + "].ECCAnalytics.Users where username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' and pswd COLLATE SQL_Latin1_General_CP1_CS_AS ='" + password + "'"
    login_query = "SELECT * FROM [" + dbName + "].ECCAnalytics.Users where username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' and pswd COLLATE SQL_Latin1_General_CP1_CS_AS ='" + password + "' and  DATEDIFF(day,GETDATE(), accexpire) >= 0 OR username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' and pswd COLLATE SQL_Latin1_General_CP1_CS_AS ='" + password + "' and accexpire IS NULL"
    console.log(login_query)
    records = await request.query(login_query)


    if (records['recordsets'][0].length != 0) {

      if (records['recordsets'][0][0].configloginstatus == 1 && records['recordsets'][0][0].roles != 'MasterAdmin') {
        data = { 'status': 'Already loggedin' }
        return res.status(200).json(data)
      } else {
        data = { 'userid': records['recordsets'][0][0].userid, 'mailid': records['recordsets'][0][0].useremailid, 'roles': records['recordsets'][0][0].roles, 'loginstatus': records['recordsets'][0][0].loginstatus, 'accexpire': records['recordsets'][0][0].accexpire }
        console.log(records['recordsets'][0][0].username)
        //------------------------
        let updateQuery = "update [" + dbName + "].ECCAnalytics.Users set [configloginstatus] = 1 where  username ='" + username + "';"
        updateQuery += "insert into [" + dbName + "].ECCAnalytics.UserLog ([username],[userrole],[logintime],app) values ('" + username + "','" + records['recordsets'][0][0].roles + "', CURRENT_TIMESTAMP,1);"
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


const logout_6_7_2024 = (req, res) => {
  dbName = config.databse
  username = req.query.uid
  console.log(req.originalUrl)

  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var request = new sql.Request();


    //query = "SELECT [userid],[username],[roles],[useremailid],[pswd],[loginstatus] FROM ["+dbName+"].[ECCAnalytics].Users"
    // query = "update ["+dbName+"].ECCAnalytics.Users set [loginstatus] = 0 where  username ='"+username+ "';"
    query = "update [" + dbName + "].ECCAnalytics.Users set [configloginstatus] = 0 where  username  COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "';"
    query += "update  [" + dbName + "].ECCAnalytics.UserLog set [logouttime] = CURRENT_TIMESTAMP where  username  COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' and [app] = 1 and logouttime IS NULL;"

    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        console.log(query);
        return res.status(200).json({ "status": "success" })
      }

    }

    )
  })
}

const logout = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  username = req.query.uid

  try {
    await pool.connect();
    const request = pool.request();

    var data = [];
    query = "update [" + dbName + "].ECCAnalytics.Users set [configloginstatus] = 0 where  username  COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "';"
    query += "update  [" + dbName + "].ECCAnalytics.UserLog set [logouttime] = CURRENT_TIMESTAMP where  username  COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' and [app] = 1 and logouttime IS NULL and recordid = (SELECT TOP (1) [recordid] from  [" + dbName + "].[ECCAnalytics].[UserLog] where username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "' order by recordid desc);"
    //update  [ECC_DEV].[ECCAnalytics].[UserLog] set app = 1 where username = 'Test' and recordid = (SELECT TOP (1) [recordid] from  [ECC_DEV].[ECCAnalytics].[UserLog] where username = 'Test' order by recordid desc)
    await request.query(query)

    console.log(query);
    return res.status(200).json({ "status": "success" })
  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }
}



const closealarm = (req, res) => {
  alarmid = req.body.alarmid
  ruleno = req.body.ruleno
  ruleid = req.body.ruleid
  console.log(req.originalUrl)

  closealarm_query = "update  Alarm set [Alarm].[alarmstatus] = 0, [Alarm].[alarmofftimestamp] = CURRENT_TIMESTAMP from [" + dbName + "].[ECCAnalytics].[Alarm] Alarm where [Alarm].[alarmid] = " + alarmid + "; "
  closealarm_query2 = " update  Ruletimer set [Ruletimer].[timer] = 0 from [" + dbName + "].[ECCAnalytics].[Ruletimer] Ruletimer where [Ruletimer].[workflowname] = '" + ruleno + "' and [Ruletimer].[ruleid] = " + ruleid + ";"

  closealarm_query = closealarm_query + closealarm_query2


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    request.query(closealarm_query, function (err, records) {
      if (err)
        console.log(closealarm_query);
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




const projview_2_7_2024 = (req, res) => {
  //ruleid = req.body.ruleid
  dbName = config.databse
  console.log(req.originalUrl)


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
    //projview_query = "SELECT [recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[equipmentid],[associatedequipid],[associatedequipdesc],[users]  FROM ["+dbName+"].[ECCAnalytics].[Project]"
    projview_query = "SELECT [Project].[recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[Project].[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[equipmentid],[associatedequipid],[associatedequipdesc],[users],[CampusScale].[campusscale]  FROM [" + dbName + "].[ECCAnalytics].[Project] left join [" + dbName + "].[ECCAnalytics].[CampusScale] on [Project].[campusname] = [CampusScale].[campusname]"
    request.query(projview_query, function (err, records) {
      if (err)
        console.log(err);
      else {
        console.log(projview_query);
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        // return res.status(200).json(records['recordsets'][0])
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          data.push({ recordid: records['recordsets'][0][i]['recordid'], projname: records['recordsets'][0][i]['projname'], projdesc: records['recordsets'][0][i]['projdesc'], countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'], cityname: records['recordsets'][0][i]['cityname'], citydesc: records['recordsets'][0][i]['citydesc'], campusname: records['recordsets'][0][i]['campusname'], campusdesc: records['recordsets'][0][i]['campusdesc'], buildingname: records['recordsets'][0][i]['buildingname'], buildingdesc: records['recordsets'][0][i]['buildingdesc'], equipmentname: records['recordsets'][0][i]['equipmentname'], equipmentid: records['recordsets'][0][i]['equipmentid'], associatedequipid: records['recordsets'][0][i]['associatedequipid'], associatedequipdesc: records['recordsets'][0][i]['associatedequipdesc'], campuscale: records['recordsets'][0][i]['campusscale'] });
          //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
        }

        return res.status(200).json(data)
      }

    }

    )
  })
}

const projview_6_7_2024 = (req, res) => {
  //ruleid = req.body.ruleid
  dbName = config.databse
  console.log(req.originalUrl)


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
    //projview_query = "SELECT [recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[equipmentid],[associatedequipid],[associatedequipdesc],[users]  FROM ["+dbName+"].[ECCAnalytics].[Project]"
    projview_query = "SELECT [Project].[recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[Project].[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[equipmentid],[associatedequipid],[associatedequipdesc],[users],[equipmentdesc],[CampusScale].[campusscale]  FROM [" + dbName + "].[ECCAnalytics].[Project] left join [" + dbName + "].[ECCAnalytics].[CampusScale] on [Project].[campusname] = [CampusScale].[campusname]"
    request.query(projview_query, function (err, records) {
      if (err)
        console.log(err);
      else {
        console.log(projview_query);
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        // return res.status(200).json(records['recordsets'][0])
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          data.push({ recordid: records['recordsets'][0][i]['recordid'], projname: records['recordsets'][0][i]['projname'], projdesc: records['recordsets'][0][i]['projdesc'], countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'], cityname: records['recordsets'][0][i]['cityname'], citydesc: records['recordsets'][0][i]['citydesc'], campusname: records['recordsets'][0][i]['campusname'], campusdesc: records['recordsets'][0][i]['campusdesc'], buildingname: records['recordsets'][0][i]['buildingname'], buildingdesc: records['recordsets'][0][i]['buildingdesc'], equipmentname: records['recordsets'][0][i]['equipmentname'], equipmentid: records['recordsets'][0][i]['equipmentid'], associatedequipid: records['recordsets'][0][i]['associatedequipid'], associatedequipdesc: records['recordsets'][0][i]['associatedequipdesc'], equipmentdesc: records['recordsets'][0][i]['equipmentdesc'], campuscale: records['recordsets'][0][i]['campusscale'] });
          //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
        }

        return res.status(200).json(data)
      }

    }

    )
  })
}

const projview = async (req, res) => {
  //ruleid = req.body.ruleid
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  try {
    await pool.connect();
    const request = pool.request();

    var data = [];
    //projview_query = "SELECT [Project].[recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[Project].[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[equipmentid],[associatedequipid],[associatedequipdesc],[users],[equipmentdesc],[CampusScale].[campusscale]  FROM [" + dbName + "].[ECCAnalytics].[Project] left join [" + dbName + "].[ECCAnalytics].[CampusScale] on [Project].[campusname] = [CampusScale].[campusname]"
    //projview_query = "SELECT [Project].[recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[Project].[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[Project].[equipmentid],[equipmenttype],[associatedequipid],[associatedequipdesc],[users],[equipmentdesc],[CampusScale].[campusscale]  FROM [" + dbName + "].[ECCAnalytics].[Project] left join [" + dbName + "].[ECCAnalytics].[CampusScale] on [Project].[campusname] = [CampusScale].[campusname]   left join [" + dbName + "].[ECCAnalytics].[Equipments] on [Project].[equipmentid] = [Equipments].[equipmentid]"
    projview_query = "SELECT [Project].[recordid] ,[projname],[projdesc],[countryname],[countrydesc],[cityname],[citydesc],[Project].[campusname],[campusdesc],[buildingname],[buildingdesc],[equipmentname],[Project].[equipmentid],[equipmenttype],[associatedequipid],[associatedequipdesc],[users],[equipmentdesc],[CampusScale].[campusscale], [dated]  FROM [" + dbName + "].[ECCAnalytics].[Project] left join [" + dbName + "].[ECCAnalytics].[CampusScale] on [Project].[campusname] = [CampusScale].[campusname]   left join [" + dbName + "].[ECCAnalytics].[Equipments] on [Project].[equipmentid] = [Equipments].[equipmentid]"
    records = await request.query(projview_query)
    var data = [];
    for (var i = 0; i < records['recordsets'][0].length; i++) {
      data.push({ recordid: records['recordsets'][0][i]['recordid'], projname: records['recordsets'][0][i]['projname'], projdesc: records['recordsets'][0][i]['projdesc'], countryname: records['recordsets'][0][i]['countryname'], countrydesc: records['recordsets'][0][i]['countrydesc'], cityname: records['recordsets'][0][i]['cityname'], citydesc: records['recordsets'][0][i]['citydesc'], campusname: records['recordsets'][0][i]['campusname'], campusdesc: records['recordsets'][0][i]['campusdesc'], buildingname: records['recordsets'][0][i]['buildingname'], buildingdesc: records['recordsets'][0][i]['buildingdesc'], equipmentname: records['recordsets'][0][i]['equipmentname'], equipmentid: records['recordsets'][0][i]['equipmentid'], associatedequipid: records['recordsets'][0][i]['associatedequipid'], associatedequipdesc: records['recordsets'][0][i]['associatedequipdesc'], equipmentdesc: records['recordsets'][0][i]['equipmentdesc'], campuscale: records['recordsets'][0][i]['campusscale'], equipmenttype:records['recordsets'][0][i]['equipmenttype'], dated:records['recordsets'][0][i]['dated'] });
      //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
    }
    return res.status(200).json(data)


  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}



const postprojectview_2_7_2024 = (req, res) => {
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



  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    // query = "SELECT * FROM ["+dbName+"].[ECCAnalytics].[CampusScale] where [campusname] ='"+campusname+ "' and campusscale = '"+campusscale+"'"

    //query = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmentid+"','"+associatedequipid+"','"+associatedequipdesc+"',"+users+");"
    chkEquipmentQuery = " SELECT [equipmentname] FROM [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] ='" + equipmentname + "'"
    request.query(chkEquipmentQuery, function (err, chkEquipmentRecords) {
      if (err)
        console.log(query);
      else {
        //console.log(query);
        if (chkEquipmentRecords['recordsets'][0].length != 0)
          //console.log('success');
          return res.status(200).json('equipment exists')
        else {

          query = "SELECT * FROM [" + dbName + "].[ECCAnalytics].[CampusScale] where [campusname] ='" + campusname + "'"

          //**********************************************check equipment********************* */
          request.query(query, function (err, records) {
            if (err)
              console.log(query);
            else {
              console.log(query);

              //console.log('success');
              if (records['recordsets'][0].length != 0) {
                //query = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmentid+"','"+associatedequipid+"','"+associatedequipdesc+"',"+users+");"
                query1 = "update [" + dbName + "].[ECCAnalytics].[CampusScale] set [campusscale] =  '" + campusscale + "' where [campusname] = '" + campusname + "';"

                query2 = "INSERT INTO [" + dbName + "].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('" + projname + "','" + projdesc + "','" + countryname + "','" + countrydesc + "','" + cityname + "','" + citydesc + "','" + campusname + "','" + campusdesc + "','" + buildingname + "','" + buildingdesc + "','" + equipmentname + "','" + equipmentid + "','" + associatedequipid + "','" + associatedequipdesc + "'," + users + ");"
                query = query1 + query2;
                //query = query2;

                request.query(query, function (err, records) {
                  if (err)
                    console.log(query);
                  else {
                    console.log(query);

                    //console.log('success');
                    return res.status(200).json('success')

                  }


                })
              } else {
                query1 = "INSERT INTO [" + dbName + "].[ECCAnalytics].[CampusScale] ([campusname] ,[campusscale]) values ('" + campusname + "','" + campusscale + "');"
                //query1 = "update ["+dbName+"].[ECCAnalytics].[CampusScale] set [campusscale] =  '"+campusscale+"';"  
                query2 = "INSERT INTO [" + dbName + "].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('" + projname + "','" + projdesc + "','" + countryname + "','" + countrydesc + "','" + cityname + "','" + citydesc + "','" + campusname + "','" + campusdesc + "','" + buildingname + "','" + buildingdesc + "','" + equipmentname + "','" + equipmentid + "','" + associatedequipid + "','" + associatedequipdesc + "'," + users + ");"
                query = query1 + query2;
                request.query(query, function (err, records) {
                  if (err)
                    console.log(query);
                  else {
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


const postprojectview = async (req, res) => {
  console.log(req.originalUrl)
  const pool = new sql.ConnectionPool(config);

  dbName = config.databse
  modifier = req.query.modifier
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
  equipmentdesc = req.body.equipmentdesc




  //query = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmenttype,subequipmentname,subequipmentdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmenttype+"','"+subequipmentname+"','"+subequipmentdesc+"',"+users+");"

  //return res.status(200).json(query)
  //query2 = "INSERT INTO ["+dbName+"].[ECCAnalytics].[Task] ([taskid],[alarmid],[taskname],[taskpriority],[taskassigneddate],[buildingname],[subequipmenttype],[taskstatus],[escalationstage]) VALUES ('"+taskid.toString()+"',"+req.body.alarmid.toString()+",'"+req.body.taskname.toString()+"','Low', CURRENT_TIMESTAMP,'"+req.body.buildingname.toString()+"','"+req.body.equipmentname.toString()+"','1','Stage1');"

  try {
    await pool.connect();
    const request = pool.request();

    chkEquipmentQuery = " SELECT [equipmentname] FROM [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] ='" + equipmentname + "'"

    chkEquipmentRecords = await request.query(chkEquipmentQuery)

    //return res.status(200).json(chkEquipmentRecords['recordsets'][0])

    if (chkEquipmentRecords['recordsets'][0].length != 0) {
      //console.log('success');
      return res.status(200).json('equipment exists')

    } else {
      // return res.status(200).json(chkEquipmentRecords['recordsets'][0])
      // return res.status(200).json('inside else')
      CampusScalequery = "SELECT * FROM [" + dbName + "].[ECCAnalytics].[CampusScale] where [campusname] ='" + campusname + "'"
      CampusScaleRecords = await request.query(CampusScalequery)

      if (CampusScaleRecords['recordsets'][0].length != 0) {
        query1 = "update [" + dbName + "].[ECCAnalytics].[CampusScale] set [campusscale] =  '" + campusscale + "' where [campusname] = '" + campusname + "';"

        //query2 = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmentid+"','"+associatedequipid+"','"+associatedequipdesc+"',"+users+");"
        //query2 = "INSERT INTO [" + dbName + "].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users,equipmentdesc) VALUES ('" + projname + "','" + projdesc + "','" + countryname + "','" + countrydesc + "','" + cityname + "','" + citydesc + "','" + campusname + "','" + campusdesc + "','" + buildingname + "','" + buildingdesc + "','" + equipmentname + "','" + equipmentid + "','" + associatedequipid + "','" + associatedequipdesc + "'," + users + ",'" + equipmentdesc + "');"
        query2 = "INSERT INTO [" + dbName + "].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users,equipmentdesc,dated) VALUES ('" + projname + "','" + projdesc + "','" + countryname + "','" + countrydesc + "','" + cityname + "','" + citydesc + "','" + campusname + "','" + campusdesc + "','" + buildingname + "','" + buildingdesc + "','" + equipmentname + "','" + equipmentid + "','" + associatedequipid + "','" + associatedequipdesc + "'," + users + ",'" + equipmentdesc + "', CURRENT_TIMESTAMP);"
        //            updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,dated) VALUES ('" + modifier + "','" + equipmentname + "', '" + projectrecordid + "','add',CURRENT_TIMESTAMP); "
        query = query1 + query2;
        //  return res.status(200).json(query)

        await request.query(query)

        projectRecordIdQuery = " SELECT [recordid],[equipmentname] FROM [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] ='" + equipmentname + "'"
        projectRecordsData = await request.query(projectRecordIdQuery)
        newProjectRecordId = projectRecordsData['recordsets'][0][0].recordid
        // createProjectquery = query1 + query2 + updateprojectaudit_query;
        // console.log(projectRecordsData['recordsets'][0])
        //return res.status(200).json(projectRecordsData['recordsets'][0][0].recordid)
        updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,dated) VALUES ('" + modifier + "','" + equipmentname + "', '" + newProjectRecordId + "','add',CURRENT_TIMESTAMP); "
        await request.query(updateprojectaudit_query)
        return res.status(200).json('success')


      } else {
        query1 = "INSERT INTO [" + dbName + "].[ECCAnalytics].[CampusScale] ([campusname] ,[campusscale]) values ('" + campusname + "','" + campusscale + "');"
        //query1 = "update ["+dbName+"].[ECCAnalytics].[CampusScale] set [campusscale] =  '"+campusscale+"';"  
        //query2 = "INSERT INTO ["+dbName+"].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users) VALUES ('"+projname+"','"+projdesc+"','"+countryname+"','"+countrydesc+"','"+cityname+"','"+citydesc+"','"+campusname+"','"+campusdesc+"','"+buildingname+"','"+buildingdesc+"','"+equipmentname+"','"+equipmentid+"','"+associatedequipid+"','"+associatedequipdesc+"',"+users+");"
        query2 = "INSERT INTO [" + dbName + "].ECCAnalytics.Project ( projname, projdesc,countryname,countrydesc,cityname,citydesc,campusname,campusdesc,buildingname,buildingdesc,equipmentname,equipmentid,associatedequipid,associatedequipdesc,users,equipmentdesc) VALUES ('" + projname + "','" + projdesc + "','" + countryname + "','" + countrydesc + "','" + cityname + "','" + citydesc + "','" + campusname + "','" + campusdesc + "','" + buildingname + "','" + buildingdesc + "','" + equipmentname + "','" + equipmentid + "','" + associatedequipid + "','" + associatedequipdesc + "'," + users + ",'" + equipmentdesc + "');"
        //updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,dated) VALUES ('" + modifier + "','" + equipmentname + "', '" + projectrecordid + "','add',CURRENT_TIMESTAMP); "

        // query = query1 + query2 + updateprojectaudit_query;
        query = query1 + query2;
        //  query = query1 + query2;
        await request.query(query)

        projectRecordIdQuery = " SELECT [recordid],[equipmentname] FROM [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] ='" + equipmentname + "'"
        projectRecordsData = await request.query(projectRecordIdQuery)
        newProjectRecordId = projectRecordsData['recordsets'][0][0].recordid
        // createProjectquery = query1 + query2 + updateprojectaudit_query;

        updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,dated) VALUES ('" + modifier + "','" + equipmentname + "', '" + newProjectRecordId + "','add',CURRENT_TIMESTAMP); "
        await request.query(updateprojectaudit_query)
        return res.status(200).json('success')


      }
    }


  } catch (err) {
    console.error(err);
    //console.error(updateprojectaudit_query);

    return res.status(500).json('failed');

  } finally {

    pool.close();


  }

}

const deleteproject_6_7_2024 = (req, res) => {
  console.log(req.originalUrl)

  deleteproject_query = ""
  if (typeof req.query.cn !== 'undefined') {
    dbName = config.databse
    //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [countryname] = '"+req.query.cn+"'";

    query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
    //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
    query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
    query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [countryname] = '" + req.query.cn + "')); "
    //return res.status(200).json(query)
    query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
    query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [countryname] = '" + req.query.cn + "'); "

    query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [countryname] = '" + req.query.cn + "'";

    deleteproject_query = query1 + query2 + query3;

  }

  if (typeof req.query.ct !== 'undefined') {
    dbName = config.databse
    //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [cityname] = '"+req.query.ct+"'";
    //return res.status(200).json(query)

    query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
    //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
    query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
    query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [cityname] = '" + req.query.ct + "')); "
    //return res.status(200).json(query)
    query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
    query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [cityname] = '" + req.query.ct + "'); "

    query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [cityname] = '" + req.query.ct + "'";

    deleteproject_query = query1 + query2 + query3;



  }

  if (typeof req.query.cm !== 'undefined') {
    dbName = config.databse
    //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [campusname] = '"+req.query.cm+"'";
    //return res.status(200).json(query)

    query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
    //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
    query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
    query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [campusname] = '" + req.query.cm + "')); "
    //return res.status(200).json(query)
    query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
    query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [campusname] = '" + req.query.cm + "'); "

    query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [campusname] = '" + req.query.cm + "'";

    deleteproject_query = query1 + query2 + query3;


  }

  if (typeof req.query.bl !== 'undefined') {
    dbName = config.databse
    //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [buildingname] = '"+req.query.bl+"'";
    //return res.status(200).json(query)

    query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
    //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
    query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
    query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [buildingname] = '" + req.query.bl + "')); "
    //return res.status(200).json(query)
    query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
    query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [buildingname] = '" + req.query.bl + "'); "

    query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [buildingname] = '" + req.query.bl + "'";

    deleteproject_query = query1 + query2 + query3;


  }


  if (typeof req.query.eq !== 'undefined') {
    dbName = config.databse
    //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [equipmentname] = '"+req.query.eq+"'";
    //return res.status(200).json(query)

    query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
    //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
    query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
    query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] = '" + req.query.eq + "')); "
    //return res.status(200).json(query)
    query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
    query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] = '" + req.query.eq + "'); "

    query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] = '" + req.query.eq + "'";

    deleteproject_query = query1 + query2 + query3;


  }


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    request.query(deleteproject_query, function (err, records) {
      if (err) {
        console.log(query);
        return res.status(200).json('failed')

      } else {

        console.log('success');
        return res.status(200).json('success')

      }


    })
  })


}


const deleteproject_8_7_2024 = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  try {
    await pool.connect();
    const request = pool.request();


    deleteproject_query = ""
    if (typeof req.query.cn !== 'undefined') {
      dbName = config.databse
      //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [countryname] = '"+req.query.cn+"'";

      query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
      //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
      query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [countryname] = '" + req.query.cn + "')); "
      //return res.status(200).json(query)
      query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [countryname] = '" + req.query.cn + "'); "

      query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [countryname] = '" + req.query.cn + "'";

      deleteproject_query = query1 + query2 + query3;

    }

    if (typeof req.query.ct !== 'undefined') {
      dbName = config.databse
      //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [cityname] = '"+req.query.ct+"'";
      //return res.status(200).json(query)

      query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
      //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
      query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [cityname] = '" + req.query.ct + "')); "
      //return res.status(200).json(query)
      query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [cityname] = '" + req.query.ct + "'); "

      query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [cityname] = '" + req.query.ct + "'";

      deleteproject_query = query1 + query2 + query3;



    }

    if (typeof req.query.cm !== 'undefined') {
      dbName = config.databse
      //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [campusname] = '"+req.query.cm+"'";
      //return res.status(200).json(query)

      query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
      //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
      query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [campusname] = '" + req.query.cm + "')); "
      //return res.status(200).json(query)
      query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [campusname] = '" + req.query.cm + "'); "

      query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [campusname] = '" + req.query.cm + "'";

      deleteproject_query = query1 + query2 + query3;


    }

    if (typeof req.query.bl !== 'undefined') {
      dbName = config.databse
      //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [buildingname] = '"+req.query.bl+"'";
      //return res.status(200).json(query)

      query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
      //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
      query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [buildingname] = '" + req.query.bl + "')); "
      //return res.status(200).json(query)
      query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [buildingname] = '" + req.query.bl + "'); "

      query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [buildingname] = '" + req.query.bl + "'";

      deleteproject_query = query1 + query2 + query3;


    }


    if (typeof req.query.eq !== 'undefined') {
      dbName = config.databse
      //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [equipmentname] = '"+req.query.eq+"'";
      //return res.status(200).json(query)

      query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
      //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
      query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] = '" + req.query.eq + "')); "
      //return res.status(200).json(query)
      query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] = '" + req.query.eq + "'); "

      query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] = '" + req.query.eq + "'";

      deleteproject_query = query1 + query2 + query3;


    }

    await request.query(deleteproject_query)
    return res.status(200).json('success')


  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }



}

const deleteproject = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  modifier = req.query.modifier
  equipmentname = req.query.eq

  try {
    await pool.connect();
    const request = pool.request();

    deleteproject_query = ""
    if (typeof req.query.cn !== 'undefined') {
      //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [countryname] = '"+req.query.cn+"'";

      query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
      //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
      query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [countryname] = '" + req.query.cn + "')); "
      //return res.status(200).json(query)
      query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [countryname] = '" + req.query.cn + "'); "

      query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [countryname] = '" + req.query.cn + "'";

      //deleteproject_query = query1 + query2 + query3;
      deleteproject_query = query3;

      projectDetailSQL = "select * from [" + dbName + "].[ECCAnalytics].[Project] where [countryname] = '" + req.query.cn + "'";
      projectData = await request.query(projectDetailSQL)
      equipmentName = ""
      projectRecordId = ""
      for (count = 0; count < projectData['recordsets'][0].length; count++) {
        equipmentName += projectData['recordsets'][0][count].equipmentname + ", "
        projectRecordId += projectData['recordsets'][0][count].recordid + ", "
      }
      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,dated) VALUES ('" + modifier + "','" + equipmentName + "', '" + projectRecordId + "','delete',CURRENT_TIMESTAMP); "

    }

    if (typeof req.query.ct !== 'undefined') {
      //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [cityname] = '"+req.query.ct+"'";
      //return res.status(200).json(query)

      query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
      //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
      query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [cityname] = '" + req.query.ct + "')); "
      //return res.status(200).json(query)
      query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [cityname] = '" + req.query.ct + "'); "

      query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [cityname] = '" + req.query.ct + "'";

      //deleteproject_query = query1 + query2 + query3;
      deleteproject_query = query3;

      projectDetailSQL = "select * from [" + dbName + "].[ECCAnalytics].[Project] where [cityname] = '" + req.query.ct + "'";
      projectData = await request.query(projectDetailSQL)
      equipmentName = ""
      projectRecordId = ""
      for (count = 0; count < projectData['recordsets'][0].length; count++) {
        equipmentName += projectData['recordsets'][0][count].equipmentname + ", "
        projectRecordId += projectData['recordsets'][0][count].recordid + ", "
      }
      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,dated) VALUES ('" + modifier + "','" + equipmentName + "', '" + projectRecordId + "','delete',CURRENT_TIMESTAMP); "


    }

    if (typeof req.query.cm !== 'undefined') {
      //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [campusname] = '"+req.query.cm+"'";
      //return res.status(200).json(query)

      query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
      //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
      query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [campusname] = '" + req.query.cm + "')); "
      //return res.status(200).json(query)
      query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [campusname] = '" + req.query.cm + "'); "

      query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [campusname] = '" + req.query.cm + "'";

      //deleteproject_query = query1 + query2 + query3;
      deleteproject_query = query3;


      projectDetailSQL = "select * from [" + dbName + "].[ECCAnalytics].[Project] where [campusname] = '" + req.query.cm + "'";
      projectData = await request.query(projectDetailSQL)
      equipmentName = ""
      projectRecordId = ""
      for (count = 0; count < projectData['recordsets'][0].length; count++) {
        equipmentName += projectData['recordsets'][0][count].equipmentname + ", "
        projectRecordId += projectData['recordsets'][0][count].recordid + ", "
      }
      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,dated) VALUES ('" + modifier + "','" + equipmentName + "', '" + projectRecordId + "','delete',CURRENT_TIMESTAMP); "

    }

    if (typeof req.query.bl !== 'undefined') {
      //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [buildingname] = '"+req.query.bl+"'";
      //return res.status(200).json(query)

      query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
      //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
      query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [buildingname] = '" + req.query.bl + "')); "
      //return res.status(200).json(query)
      query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [buildingname] = '" + req.query.bl + "'); "

      query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [buildingname] = '" + req.query.bl + "'";

      //deleteproject_query = query1 + query2 + query3;
      deleteproject_query = query3;

      projectDetailSQL = "select * from [" + dbName + "].[ECCAnalytics].[Project] where [buildingname] = '" + req.query.bl + "'";
      projectData = await request.query(projectDetailSQL)
      equipmentName = ""
      projectRecordId = ""
      for (count = 0; count < projectData['recordsets'][0].length; count++) {
        equipmentName += projectData['recordsets'][0][count].equipmentname + ", "
        projectRecordId += projectData['recordsets'][0][count].recordid + ", "
      }
      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,dated) VALUES ('" + modifier + "','" + equipmentName + "', '" + projectRecordId + "','delete',CURRENT_TIMESTAMP); "

    }


    if (typeof req.query.eq !== 'undefined') {
      //query = " delete  FROM ["+dbName+"].[ECCAnalytics].[Project] where [equipmentname] = '"+req.query.eq+"'";
      //return res.status(200).json(query)

      query1 = "delete  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in "
      //query = "select datapointid ,[devicerecordid] from   [ECC_DEV].[ECCAnalytics].[DataPoint] where devicerecordid in " 
      query1 += " (select recordid from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query1 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] = '" + req.query.eq + "')); "
      //return res.status(200).json(query)
      query2 = " delete from [" + dbName + "].[ECCAnalytics].devices where [equipmentname] in "
      query2 += " (select equipmentname  from  [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] = '" + req.query.eq + "'); "

      query3 = " delete  FROM [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] = '" + req.query.eq + "'";

      //deleteproject_query = query1 + query2 + query3;
      deleteproject_query = query3;

      projectDetailSQL = "select * from [" + dbName + "].[ECCAnalytics].[Project] where [equipmentname] = '" + req.query.eq + "'";
      projectData = await request.query(projectDetailSQL)
      projectrecordid = projectData['recordsets'][0][0].recordid
      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,dated) VALUES ('" + modifier + "','" + equipmentname + "', '" + projectrecordid + "','delete',CURRENT_TIMESTAMP); "


    }



    //updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + equipmentname + "', '" + projectrecordid + "','delete','" + previousrecord + "', '" + currentrecord + "',CURRENT_TIMESTAMP); "
    deleteproject_query += updateprojectaudit_query;
    console.log(deleteproject_query)
    //return 0
    console.log(deleteproject_query);

    await request.query(deleteproject_query)

    return res.status(200).json('success')

  } catch (err) {
    console.error(err);
    console.error(deleteproject_query);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }
}


const deleteuser_25_6_2024 = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  //modifier = req.query.modifier
  query = ""
  //if (typeof req.query.id !== 'undefined') {
  // dbName = config.databse

  //getUsernameQuery = "SELECT [username] FROM ["+dbName+"].ECCAnalytics.Users where [userid] = "+req.query.id+";";

  deletequery = " delete  FROM [" + dbName + "].[ECCAnalytics].[Users] where [userid] = " + req.query.id + ";";

  //return res.status(200).json(query)

  //}



  //sql.connect(config,function(err){
  try {
    await sql.connect(config)
    var request = new sql.Request();

    //if(err)conole.log(err)
    //userData = await request.query(getUsernameQuery)
    //username = userData['recordsets'][0][0].username
    //deletequery += " INSERT INTO ["+dbName+"].ECCAnalytics.UserAudit (modifier,userid,event,dated) VALUES ('"+modifier+"','"+username+"','delete',CURRENT_TIMESTAMP); "

    //var request = new sql.Request();

    request.query(deletequery, function (err, records) {
      if (err) {
        console.log(deletequery);
        return res.status(200).json('failed')

      } else {
        console.log(deletequery);
        console.log('success');
        return res.status(200).json('success')

      }


    })
    //})
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

  }


}


const deleteuser = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);
  modifier = req.query.modifier

  //pool.connect().then(() => {
  try {
    await pool.connect();
    const request = pool.request();

    getUsernameQuery = "SELECT [username] FROM [" + dbName + "].ECCAnalytics.Users where [userid] = " + req.query.id + ";";
    userData = await request.query(getUsernameQuery)
    username = userData['recordsets'][0][0].username

    //query = ""
    deletequery = " delete  FROM [" + dbName + "].[ECCAnalytics].[Users] where [userid] = " + req.query.id + ";";
    deletequery += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,dated) VALUES ('" + modifier + "','" + username + "','delete',CURRENT_TIMESTAMP); "


    await request.query(deletequery)
    return res.status(200).json('success')

  } catch (err) {
    console.error(err);
    console.error(deletequery);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}



const updateuser_25_6_2024 = async (req, res) => {
  console.log(req.originalUrl)

  dbName = config.databse
  //modifier = req.body.modifier
  userid = req.query.userid
  if (typeof req.body.roles !== 'undefined') {
    dbName = config.databse
    username = req.body.username

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"'where username = '"+username+"'";
    updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [roles] = '" + req.body.roles + "'where userid = '" + userid + "'";

  }


  if (typeof req.body.pswd !== 'undefined') {
    pswd = req.body.pswd

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
    updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "' where userid = '" + userid + "'";

  }

  if (typeof req.body.accexpire !== 'undefined') {
    accexpire = req.body.accexpire

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
    updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [accexpire] = '" + req.body.accexpire + "' where userid = '" + userid + "'";

  }



  if (typeof req.body.pswd !== 'undefined' && typeof req.body.roles !== 'undefined') {
    pswd = req.body.pswd

    updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [roles] = '" + req.body.roles + "' where userid = '" + userid + "'";

  }


  if (typeof req.body.pswd !== 'undefined' && req.body.accexpire !== 'undefined') {
    pswd = req.body.pswd

    updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [accexpire] = '" + req.body.accexpire + "' where userid = '" + userid + "'";

  }



  if (typeof req.body.roles !== 'undefined' && req.body.accexpire !== 'undefined') {
    roles = req.body.roles

    updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [roles] = '" + req.body.roles + "', [accexpire] = '" + req.body.accexpire + "' where userid = '" + userid + "'";

  }


  if (typeof req.body.pswd !== 'undefined' && typeof req.body.roles !== 'undefined' && req.body.accexpire !== 'undefined') {
    pswd = req.body.pswd

    updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [roles] = '" + req.body.roles + "', [accexpire] = '" + req.body.accexpire + "' where userid = '" + userid + "'";

  }


  //sql.connect(config,function(err){
  await sql.connect(config)
  //if(err)conole.log(err)

  var updateuser_request = new sql.Request();

  updateuser_request.query(updateuser_query, function (err, records) {
    if (err) {
      console.log(updateuser_query);
      // return res.status(200).json('failed')

    } else {

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

const updateuser_31_7_2024 = async (req, res) => {
  //console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  modifier = req.body.modifier
  userid = req.query.userid
  username = req.body.username



  try {
    await pool.connect();
    const request = pool.request();

    userdataquery = "SELECT roles,FORMAT (accexpire, 'yyyy-MM-dd') as accexpire FROM [" + dbName + "].ECCAnalytics.Users where userid  =" + userid + ";";
    records = await request.query(userdataquery)
    prevRoles = records['recordsets'][0][0].roles
    prevAccexpire = records['recordsets'][0][0].accexpire
    toString(prevAccexpire)

    //console.log(prevAccexpire)
    //return 0;
    //return

    updateuser_query = ""
    if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd === 'undefined'  && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      updateuser_query = " update [" + dbName + "].[ECCAnalytics].[Users]  set [roles] = '" + req.body.roles + "' where userid = '" + userid + "'; ";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevRoles + "', '" + req.body.roles + "',CURRENT_TIMESTAMP); "
      //  console.log('hello')
      console.log(1)

    }


    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd !== 'undefined'  && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      pswd = req.body.pswd

      //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "' where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','password', 'password',CURRENT_TIMESTAMP); "
      console.log(2)

    }

    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd === 'undefined'  && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      accexpire = req.body.accexpire
      if(accexpire != null){
        accexpire = "'"+accexpire+"'"
      }
      //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [accexpire] = " + accexpire + " where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + "', " + accexpire + ",CURRENT_TIMESTAMP); "
      console.log(3)

    //  console.log(updateuser_query)
      //return;
    }


    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd === 'undefined'  && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      accneverexpire = req.body.accneverexpire

      //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [accneverexpire] = '" + req.body.accneverexpire + "' where userid = '" + userid + "'";
     // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + "', '" + accexpire + "',CURRENT_TIMESTAMP); "
     console.log(4)

    }


    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd !== 'undefined'  && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      pswd = req.body.pswd

      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [roles] = '" + req.body.roles + "', where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevRoles + ", " + "password" + "', '" + req.body.roles + ", " + "password" + "',CURRENT_TIMESTAMP); "
      console.log(5)

    }

    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd !== 'undefined'  && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      pswd = req.body.pswd

      
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
      //updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevRoles + ", " + "password" + "', '" + req.body.roles + ", " + "password" + "',CURRENT_TIMESTAMP); "
      console.log(6)

    }


    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd !== 'undefined'  && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      pswd = req.body.pswd
      accexpire = req.body.accexpire
      if(accexpire != null){
        accexpire = "'"+accexpire+"'"
      }

      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "',  [accexpire] = " + accexpire + " where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + "password" + "', '" + req.body.accexpire + ", " + "password" + "',CURRENT_TIMESTAMP); "
      console.log(7)

    }



    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd === 'undefined'  && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if(accexpire != null){
        accexpire = "'"+accexpire+"'"
      }

      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set  [roles] = '" + req.body.roles + "', [accexpire] = " + accexpire + ",  where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      //console.log('hi')
            console.log(8)

    }


    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd === 'undefined'  && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      roles = req.body.roles

      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set  [roles] = '" + req.body.roles + "',  [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
     // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(9)

    }


    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd === 'undefined'  && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if(accexpire != null){
        accexpire = "'"+accexpire+"'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [accexpire] = " + accexpire + ", [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
     // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(10)

    }

    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd !== 'undefined'  && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if(accexpire != null){
        accexpire = "'"+accexpire+"'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [accexpire] = " + accexpire + ", [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
     // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(11)

    }

    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd === 'undefined'  && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if(accexpire != null){
        accexpire = "'"+accexpire+"'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set  [roles] = '" + req.body.roles + "', [accexpire] = " + accexpire + ", [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
     // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(12)

    }

    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd !== 'undefined'  && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if(accexpire != null){
        accexpire = "'"+accexpire+"'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [roles] = '" + req.body.roles + "', [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
     // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(13)

    }

    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd !== 'undefined'  && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if(accexpire != null){
        accexpire = "'"+accexpire+"'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [roles] = '" + req.body.roles + "', [accexpire] = " + accexpire + " where userid = '" + userid + "'";
     // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(14)

    }


   else  {
      pswd = req.body.pswd
      accexpire = req.body.accexpire
      if(accexpire != null){
        accexpire = "'"+accexpire+"'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [roles] = '" + req.body.roles + "', [accexpire] = " + accexpire + ", [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
      //updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + ", password', '" + req.body.accexpire + ", " + req.body.roles + ", password',CURRENT_TIMESTAMP); "
      console.log(15)
      console.log('spot here')

    }


    console.log(updateuser_query);
    await request.query(updateuser_query)
    return res.status(200).json('success')

  } catch (err) {
    console.error(err);
    console.error(updateuser_query);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}

const updateuser = async (req, res) => {
  //console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  modifier = req.body.modifier
  userid = req.query.userid
  username = req.body.username



  try {
    await pool.connect();
    const request = pool.request();

    userdataquery = "SELECT roles,cast(accneverexpire as int) as accneverexpire,FORMAT (accexpire, 'yyyy-MM-dd') as accexpire FROM [" + dbName + "].ECCAnalytics.Users where userid  =" + userid + ";";
    records = await request.query(userdataquery)
    prevRoles = records['recordsets'][0][0].roles
    prevAccexpire = records['recordsets'][0][0].accexpire
    prevAccneverexpire = records['recordsets'][0][0].accneverexpire
    toString(prevAccexpire)

    //console.log(prevAccexpire)
    //return 0;
    //return

    updateuser_query = ""
    if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd === 'undefined' && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      updateuser_query = " update [" + dbName + "].[ECCAnalytics].[Users]  set [roles] = '" + req.body.roles + "' where userid = '" + userid + "'; ";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevRoles + "', '" + req.body.roles + "',CURRENT_TIMESTAMP); "
      //  console.log('hello')
      console.log(1)

    }


    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd !== 'undefined' && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      pswd = req.body.pswd

      //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "' where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','password', ' password',CURRENT_TIMESTAMP); "
      console.log(2)

    }

    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd === 'undefined' && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      accexpire = req.body.accexpire
      if (accexpire != null) {
        accexpire = "'" + accexpire + "'"
      }
      //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [accexpire] = " + accexpire + " where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + "', '" + req.body.accexpire + "',CURRENT_TIMESTAMP); "
      console.log(3)

      //  console.log(updateuser_query)
      //return;
    }


    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd === 'undefined' && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      accneverexpire = req.body.accneverexpire

      //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [accneverexpire] = '" + req.body.accneverexpire + "' where userid = '" + userid + "'";
      // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + "', '" + accexpire + "',CURRENT_TIMESTAMP); "
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','"+prevAccneverexpire+"', '"+ req.body.accneverexpire +"',CURRENT_TIMESTAMP); "
      console.log(4)

    }


    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd !== 'undefined' && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      pswd = req.body.pswd

      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [roles] = '" + req.body.roles + "', where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevRoles + ", password', '" + req.body.roles + ", password',CURRENT_TIMESTAMP); "
      console.log(5)

    }

    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd !== 'undefined' && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      pswd = req.body.pswd


      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
      //updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevRoles + ", " + "password" + "', '" + req.body.roles + ", " + "password" + "',CURRENT_TIMESTAMP); "
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update',' password, "+prevAccneverexpire+"', ' password,"+ req.body.accneverexpire +"',CURRENT_TIMESTAMP); "
      console.log(6)

    }


    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd !== 'undefined' && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      pswd = req.body.pswd
      accexpire = req.body.accexpire
      if (accexpire != null) {
        accexpire = "'" + accexpire + "'"
      }

      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "',  [accexpire] = " + accexpire + " where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','password, " + prevAccexpire + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      console.log(7)

    }



    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd === 'undefined' && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if (accexpire != null) {
        accexpire = "'" + accexpire + "'"
      }

      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set  [roles] = '" + req.body.roles + "', [accexpire] = " + accexpire + ",  where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(8)

    }


    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd === 'undefined' && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      roles = req.body.roles

      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set  [roles] = '" + req.body.roles + "',  [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
      // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevRoles + ", "+prevAccneverexpire+"', '" + req.body.roles + ","+ req.body.accneverexpire +"',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(9)

    }


    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd === 'undefined' && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if (accexpire != null) {
        accexpire = "'" + accexpire + "'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [accexpire] = " + accexpire + ", [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
      // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ",  "+prevAccneverexpire+"', '" + req.body.accexpire + ", "+ req.body.accneverexpire +"',CURRENT_TIMESTAMP); "
      console.log(10)

    }

    else if (typeof req.body.roles === 'undefined' && typeof req.body.pswd !== 'undefined' && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if (accexpire != null) {
        accexpire = "'" + accexpire + "'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [accexpire] = " + accexpire + ", [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
      // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", password, "+prevAccneverexpire+"', '" + req.body.accexpire + ", " + req.body.roles + ", "+req.body.accneverexpire +"',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(11)

    }

    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd === 'undefined' && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if (accexpire != null) {
        accexpire = "'" + accexpire + "'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set  [roles] = '" + req.body.roles + "', [accexpire] = " + accexpire + ", [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
      // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + ",  "+prevAccneverexpire+"', '" + req.body.accexpire + ", " + req.body.roles + ", "+req.body.accneverexpire+"',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(12)

    }

    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd !== 'undefined' && typeof req.body.accexpire === 'undefined' && typeof req.body.accneverexpire !== 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if (accexpire != null) {
        accexpire = "'" + accexpire + "'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [roles] = '" + req.body.roles + "', [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
      // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevRoles + ", password, "+prevAccneverexpire+"', '" + req.body.accneverexpire + ", " + req.body.roles + ", password',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(13)

    }

    else if (typeof req.body.roles !== 'undefined' && typeof req.body.pswd !== 'undefined' && typeof req.body.accexpire !== 'undefined' && typeof req.body.accneverexpire === 'undefined') {
      roles = req.body.roles
      accexpire = req.body.accexpire
      if (accexpire != null) {
        accexpire = "'" + accexpire + "'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [roles] = '" + req.body.roles + "', [accexpire] = " + accexpire + " where userid = '" + userid + "'";
      // updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + "', '" + req.body.accexpire + ", " + req.body.roles + "',CURRENT_TIMESTAMP); "
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + ", password', '" + req.body.accexpire + ", " + req.body.roles + ", password',CURRENT_TIMESTAMP); "
      //console.log('hi')
      console.log(14)

    }


    else {
      pswd = req.body.pswd
      accexpire = req.body.accexpire
      if (accexpire != null) {
        accexpire = "'" + accexpire + "'"
      }
      updateuser_query = "update [" + dbName + "].[ECCAnalytics].[Users]  set [pswd] = '" + req.body.pswd + "', [roles] = '" + req.body.roles + "', [accexpire] = " + accexpire + ", [accneverexpire] = " + req.body.accneverexpire + " where userid = '" + userid + "'";
      updateuser_query += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','update','" + prevAccexpire + ", " + prevRoles + ", password, "+prevAccneverexpire+"', '" + req.body.accexpire + ", " + req.body.roles + ", password,"+ req.body.accneverexpire +"',CURRENT_TIMESTAMP); "
      console.log(15)
      console.log(records['recordsets'][0][0])

    }


    console.log(updateuser_query);
    await request.query(updateuser_query)
    return res.status(200).json('success')

  } catch (err) {
    console.error(err);
    console.error(updateuser_query);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}



const getbuilding_6_7_2024 = (req, res) => {
  console.log(req.originalUrl)

  cm = req.query.cm
  dbName = config.databse

  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var getbuilding_request = new sql.Request();


    getbuilding_query = "SELECT [recordid],[buildingname] as building FROM [" + dbName + "].[ECCAnalytics].[Buildings] where campusname = '" + cm + "'"
    getbuilding_request.query(getbuilding_query, function (err, records) {
      if (err)
        console.log(err);
      else {
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

const getbuilding = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  cm = req.query.cm

  try {
    await pool.connect();
    const request = pool.request();

    getbuilding_query = "SELECT [recordid],[buildingname] as building FROM [" + dbName + "].[ECCAnalytics].[Buildings] where campusname = '" + cm + "'"
    records = await request.query(getbuilding_query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}




const getcampus_6_7_2024 = (req, res) => {
  console.log(req.originalUrl)

  ct = req.query.ct
  dbName = config.databse

  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var getcampus_request = new sql.Request();


    getcampus_query = "SELECT [recordid],[campusname] as campus FROM [" + dbName + "].[ECCAnalytics].[Campuses] where cityname = '" + ct + "'"
    getcampus_request.query(getcampus_query, function (err, records) {
      if (err)
        console.log(err);
      else {
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


const getcampus = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  ct = req.query.ct

  try {
    await pool.connect();
    const request = pool.request();

    getcampus_query = "SELECT [recordid],[campusname] as campus FROM [" + dbName + "].[ECCAnalytics].[Campuses] where cityname = '" + ct + "'"
    records = await request.query(getcampus_query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}

const getcity_6_7_2024 = (req, res) => {
  console.log(req.originalUrl)

  cn = req.query.cn
  dbName = config.databse

  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var getcity_request = new sql.Request();


    getcity_query = "SELECT [recordid],[cityname] FROM [" + dbName + "].[ECCAnalytics].[Cities] where countryname = '" + cn + "'"
    getcity_request.query(getcity_query, function (err, records) {
      if (err)
        console.log(err);
      else {
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

const getcity = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  cn = req.query.cn

  try {
    await pool.connect();
    const request = pool.request();

    getcity_query = "SELECT [recordid],[cityname] FROM [" + dbName + "].[ECCAnalytics].[Cities] where countryname = '" + cn + "'"
    records = await request.query(getcity_query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}

const getcountry_6_7_2024 = (req, res) => {
  console.log(req.originalUrl)

  cn = req.query.cn
  dbName = config.databse
  console.log(req.originalUrl)
  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var request = new sql.Request();


    query = "SELECT [recordid],[countryname] FROM [" + dbName + "].[ECCAnalytics].[Countries]"
    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
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

const getcountry = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  //  cn = req.query.cn

  try {
    await pool.connect();
    const request = pool.request();

    query = "SELECT [recordid],[countryname] FROM [" + dbName + "].[ECCAnalytics].[Countries]"
    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}

const getdevices_6_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var request = new sql.Request();


    //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
    query = "SELECT [equipmentname],[deviceid],[ip],[port],[network],[manufacturer],[modelname] FROM [" + dbName + "].[ECCAnalytics].Devices"
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
        return res.status(200).json(records['recordsets'][0])
      }

    }

    )
  })
}


const getdevices = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  //  cn = req.query.cn

  try {
    await pool.connect();
    const request = pool.request();

    query = "SELECT [equipmentname],[deviceid],[ip],[port],[network],[manufacturer],[modelname] FROM [" + dbName + "].[ECCAnalytics].Devices"
    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}

const getusers_6_7_2024 = (req, res) => {
  console.log(req.originalUrl);
  dbName = config.databse

  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var request = new sql.Request();


    //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
    //query = "SELECT [userid],[username],[roles],[useremailid],[pswd],[loginstatus] ,[accexpire] FROM ["+dbName+"].[ECCAnalytics].Users"
    query = "SELECT * FROM [" + dbName + "].[ECCAnalytics].Users"
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
        return res.status(200).json(records['recordsets'][0])
      }

    }

    )
  })
}

const getusers_8_8_2024 = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  //  cn = req.query.cn

  try {
    await pool.connect();
    const request = pool.request();

    query = "SELECT * FROM [" + dbName + "].[ECCAnalytics].Users"
    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}

const getusers = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  //  cn = req.query.cn

  try {
    await pool.connect();
    const request = pool.request();

    query = "SELECT * FROM [" + dbName + "].[ECCAnalytics].Users where  DATEDIFF(day,GETDATE(), accexpire) >= 0 or accexpire IS NULL"
    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}

const adduser_25_6_2024 = (req, res) => {
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


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
    dbName = config.databse
    query = "SELECT * FROM [" + dbName + "].ECCAnalytics.Users where username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "'"
    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        // return res.status(200).json(records['recordsets'][0])
        if (records['recordsets'][0].length != 0)
          return res.status(200).json('User exists')
        else {
          //query2 = "INSERT INTO ["+dbName+"].ECCAnalytics.Users (username, roles,useremailid,pswd,userloc,usercampus) VALUES ('"+username+"','"+roles+"','"+useremailid+"','"+pswd+"','"+userloc+"','"+usercampus+"')"
          query2 = "INSERT INTO [" + dbName + "].ECCAnalytics.Users (username, roles,useremailid,pswd,configloginstatus,analyticloginstatus,accexpire) VALUES ('" + username + "','" + roles + "','" + useremailid + "','" + pswd + "','0','0','" + accexpire + "');"
          //query2 += " INSERT INTO ["+dbName+"].ECCAnalytics.UserAudit (modifier,userid,event,dated) VALUES ('"+modifier+"','"+username+"','add',CURRENT_TIMESTAMP); "
          request.query(query2, function (err, records) {
            if (err)
              console.log(err);
            else {

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


const adduser = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  username = req.body.username
  roles = req.body.roles
  useremailid = req.body.useremailid
  pswd = req.body.pswd
  accexpire = req.body.accexpire
  modifier = req.body.modifier
  accneverexpire = req.body.accneverexpire

  if (!username) {
    return res.status(500).json('failed');

  }
  if (!pswd) {
    return res.status(500).json('failed');

  }

  if (!roles) {
    return res.status(500).json('failed');

  }
  //userloc = req.body.userloc
  //usercampus = req.body.usercampus

  try {
    await pool.connect();
    const request = pool.request();


    query = "SELECT * FROM [" + dbName + "].ECCAnalytics.Users where username COLLATE SQL_Latin1_General_CP1_CS_AS ='" + username + "'"


    records = await request.query(query)
    if (records['recordsets'][0].length != 0)
      return res.status(200).json('User exists')
      //return res.status(200).json({ username: records['recordsets'][0][0]['username'], email: records['recordsets'][0][0]['useremailid'] })
    else {
      if (accexpire == null) {
        insertQuery = "INSERT INTO [" + dbName + "].ECCAnalytics.Users (username, roles,useremailid,pswd,configloginstatus,analyticloginstatus,accexpire,accneverexpire) VALUES ('" + username + "','" + roles + "','" + useremailid + "','" + pswd + "','0','0'," + accexpire + "," + accneverexpire + ");"

      } else {
        insertQuery = "INSERT INTO [" + dbName + "].ECCAnalytics.Users (username, roles,useremailid,pswd,configloginstatus,analyticloginstatus,accexpire,accneverexpire) VALUES ('" + username + "','" + roles + "','" + useremailid + "','" + pswd + "','0','0','" + accexpire + "'," + accneverexpire + ");"
      }
      insertQuery += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,currentrecord,dated) VALUES ('" + modifier + "','" + username + "','add','" + roles + "',CURRENT_TIMESTAMP); "
      console.log(insertQuery)
      await request.query(insertQuery)
      return res.status(200).json('success')

    }
  } catch (err) {
    console.error(err);
    console.error(deletequery);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }

}

const subequipmentdatapoint = async (req, res) => {
  console.log(req.originalUrl);
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  eqptid = req.query.eqptid
  assoeqptid = req.query.aeid


  try {
    await pool.connect();
    const request = pool.request();

    query = "select [T1].[pointid], [T1].[pointdesc],[T2].[associatedequipid], [T3].[associatedequiptype] from [" + dbName + "].[ECCAnalytics].[PointType] T1 left join [" + dbName + "].ECCAnalytics.AssociatedEquipments_DataPoints T2 on [T1].[pointid] =  [T2].[pointid] left join [" + dbName + "].[ECCAnalytics].[AssociatedEquipments]  T3 on [T2].[associatedequipid] = [T3].[associatedequipid] where [T2].associatedequipid  in(" + assoeqptid + ") and [T2].equipmentid ='" + eqptid + "' and [T3].equipmentid ='" + eqptid + "'"
    records = await request.query(query)
    console.log(query)
    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();

  }

  /*
    sql.connect(config, function (err) {
      if (err) conole.log(err)
  
  
      var request = new sql.Request();
  
  
      query = "select [T1].[pointid], [T1].[pointdesc],[T2].[associatedequipid], [T3].[associatedequiptype] from [" + dbName + "].[ECCAnalytics].[PointType] T1 left join [" + dbName + "].ECCAnalytics.AssociatedEquipments_DataPoints T2 on [T1].[pointid] =  [T2].[pointid] left join [" + dbName + "].[ECCAnalytics].[AssociatedEquipments]  T3 on [T2].[associatedequipid] = [T3].[associatedequipid] where [T2].equipmentid ='" + eqptid + "' and [T2].associatedequipid  in(" + assoeqptid + ")"
  
      request.query(query, function (err, records) {
        if (err)
          console.log(err);
        else {
          // DATA.append({'equipmentname': row[1],'deviceid': row[2],'ip': row[3],'port': row[4],'network': row[5],'manufacturer': row[6],'modelname': row[7] })
  
          console.log(query);
  
          return res.status(200).json(records['recordsets'][0])
        }
  
      }
  
      )
    })
    */
}




const subequipmentlist_OLD = (req, res) => {
  dbName = config.databse

  eqp = req.query.eqp



  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var request = new sql.Request();


    //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
    query = "SELECT [subequiprecordid] as recordid  ,[subequipmenttype] FROM [" + dbName + "].ECCAnalytics.SubEquipments where equipmenttype ='" + eqp + "'"
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
        return res.status(200).json(records['recordsets'][0])
      }

    }

    )
  })
}




const subequipmentlist_6_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  eqpid = req.query.eqpid



  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var request = new sql.Request();


    //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
    query = "SELECT [assoequiprecordid],[associatedequipid],[associatedequiptype] FROM [" + dbName + "].ECCAnalytics.AssociatedEquipments where equipmentid ='" + eqpid + "'"
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
*/          console.log(query);

        return res.status(200).json(records['recordsets'][0])
      }

    }

    )
  })
}

const subequipmentlist = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  eqpid = req.query.eqpid

  try {
    await pool.connect();
    const request = pool.request();

    query = "SELECT [assoequiprecordid],[associatedequipid],[associatedequiptype] FROM [" + dbName + "].ECCAnalytics.AssociatedEquipments where equipmentid ='" + eqpid + "'"
    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}

/********************************************************************** */

const postdatapoint_NOT_IN_USE = (req, res) => {
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
  chkquery = "select [deviceid] from  [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid in("

  for (jLength = 0; jLength < req.body.devices.length; jLength++) {
    if (req.body.devices.length - jLength != 1)
      chkquery += "'" + req.body.devices[jLength].deviceid + "',"
    else
      chkquery += "'" + req.body.devices[jLength].deviceid + "'"

  }

  chkquery += ")"
  //console.log(chkquery)

  sql.connect(config, function (err) {
    if (err) console.log('Erro is coming')
    //else console.log('conected')
    var request = new sql.Request();
    //console.log(request)

    request.query(chkquery, function (err, records) {
      if (err) { console.log(err) }
      else {
        // console.log(query)

        // console.log(records['recordsets'][0]);
        for (ar = 0; ar < records['recordsets'][0].length; ar++) {
          devicearr.push(records['recordsets'][0][ar].deviceid)
        }
        // return 0
        query = "insert into [" + dbName + "].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values "
        f = 0
        totalDeviceAdded = 0
        for (i = 0; i < devices.length; i++) {
          console.log(devices[i]['equipmentname'])
          if (!devicearr.includes(devices[i]['deviceid'])) {
            // if(i ==devices.length -1 ){
            if (f == 1) {
              query += ","
              f = 1
            }
            // query+="('"+req.body.equipmentname+"', '"+devices[i]['deviceid']+"', '"+devices[i]['ip']+"', '"+devices[i]['port']+"', '"+devices[i]['network']+"', '"+devices[i]['manufacturer']+"', '"+devices[i]['modelname']+"');"

            //}else{
            query += "('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + devices[i]['ip'] + "', '" + devices[i]['port'] + "', '" + devices[i]['network'] + "', '" + devices[i]['manufacturer'] + "', '" + devices[i]['modelname'] + "')"
            f = 1
            totalDeviceAdded++
            deviceids.push(devices[i]['deviceid'])
            //}
          }
        }
        query += ";"
        //res.status(200).json(records['recordsets'][0])
        //console.log(query)

      }


      request.query(query, function (err, records) {
        if (err)
          console.log(err);
        else {
          //-----------------------
          dvctblidarray = []
          query2 = "select TOP (" + totalDeviceAdded + ") recordid,deviceid FROM [" + dbName + "].[ECCAnalytics].[Devices] order by recordid DESC;"
          request.query(query2, function (err, records) {
            if (err)
              console.log(query2);
            else {
              console.log(query2);

              data = { 'status': 'success' }
              for (dvctblid = 0; dvctblid < records['recordsets'][0].length; dvctblid++) {
                dvctblidarray.push(records['recordsets'][0][dvctblid].recordid)
              }

              //return res.status(200).json(records['recordsets'][0])
              dvctblidarray.reverse()
              console.log(dvctblidarray)
              query3 = "INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "

              // for ( dp=0; dp<devices[j]['datapoint'].length;dp++ ){
              comma = 0
              for (dp = 0; dp < req.body.devices.length; dp++) {
                if (deviceids.includes(req.body.devices[dp].deviceid)) {
                  console.log('match')
                  for (dtapnt = 0; dtapnt < req.body.devices[dp].datapoint.length; dtapnt++) {
                    // console.log(dtapnt)
                    console.log(dp + "," + req.body.devices.length)

                    // if(dtapnt ==req.body.devices[dp].datapoint.length -1 && dp ==req.body.devices.length-1 ){
                    //records['recordsets'][0][j]
                    //query3 += "('"+deviceids[j]+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+");"
                    //query3 += "('"+req.body.devices[dp].deviceid+"','"+req.body.devices[dp].datapoint[dtapnt].pointid+"','"+req.body.devices[dp].datapoint[dtapnt].actualpoint+"','"+req.body.devices[dp].datapoint[dtapnt].multiply+"','"+req.body.devices[dp].datapoint[dtapnt].addition+"', CURRENT_TIMESTAMP, '"+req.body.devices[dp].datapoint[dtapnt].objtype+"', '"+req.body.devices[dp].datapoint[dtapnt].objinstance+"', "+dvctblidarray[dp]+");"
                    //}else{
                    //query3 += "('"+deviceids[dp]+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+"),"
                    if (comma == 1) {
                      query3 += ","
                      comma = 1
                    }
                    query3 += "('" + req.body.devices[dp].deviceid + "','" + req.body.devices[dp].datapoint[dtapnt].pointid + "','" + req.body.devices[dp].datapoint[dtapnt].actualpoint + "','" + req.body.devices[dp].datapoint[dtapnt].multiply + "','" + req.body.devices[dp].datapoint[dtapnt].addition + "', CURRENT_TIMESTAMP, '" + req.body.devices[dp].datapoint[dtapnt].objtype + "', '" + req.body.devices[dp].datapoint[dtapnt].objinstance + "', " + dvctblidarray[dp] + ",'" + req.body.devices[dp].datapoint[dtapnt].isenergyvalue + "')"

                    comma = 1

                    console.log(comma)

                    // }
                    //}
                  }
                }
              }
              query3 += ";"
              console.log(query3);
              //return res.status(200).json(query3)               
              //return query3;
              //-----------------------------------------------------------  
              request.query(query3, function (err, records) {
                if (err) {
                  console.log(query3);
                  return res.status(200).json('failed')

                } else {

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



const postdatapoint_24_05_2024 = (req, res) => {
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


  query = "insert into [" + dbName + "].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values "

  for (i = 0; i < devices.length; i++) {
    if (i == devices.length - 1) {
      query += "('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + devices[i]['ip'] + "', '" + devices[i]['port'] + "', '" + devices[i]['network'] + "', '" + devices[i]['manufacturer'] + "', '" + devices[i]['modelname'] + "');"

    } else {
      query += "('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + devices[i]['ip'] + "', '" + devices[i]['port'] + "', '" + devices[i]['network'] + "', '" + devices[i]['manufacturer'] + "', '" + devices[i]['modelname'] + "'),"
    }
  }

  sql.connect(config, function (err) {
    if (err)
      console.log(err)

    // make a request as

    var request = new sql.Request();

    chkquery = "SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + deviceid + "'"
    request.query(chkquery, function (err, records) {
      if (err)
        console.log(err);
      else {
        if (records['recordsets'][0].length == 0) { // if no devices in the device table with the given device id then add new
          console.log('If case')

          request.query(query, function (err, records) { // if no devices in the device table with the given device id then add a device here
            if (err)
              console.log(query);
            else {
              //-----------------------
              //console.log(query);

              query2 = "select TOP (" + devices.length + ") recordid FROM [" + dbName + "].[ECCAnalytics].[Devices] where deviceid = '" + deviceid + "' order by recordid DESC;"
              request.query(query2, function (err, records) {
                if (err)
                  console.log(query2);
                else {
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
                  for (j = 0; j < records['recordsets'][0].length; j++) {
                    for (dp = 0; dp < devices[j]['datapoint'].length; dp++) {
                      //if(dp ==devices[j]['datapoint'].length -1 ){
                      if (devices[j]['datapoint'][dp]['datapointid'] == null) {
                        //records['recordsets'][0][j]
                        //console.log(query3)
                        query3 += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                        query3 += "('" + deviceid + "','" + devices[j]['datapoint'][dp]['pointid'] + "','" + devices[j]['datapoint'][dp]['actualpoint'] + "','" + devices[j]['datapoint'][dp]['multiply'] + "','" + devices[j]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[j]['datapoint'][dp]['objtype'] + "', '" + devices[j]['datapoint'][dp]['objinstance'] + "', " + records['recordsets'][0][j]['recordid'] + ", '" + devices[j]['datapoint'][dp]['isenergyvalue'] + "');"
                      } else {
                        //query3 += "('"+deviceid+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+records['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"'),"
                        //console.log(query3)
                        query3 += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + deviceid + "', pointid = '" + devices[j]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[j]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[j]['datapoint'][dp]['multiply'] + "', addition ='" + devices[j]['datapoint'][dp]['addition'] + "',dated = CURRENT_TIMESTAMP, objtype = '" + devices[j]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[j]['datapoint'][dp]['objinstance'] + "',devicerecordid = " + records['recordsets'][0][j]['recordid'] + ",isenergyvalue = '" + devices[j]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[j]['datapoint'][dp]['datapointid'] + "; "

                      }
                    }
                  }

                  request.query(query3, function (err, records) {
                    if (err) {
                      console.log(query3);
                      return res.status(200).json('failed')

                    } else {

                      console.log('success');
                      return res.status(200).json('success')

                    }


                  })
                }

              })

              //&&&&&&
            }

          })


        } else {
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
          j = 0;
          for (dp = 0; dp < devices[j]['datapoint'].length; dp++) {
            if (devices[j]['datapoint'][dp]['datapointid'] == null) {
              query3 += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              query3 += "('" + deviceid + "','" + devices[j]['datapoint'][dp]['pointid'] + "','" + devices[j]['datapoint'][dp]['actualpoint'] + "','" + devices[j]['datapoint'][dp]['multiply'] + "','" + devices[j]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[j]['datapoint'][dp]['objtype'] + "', '" + devices[j]['datapoint'][dp]['objinstance'] + "', " + records['recordsets'][0][j]['recordid'] + ", '" + devices[j]['datapoint'][dp]['isenergyvalue'] + "');"
            } else {
              query3 += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + deviceid + "', pointid = '" + devices[j]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[j]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[j]['datapoint'][dp]['multiply'] + "', addition ='" + devices[j]['datapoint'][dp]['addition'] + "',dated = CURRENT_TIMESTAMP, objtype = '" + devices[j]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[j]['datapoint'][dp]['objinstance'] + "',devicerecordid = " + records['recordsets'][0][j]['recordid'] + ",isenergyvalue = '" + devices[j]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[j]['datapoint'][dp]['datapointid'] + "; "

            }
          }


          // }
          request.query(query3, function (err, records) {
            if (err) {
              console.log(query3);
              return res.status(200).json('failed')

            } else {
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



const postdatapoint__from_OLD_FILE = (req, res) => {
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


  query = "insert into [" + dbName + "].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values "

  for (i = 0; i < devices.length; i++) {
    console.log(devices[i]['equipmentname'])
    if (i == devices.length - 1) {
      query += "('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + devices[i]['ip'] + "', '" + devices[i]['port'] + "', '" + devices[i]['network'] + "', '" + devices[i]['manufacturer'] + "', '" + devices[i]['modelname'] + "');"

    } else {
      query += "('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + devices[i]['ip'] + "', '" + devices[i]['port'] + "', '" + devices[i]['network'] + "', '" + devices[i]['manufacturer'] + "', '" + devices[i]['modelname'] + "'),"
    }
  }

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    chkquery = "SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + deviceid + "'"
    request.query(chkquery, function (err, records) {
      if (err)
        console.log(err);
      else {
        if (records['recordsets'][0].length == 0) {

          request.query(query, function (err, records) {
            if (err)
              console.log(query);
            else {
              //-----------------------
              console.log(query);

              query2 = "select TOP (" + devices.length + ") recordid FROM [" + dbName + "].[ECCAnalytics].[Devices] where deviceid = '" + deviceid + "' order by recordid DESC;"
              request.query(query2, function (err, records) {
                if (err)
                  console.log(query2);
                else {
                  data = { 'status': 'success' }
                  query3 = "INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "

                  for (j = 0; j < records['recordsets'][0].length; j++) {
                    for (dp = 0; dp < devices[j]['datapoint'].length; dp++) {
                      if (dp == devices[j]['datapoint'].length - 1) {
                        //records['recordsets'][0][j]
                        //console.log(query3)
                        query3 += "('" + deviceid + "','" + devices[j]['datapoint'][dp]['pointid'] + "','" + devices[j]['datapoint'][dp]['actualpoint'] + "','" + devices[j]['datapoint'][dp]['multiply'] + "','" + devices[j]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[j]['datapoint'][dp]['objtype'] + "', '" + devices[j]['datapoint'][dp]['objinstance'] + "', " + records['recordsets'][0][j]['recordid'] + ", '" + devices[j]['datapoint'][dp]['isenergyvalue'] + "');"
                      } else {
                        query3 += "('" + deviceid + "','" + devices[j]['datapoint'][dp]['pointid'] + "','" + devices[j]['datapoint'][dp]['actualpoint'] + "','" + devices[j]['datapoint'][dp]['multiply'] + "','" + devices[j]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[j]['datapoint'][dp]['objtype'] + "', '" + devices[j]['datapoint'][dp]['objinstance'] + "', " + records['recordsets'][0][j]['recordid'] + ", '" + devices[j]['datapoint'][dp]['isenergyvalue'] + "'),"
                        //console.log(query3)

                      }
                    }
                  }
                  request.query(query3, function (err, records) {
                    if (err) {
                      console.log(query3);
                      return res.status(200).json('failed')

                    } else {

                      console.log('success');
                      return res.status(200).json('success')

                    }


                  })
                }

              })

              //&&&&&&
            }

          })


        } else {
          chkquery = "SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + deviceid + "'"

          request.query(chkquery, function (err, records) {
            if (err)
              console.log(chkquery);
            else {
              data = { 'status': 'success' }
              query3 = "INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "

              for (j = 0; j < records['recordsets'][0].length; j++) {
                for (dp = 0; dp < devices[j]['datapoint'].length; dp++) {
                  if (dp == devices[j]['datapoint'].length - 1) {
                    //records['recordsets'][0][j]
                    //console.log(query3)
                    query3 += "('" + deviceid + "','" + devices[j]['datapoint'][dp]['pointid'] + "','" + devices[j]['datapoint'][dp]['actualpoint'] + "','" + devices[j]['datapoint'][dp]['multiply'] + "','" + devices[j]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[j]['datapoint'][dp]['objtype'] + "', '" + devices[j]['datapoint'][dp]['objinstance'] + "', " + records['recordsets'][0][j]['recordid'] + ", '" + devices[j]['datapoint'][dp]['isenergyvalue'] + "');"
                  } else {
                    query3 += "('" + deviceid + "','" + devices[j]['datapoint'][dp]['pointid'] + "','" + devices[j]['datapoint'][dp]['actualpoint'] + "','" + devices[j]['datapoint'][dp]['multiply'] + "','" + devices[j]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[j]['datapoint'][dp]['objtype'] + "', '" + devices[j]['datapoint'][dp]['objinstance'] + "', " + records['recordsets'][0][j]['recordid'] + ", '" + devices[j]['datapoint'][dp]['isenergyvalue'] + "'),"
                    //console.log(query3)

                  }
                }
              }
              request.query(query3, function (err, records) {
                if (err) {
                  console.log(query3);
                  return res.status(200).json('failed')

                } else {

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



const postdatapoint_7_6_2024 = (req, res) => {
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
  for (i = 0; i < devices.length; i++) {
    if (i == devices.length - 1) {
      chkquery += " SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + devices[i]['deviceid'] + "' "
    } else {
      chkquery += " SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + devices[i]['deviceid'] + "' UNION ALL "
    }
  }

  chkquery += ") AS combined_results;"

  //console.log(chkquery)
  //return 0;
  existingDeviceId = []
  newDeviceId = []
  newDeviceTblRecordId = []
  sql.connect(config, function (err) {
    if (err)
      console.log(err)

    // make a request as

    var request = new sql.Request();

    request.query(chkquery, function (err, chkqueryrecords) {
      if (err)
        console.log(err);
      else {
        // }
        //if records present in device table pushing deviceids to an array
        newDeviceAndEqpmntAdded = 0
        for (total = 0; total < chkqueryrecords['recordsets'][0].length; total++) {
          val = chkqueryrecords['recordsets'][0][total].deviceid
          existingDeviceId.push(chkqueryrecords['recordsets'][0][total].deviceid)
        }
        query = ""
        newRecordAdded = 0
        //console.log(existingDeviceId)
        // return 0;
        //Createing insert query in case  at least a single device from json string does not exist in the device table
        for (i = 0; i < devices.length; i++) {
          if (existingDeviceId.includes(devices[i]['deviceid']) == false) {
            newRecordAdded = newRecordAdded + 1;
            query += " insert into [" + dbName + "].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values  ('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + devices[i]['ip'] + "', '" + devices[i]['port'] + "', '" + devices[i]['network'] + "', '" + devices[i]['manufacturer'] + "', '" + devices[i]['modelname'] + "');"
          }

        }
        // console.log(newRecordAdded)
        // return 0
        if (newRecordAdded > 0) {
          // console.log("IF is running as ")

          // return 0
          request.query(query, function (err, records) { // if no devices in the device table with the given device id then add new device here
            if (err)
              console.log(err);
            else {
              // Picking up records for newly added devices from the table
              query2 = "select * from ( select TOP (" + newRecordAdded + ")  recordid, deviceid FROM [" + dbName + "].[ECCAnalytics].[Devices] where equipmentname = '" + req.body.equipmentname + "' order by recordid DESC) devices_tbl order by devices_tbl.recordid;"
              query3 = ""
              request.query(query2, function (err, records) {
                if (err)
                  console.log(err);
                else {

                  for (total = 0; total < records['recordsets'][0].length; total++) {
                    val = records['recordsets'][0][total].deviceid
                    newDeviceId.push(records['recordsets'][0][total].deviceid)
                    newDeviceTblRecordId.push(records['recordsets'][0][total].recordid)
                  }
                  //console.log(newDeviceId);
                  //return 0

                  for (dvc = 0; dvc < devices.length; dvc++) {
                    if (newDeviceId.includes(devices[dvc]['deviceid']) == true) {// for newly added device id
                      //console.log('1st if for newly added device id')
                      //return 0
                      for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
                        if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
                          arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
                          query3 += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                          query3 += "('" + devices[dvc]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + newDeviceTblRecordId[arrayId] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"
                          //console.log(query3)
                        }
                      }
                      // console.log(query3)

                    } else if (newDeviceId.includes(devices[dvc]['deviceid']) != true) {
                      //console.log('else if')
                      // console.log(devices[dvc]['deviceid'])
                      //console.log(devices[dvc]['datapoint'].length)
                      for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
                        // console.log(devices[dvc]['datapoint'][dp])

                        if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
                          // query3 += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                          // query3 += "('"+devices[dvc]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+chkqueryrecords['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"


                          for (j = 0; j < chkqueryrecords['recordsets'][0].length; j++) {
                            //console.log(chkqueryrecords['recordsets'][0][j])
                            if (chkqueryrecords['recordsets'][0][j]['deviceid'] == devices[dvc]['deviceid']) {

                              //  for ( dp2=0; dp2<devices[dvc]['datapoint'].length;dp2++ ){

                              if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
                                //console.log('insert datapoint tbl value for existing deviceid in device tbl')
                                query3 += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                                // query3 += "('"+chkqueryrecords['recordsets'][0][j]['deviceid']+"','"+devices[j]['datapoint'][dp]['pointid']+"','"+devices[j]['datapoint'][dp]['actualpoint']+"','"+devices[j]['datapoint'][dp]['multiply']+"','"+devices[j]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[j]['datapoint'][dp]['objtype']+"', '"+devices[j]['datapoint'][dp]['objinstance']+"', "+chkqueryrecords['recordsets'][0][j]['recordid']+", '"+devices[j]['datapoint'][dp]['isenergyvalue']+"');"
                                //query3 += "('"+chkqueryrecords['recordsets'][0][j]['deviceid']+"','"+devices[dvc]['datapoint'][dp2]['pointid']+"','"+devices[dvc]['datapoint'][dp2]['actualpoint']+"','"+devices[dvc]['datapoint'][dp2]['multiply']+"','"+devices[dvc]['datapoint'][dp2]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp2]['objtype']+"', '"+devices[dvc]['datapoint'][dp2]['objinstance']+"', "+chkqueryrecords['recordsets'][0][j]['recordid']+", '"+devices[dvc]['datapoint'][dp2]['isenergyvalue']+"');"
                                query3 += "('" + chkqueryrecords['recordsets'][0][j]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + chkqueryrecords['recordsets'][0][j]['recordid'] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"
                              }
                              //      }
                            }

                          }
                          // console.log(query3)
                          //return 0 
                        } else {
                          // console.log('update datapoint tbl value for existing deviceid in device tbl')

                          for (j = 0; j < chkqueryrecords['recordsets'][0].length; j++) {
                            if (chkqueryrecords['recordsets'][0][j]['deviceid'] == devices[dvc]['deviceid']) {

                              //console.log(chkqueryrecords['recordsets'][0][j])
                              for (dpu = 0; dpu < devices[dvc]['datapoint'].length; dpu++) {
                                if (devices[dvc]['datapoint'][dpu]['datapointid'] != null) {

                                  // query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+deviceid+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+chkqueryrecords['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[j]['datapoint'][dp]['datapointid']+"; "
                                  // query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+devices[dvc]['deviceid']+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+chkqueryrecords['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dpu]['datapointid']+"; "
                                  // query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+devices[dvc]['deviceid']+"', pointid = '"+devices[dvc]['datapoint'][dpu]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dpu]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dpu]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dpu]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[dvc]['datapoint'][dpu]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dpu]['objinstance']+"',devicerecordid = "+chkqueryrecords['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[dvc]['datapoint'][dpu]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dpu]['datapointid']+"; "
                                  query3 += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + devices[dvc]['deviceid'] + "', pointid = '" + devices[dvc]['datapoint'][dpu]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dpu]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dpu]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dpu]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dpu]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dpu]['objinstance'] + "',devicerecordid = " + chkqueryrecords['recordsets'][0][j]['recordid'] + ",isenergyvalue = '" + devices[dvc]['datapoint'][dpu]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dpu]['datapointid'] + "; "
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
                  request.query(query3, function (err, records) {
                    if (err) {
                      console.log(err);
                      return res.status(200).json('failed')

                    } else {

                      // console.log('success');
                      return res.status(200).json('success')

                    }


                  })
                }

              })

            }

          })

        }


        else {   //Else case for  device and equipment are already present in the device table
          //console.log("else is running as device is already there")
          //return 0      
          query3 = ""
          for (j = 0; j < chkqueryrecords['recordsets'][0].length; j++) {
            // console.log(chkqueryrecords['recordsets'][0][j])
            for (dp = 0; dp < devices[j]['datapoint'].length; dp++) {
              if (devices[j]['datapoint'][dp]['datapointid'] == null) {
                query3 += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
                query3 += "('" + deviceid + "','" + devices[j]['datapoint'][dp]['pointid'] + "','" + devices[j]['datapoint'][dp]['actualpoint'] + "','" + devices[j]['datapoint'][dp]['multiply'] + "','" + devices[j]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[j]['datapoint'][dp]['objtype'] + "', '" + devices[j]['datapoint'][dp]['objinstance'] + "', " + chkqueryrecords['recordsets'][0][j]['recordid'] + ", '" + devices[j]['datapoint'][dp]['isenergyvalue'] + "');"
              } else {
                //query3 += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET deviceid = '"+deviceid+"', pointid = '"+devices[j]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[j]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[j]['datapoint'][dp]['multiply']+"', addition ='"+devices[j]['datapoint'][dp]['addition']+"',dated = CURRENT_TIMESTAMP, objtype = '"+devices[j]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[j]['datapoint'][dp]['objinstance']+"',devicerecordid = "+chkqueryrecords['recordsets'][0][j]['recordid']+",isenergyvalue = '"+devices[j]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[j]['datapoint'][dp]['datapointid']+"; "
                query3 += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + deviceid + "', pointid = '" + devices[j]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[j]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[j]['datapoint'][dp]['multiply'] + "', addition ='" + devices[j]['datapoint'][dp]['addition'] + "', objtype = '" + devices[j]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[j]['datapoint'][dp]['objinstance'] + "',devicerecordid = " + chkqueryrecords['recordsets'][0][j]['recordid'] + ",isenergyvalue = '" + devices[j]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[j]['datapoint'][dp]['datapointid'] + "; "

              }
            }

          }
          //console.log(query3)
          //return 0
          request.query(query3, function (err, records) {
            if (err) {
              console.log(query3);
              return res.status(200).json('failed')
            } else {
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

const postdatapoint_8_7_2024 = async (req, res) => {
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
  existingDeviceRecordId = []

  try {
    await sql.connect(config)
    var request = new sql.Request();

    chkquery = "SELECT *  FROM ("
    for (i = 0; i < devices.length; i++) {
      if (i == devices.length - 1) {
        chkquery += " SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + devices[i]['deviceid'] + "' "
      } else {
        chkquery += " SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + devices[i]['deviceid'] + "' UNION ALL "
      }
    }

    chkquery += ") AS combined_results;"

    //return 0

    chkqueryrecords = await request.query(chkquery)
    newRecordAdded = 0
    console.log(chkqueryrecords)
    //return 0

    existingDeviceIdWithRecordId = {}
    for (total = 0; total < chkqueryrecords['recordsets'][0].length; total++) {
      val = chkqueryrecords['recordsets'][0][total].deviceid
      existingDeviceId.push(chkqueryrecords['recordsets'][0][total].deviceid)
      existingDeviceRecordId.push(chkqueryrecords['recordsets'][0][total].recordid)
      existingDeviceIdWithRecordId[chkqueryrecords['recordsets'][0][total].deviceid] = chkqueryrecords['recordsets'][0][total].recordid;
    }

    console.log(existingDeviceIdWithRecordId)
    //console.log(existingDeviceIdWithRecordId[2537082])
    //return 0
    insertQueryForNewDevice = ''
    for (i = 0; i < devices.length; i++) {
      if (existingDeviceId.includes(devices[i]['deviceid']) != true) {
        insertQueryForNewDevice += " insert into [" + dbName + "].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values  ('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + devices[i]['ip'] + "', '" + devices[i]['port'] + "', '" + devices[i]['network'] + "', '" + devices[i]['manufacturer'] + "', '" + devices[i]['modelname'] + "');"
        newRecordAdded += 1
      }
    }

    console.log(insertQueryForNewDevice)

    //sql.close()
    //await sql.connect(config)

    /******************************************************************************************************** */

    if (newRecordAdded > 0) {
      await request.query(insertQueryForNewDevice)
      queryToPickLastAddedRecord = "select * from ( select TOP (" + newRecordAdded + ")  recordid, deviceid FROM [" + dbName + "].[ECCAnalytics].[Devices] where equipmentname = '" + req.body.equipmentname + "' order by recordid DESC) devices_tbl order by devices_tbl.recordid;"
      console.log()
      lastAddedRecord = await request.query(queryToPickLastAddedRecord)
      console.log(lastAddedRecord)
      for (total = 0; total < lastAddedRecord['recordsets'][0].length; total++) {
        val = lastAddedRecord['recordsets'][0][total].deviceid
        newDeviceId.push(lastAddedRecord['recordsets'][0][total].deviceid)
        newDeviceTblRecordId.push(lastAddedRecord['recordsets'][0][total].recordid)
      }

      // }

      console.log(newDeviceTblRecordId)


      // Existing Device

      DPAddQueryForOldDevice = ""


      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
              //arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              DPAddQueryForOldDevice += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              DPAddQueryForOldDevice += "('" + devices[dvc]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + existingDeviceIdWithRecordId[devices[dvc]['deviceid']] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"

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

      for (dvc = 0; dvc < devices.length; dvc++) {
        if (newDeviceId.includes(devices[dvc]['deviceid']) == true) {// for newly added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
              arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              DPAddQueryForNewlyAddedDevice += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              DPAddQueryForNewlyAddedDevice += "('" + devices[dvc]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + newDeviceTblRecordId[arrayId] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"

            }
          }
          //console.log(query3)

        }
      }

      await request.query(DPAddQueryForNewlyAddedDevice)


      //For newly added device and update datapoint with existing datapoint

      DPupdateQueryForNewlyAddedDevice = ""

      for (dvc = 0; dvc < devices.length; dvc++) {
        if (newDeviceId.includes(devices[dvc]['deviceid']) == true) {// for newly added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] != null) {
              arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              //DPAddQueryForNewlyAddedDevice += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              //DPAddQueryForNewlyAddedDevice += "('"+devices[dvc]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+newDeviceTblRecordId[arrayId]+", '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"');"
              DPupdateQueryForNewlyAddedDevice += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET  deviceid = '" + devices[dvc]['deviceid'] + "', pointid = '" + devices[dvc]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dp]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dp]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dp]['objinstance'] + "',devicerecordid = " + newDeviceTblRecordId[arrayId] + " ,isenergyvalue = '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "; "

            }
          }
          //console.log(query3)
        }
      }



      await request.query(DPupdateQueryForNewlyAddedDevice)


      // Update existing

      DPupdateQueryForOldDevice = ""
      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for update of already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] != null) {
              //DPupdateQueryForOldDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET  pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "
              DPupdateQueryForOldDevice += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + devices[dvc]['deviceid'] + "',  pointid = '" + devices[dvc]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dp]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dp]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dp]['objinstance'] + "',devicerecordid = " + existingDeviceIdWithRecordId[devices[dvc]['deviceid']] + ",isenergyvalue = '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "; "


            }
          }
          //console.log(query3)

        }
      }
      console.log(DPupdateQueryForOldDevice)

      await request.query(DPupdateQueryForOldDevice)

    } else {

      DPAddQueryForOldDevice = ""


      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
              //arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              DPAddQueryForOldDevice += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              DPAddQueryForOldDevice += "('" + devices[dvc]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + existingDeviceIdWithRecordId[devices[dvc]['deviceid']] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"

            }
          }
          //console.log(query3)

        }
      }
      await request.query(DPAddQueryForOldDevice)


      DPupdateQueryForOldDevice = ""
      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for update of already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] != null) {
              //DPupdateQueryForOldDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET  pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "
              DPupdateQueryForOldDevice += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + devices[dvc]['deviceid'] + "',  pointid = '" + devices[dvc]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dp]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dp]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dp]['objinstance'] + "',isenergyvalue = '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "; "

            }
          }
          //console.log(query3)

        }
      }

      await request.query(DPupdateQueryForOldDevice)


    }
    return res.status(200).json('success');


  } //end try block




  catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

  }



}


const postdatapoint_13_8_2024 = async (req, res) => {
  console.log(req.originalUrl);

  function findValueIndex(array, value) {
    const index = array.indexOf(value);
    return index !== -1 ? index : null;
  }

  dbName = config.databse

  modifier = req.query.modifier
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
  existingDeviceRecordId = []

  try {
    await sql.connect(config)
    var request = new sql.Request();

    chkquery = "SELECT *  FROM ("
    for (i = 0; i < devices.length; i++) {
      if (i == devices.length - 1) {
        chkquery += " SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + devices[i]['deviceid'] + "' "
      } else {
        chkquery += " SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + devices[i]['deviceid'] + "' UNION ALL "
      }
    }

    chkquery += ") AS combined_results;"

    //return 0

    chkqueryrecords = await request.query(chkquery)
    newRecordAdded = 0
    console.log(chkqueryrecords)
    //return 0

    existingDeviceIdWithRecordId = {}
    for (total = 0; total < chkqueryrecords['recordsets'][0].length; total++) {
      val = chkqueryrecords['recordsets'][0][total].deviceid
      existingDeviceId.push(chkqueryrecords['recordsets'][0][total].deviceid)
      existingDeviceRecordId.push(chkqueryrecords['recordsets'][0][total].recordid)
      existingDeviceIdWithRecordId[chkqueryrecords['recordsets'][0][total].deviceid] = chkqueryrecords['recordsets'][0][total].recordid;
    }

    console.log(existingDeviceIdWithRecordId)
    //console.log(existingDeviceIdWithRecordId[2537082])
    //return 0
    insertQueryForNewDevice = ''
    devicesAuditaddSQL = ""
    for (i = 0; i < devices.length; i++) {
      if (existingDeviceId.includes(devices[i]['deviceid']) != true) {
        insertQueryForNewDevice += " insert into [" + dbName + "].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values  ('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + devices[i]['ip'] + "', '" + devices[i]['port'] + "', '" + devices[i]['network'] + "', '" + devices[i]['manufacturer'] + "', '" + devices[i]['modelname'] + "');"
        devicesAuditaddSQL += " insert into [" + dbName + "].ECCAnalytics.DevicesAudit (equipmentname, deviceid, modifier, event, currentrecord, dated) values  ('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + modifier + "', 'add', '" + devices[i]['deviceid'] + "', CURRENT_TIMESTAMP); "
        newRecordAdded += 1
      }
    }

    console.log(insertQueryForNewDevice)

    //sql.close()
    //await sql.connect(config)

    /******************************************************************************************************** */

    if (newRecordAdded > 0) {
      await request.query(insertQueryForNewDevice)
      queryToPickLastAddedRecord = "select * from ( select TOP (" + newRecordAdded + ")  recordid, deviceid FROM [" + dbName + "].[ECCAnalytics].[Devices] where equipmentname = '" + req.body.equipmentname + "' order by recordid DESC) devices_tbl order by devices_tbl.recordid;"
      console.log()
      lastAddedRecord = await request.query(queryToPickLastAddedRecord)
      console.log(lastAddedRecord)
      for (total = 0; total < lastAddedRecord['recordsets'][0].length; total++) {
        val = lastAddedRecord['recordsets'][0][total].deviceid
        newDeviceId.push(lastAddedRecord['recordsets'][0][total].deviceid)
        newDeviceTblRecordId.push(lastAddedRecord['recordsets'][0][total].recordid)
      }

      // }

      console.log(newDeviceTblRecordId)


      // Existing Device

      DPAddQueryForOldDevice = ""


      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
              //arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              DPAddQueryForOldDevice += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              DPAddQueryForOldDevice += "('" + devices[dvc]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + existingDeviceIdWithRecordId[devices[dvc]['deviceid']] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"
              //DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', CURRENT_TIMESTAMP ); "
              DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "',CURRENT_TIMESTAMP ); "
              DPAddQueryForOldDevice += DpauditSQL
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

      for (dvc = 0; dvc < devices.length; dvc++) {
        if (newDeviceId.includes(devices[dvc]['deviceid']) == true) {// for newly added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
              arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              DPAddQueryForNewlyAddedDevice += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              DPAddQueryForNewlyAddedDevice += "('" + devices[dvc]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + newDeviceTblRecordId[arrayId] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"
              //DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', CURRENT_TIMESTAMP ); "
              DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "',CURRENT_TIMESTAMP ); "
              DPAddQueryForNewlyAddedDevice += DpauditSQL

            }
          }
          //console.log(query3)

        }
      }

      await request.query(DPAddQueryForNewlyAddedDevice)


      //For newly added device and update datapoint with existing datapoint

      DPupdateQueryForNewlyAddedDevice = ""

      for (dvc = 0; dvc < devices.length; dvc++) {
        if (newDeviceId.includes(devices[dvc]['deviceid']) == true) {// for newly added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] != null) {
              arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              //DPAddQueryForNewlyAddedDevice += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              //DPAddQueryForNewlyAddedDevice += "('"+devices[dvc]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+newDeviceTblRecordId[arrayId]+", '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"');"
              DPupdateQueryForNewlyAddedDevice += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET  deviceid = '" + devices[dvc]['deviceid'] + "', pointid = '" + devices[dvc]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dp]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dp]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dp]['objinstance'] + "',devicerecordid = " + newDeviceTblRecordId[arrayId] + " ,isenergyvalue = '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "; "
              //DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'update', CURRENT_TIMESTAMP ); "
              DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated,previousrecord ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "', "
              DpauditSQL += " '"+modifier+"', 'update', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "',CURRENT_TIMESTAMP,"
              DpauditSQL += " CONCAT((SELECT TOP (1) [pointid]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + ") , "
              DpauditSQL += "  ',',(SELECT TOP (1) [actualpoint]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [multiply]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [addition]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [objtype]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [objinstance]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "))  ); "
              
              DPupdateQueryForNewlyAddedDevice += DpauditSQL

            }
          }
          //console.log(query3)
        }
      }



      await request.query(DPupdateQueryForNewlyAddedDevice)


      // Update existing

      DPupdateQueryForOldDevice = ""
      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for update of already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] != null) {
              //DPupdateQueryForOldDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET  pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "
              DPupdateQueryForOldDevice += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + devices[dvc]['deviceid'] + "',  pointid = '" + devices[dvc]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dp]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dp]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dp]['objinstance'] + "',devicerecordid = " + existingDeviceIdWithRecordId[devices[dvc]['deviceid']] + ",isenergyvalue = '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "; "
             // DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'update', CURRENT_TIMESTAMP ); "
             DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated,previousrecord ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "', "
             DpauditSQL += " '"+modifier+"', 'update', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "', CURRENT_TIMESTAMP,"
             DpauditSQL += " CONCAT((SELECT TOP (1) [pointid]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + ") , "
             DpauditSQL += "  ',',(SELECT TOP (1) [actualpoint]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
             DpauditSQL += "  ',',(SELECT TOP (1) [multiply]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
             DpauditSQL += "  ',',(SELECT TOP (1) [addition]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
             DpauditSQL += "  ',',(SELECT TOP (1) [objtype]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
             DpauditSQL += "  ',',(SELECT TOP (1) [objinstance]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "))  ); "

             DPupdateQueryForOldDevice += DpauditSQL


            }
          }
          //console.log(query3)

        }
      }
      console.log(DPupdateQueryForOldDevice)

      await request.query(DPupdateQueryForOldDevice)

    } else {

      DPAddQueryForOldDevice = ""


      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
              //arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              DPAddQueryForOldDevice += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              DPAddQueryForOldDevice += "('" + devices[dvc]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + existingDeviceIdWithRecordId[devices[dvc]['deviceid']] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"
              //DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', CURRENT_TIMESTAMP ); "
              DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "',CURRENT_TIMESTAMP ); "
              DPAddQueryForOldDevice += DpauditSQL

            }
          }
          //console.log(query3)

        }
      }
      await request.query(DPAddQueryForOldDevice)


      DPupdateQueryForOldDevice = ""
      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for update of already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] != null) {
              //DPupdateQueryForOldDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET  pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "
              DPupdateQueryForOldDevice += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + devices[dvc]['deviceid'] + "',  pointid = '" + devices[dvc]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dp]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dp]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dp]['objinstance'] + "',isenergyvalue = '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "; "
              //DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'update', CURRENT_TIMESTAMP ); "
              DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated,previousrecord ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "', "
              DpauditSQL += " '"+modifier+"', 'update', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "', CURRENT_TIMESTAMP,"
              DpauditSQL += " CONCAT((SELECT TOP (1) [pointid]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + ") , "
              DpauditSQL += "  ',',(SELECT TOP (1) [actualpoint]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [multiply]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [addition]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [objtype]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [objinstance]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "))  ); "

              DPupdateQueryForOldDevice += DpauditSQL

            }
          }
          //console.log(query3)

        }
      }

      await request.query(DPupdateQueryForOldDevice)


    }
    return res.status(200).json('success');


  } //end try block




  catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

  }



}


const postdatapoint = async (req, res) => {
  console.log(req.originalUrl);

  function findValueIndex(array, value) {
    const index = array.indexOf(value);
    return index !== -1 ? index : null;
  }

  dbName = config.databse

  modifier = req.query.modifier
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
  existingDeviceRecordId = []

  try {
    await sql.connect(config)
    var request = new sql.Request();

    chkquery = "SELECT *  FROM ("
    for (i = 0; i < devices.length; i++) {
      if (i == devices.length - 1) {
        chkquery += " SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + devices[i]['deviceid'] + "' "
      } else {
        chkquery += " SELECT * FROM [" + dbName + "].ECCAnalytics.Devices where equipmentname ='" + req.body.equipmentname + "' and deviceid = '" + devices[i]['deviceid'] + "' UNION ALL "
      }
    }

    chkquery += ") AS combined_results;"

    //return 0

    chkqueryrecords = await request.query(chkquery)
    newRecordAdded = 0
    console.log(chkqueryrecords)
    //return 0

    existingDeviceIdWithRecordId = {}
    for (total = 0; total < chkqueryrecords['recordsets'][0].length; total++) {
      val = chkqueryrecords['recordsets'][0][total].deviceid
      existingDeviceId.push(chkqueryrecords['recordsets'][0][total].deviceid)
      existingDeviceRecordId.push(chkqueryrecords['recordsets'][0][total].recordid)
      existingDeviceIdWithRecordId[chkqueryrecords['recordsets'][0][total].deviceid] = chkqueryrecords['recordsets'][0][total].recordid;
    }

    console.log(existingDeviceIdWithRecordId)
    //console.log(existingDeviceIdWithRecordId[2537082])
    //return 0
    insertQueryForNewDevice = ''
    devicesAuditaddSQL = ""
    for (i = 0; i < devices.length; i++) {
      if (existingDeviceId.includes(devices[i]['deviceid']) != true) {
        insertQueryForNewDevice += " insert into [" + dbName + "].ECCAnalytics.Devices (equipmentname, deviceid, ip, port, network, manufacturer,modelname) values  ('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + devices[i]['ip'] + "', '" + devices[i]['port'] + "', '" + devices[i]['network'] + "', '" + devices[i]['manufacturer'] + "', '" + devices[i]['modelname'] + "');"
        devicesAuditaddSQL += " insert into [" + dbName + "].ECCAnalytics.DevicesAudit (equipmentname, deviceid, modifier, event, currentrecord, dated) values  ('" + req.body.equipmentname + "', '" + devices[i]['deviceid'] + "', '" + modifier + "', 'add', '" + devices[i]['deviceid'] + "', CURRENT_TIMESTAMP); "
        newRecordAdded += 1
      }
    }

    console.log(insertQueryForNewDevice)

    //sql.close()
    //await sql.connect(config)

    /******************************************************************************************************** */

    if (newRecordAdded > 0) {
      await request.query(insertQueryForNewDevice)
      queryToPickLastAddedRecord = "select * from ( select TOP (" + newRecordAdded + ")  recordid, deviceid FROM [" + dbName + "].[ECCAnalytics].[Devices] where equipmentname = '" + req.body.equipmentname + "' order by recordid DESC) devices_tbl order by devices_tbl.recordid;"
      console.log()
      lastAddedRecord = await request.query(queryToPickLastAddedRecord)
      console.log(lastAddedRecord)
      for (total = 0; total < lastAddedRecord['recordsets'][0].length; total++) {
        val = lastAddedRecord['recordsets'][0][total].deviceid
        newDeviceId.push(lastAddedRecord['recordsets'][0][total].deviceid)
        newDeviceTblRecordId.push(lastAddedRecord['recordsets'][0][total].recordid)
      }

      // }

      console.log(newDeviceTblRecordId)


      // Existing Device

      DPAddQueryForOldDevice = ""


      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
              //arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              DPAddQueryForOldDevice += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              DPAddQueryForOldDevice += "('" + devices[dvc]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + existingDeviceIdWithRecordId[devices[dvc]['deviceid']] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"
              //DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', CURRENT_TIMESTAMP ); "
              DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "',CURRENT_TIMESTAMP ); "
              DPAddQueryForOldDevice += DpauditSQL
            }
          }
          //console.log(query3)
          console.log(1)
        }
      }

      console.log(DPAddQueryForOldDevice)
      await request.query(DPAddQueryForOldDevice)


      //return 0
      // Newly added Device


      DPAddQueryForNewlyAddedDevice = ""

      for (dvc = 0; dvc < devices.length; dvc++) {
        if (newDeviceId.includes(devices[dvc]['deviceid']) == true) {// for newly added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
              arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              DPAddQueryForNewlyAddedDevice += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              DPAddQueryForNewlyAddedDevice += "('" + devices[dvc]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + newDeviceTblRecordId[arrayId] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"
              //DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', CURRENT_TIMESTAMP ); "
              DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "',CURRENT_TIMESTAMP ); "
              DPAddQueryForNewlyAddedDevice += DpauditSQL

            }
          }
          //console.log(query3)
          console.log(2)
        }
      }

      await request.query(DPAddQueryForNewlyAddedDevice)


      //For newly added device and update datapoint with existing datapoint

      DPupdateQueryForNewlyAddedDevice = ""

      for (dvc = 0; dvc < devices.length; dvc++) {
        if (newDeviceId.includes(devices[dvc]['deviceid']) == true) {// for newly added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] != null) {
              arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              //DPAddQueryForNewlyAddedDevice += " INSERT INTO ["+dbName+"].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              //DPAddQueryForNewlyAddedDevice += "('"+devices[dvc]['deviceid']+"','"+devices[dvc]['datapoint'][dp]['pointid']+"','"+devices[dvc]['datapoint'][dp]['actualpoint']+"','"+devices[dvc]['datapoint'][dp]['multiply']+"','"+devices[dvc]['datapoint'][dp]['addition']+"', CURRENT_TIMESTAMP, '"+devices[dvc]['datapoint'][dp]['objtype']+"', '"+devices[dvc]['datapoint'][dp]['objinstance']+"', "+newDeviceTblRecordId[arrayId]+", '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"');"
              DPupdateQueryForNewlyAddedDevice += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET  deviceid = '" + devices[dvc]['deviceid'] + "', pointid = '" + devices[dvc]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dp]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dp]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dp]['objinstance'] + "',devicerecordid = " + newDeviceTblRecordId[arrayId] + " ,isenergyvalue = '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "; "
              //DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'update', CURRENT_TIMESTAMP ); "
              DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated,previousrecord ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "', "
              DpauditSQL += " '"+modifier+"', 'update', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "',CURRENT_TIMESTAMP,"
              DpauditSQL += " CONCAT((SELECT TOP (1) [pointid]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + ") , "
              DpauditSQL += "  ',',(SELECT TOP (1) [actualpoint]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [multiply]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [addition]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [objtype]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [objinstance]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "))  ); "
              
              DPupdateQueryForNewlyAddedDevice += DpauditSQL

            }
          }
          //console.log(query3)
          console.log(3)

        }
      }



      await request.query(DPupdateQueryForNewlyAddedDevice)


      // Update existing

      DPupdateQueryForOldDevice = ""
      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for update of already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] != null) {
              //DPupdateQueryForOldDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET  pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "
              DPupdateQueryForOldDevice += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + devices[dvc]['deviceid'] + "',  pointid = '" + devices[dvc]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dp]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dp]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dp]['objinstance'] + "',devicerecordid = " + existingDeviceIdWithRecordId[devices[dvc]['deviceid']] + ",isenergyvalue = '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "; "
             // DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'update', CURRENT_TIMESTAMP ); "
             DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated,previousrecord ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "', "
             DpauditSQL += " '"+modifier+"', 'update', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "', CURRENT_TIMESTAMP,"
             DpauditSQL += " CONCAT((SELECT TOP (1) [pointid]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + ") , "
             DpauditSQL += "  ',',(SELECT TOP (1) [actualpoint]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
             DpauditSQL += "  ',',(SELECT TOP (1) [multiply]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
             DpauditSQL += "  ',',(SELECT TOP (1) [addition]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
             DpauditSQL += "  ',',(SELECT TOP (1) [objtype]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
             DpauditSQL += "  ',',(SELECT TOP (1) [objinstance]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "))  ); "

             DPupdateQueryForOldDevice += DpauditSQL


            }
          }
          //console.log(query3)
          console.log(4)

        }
      }
      console.log(DPupdateQueryForOldDevice)

      await request.query(DPupdateQueryForOldDevice)

    } else {

      DPAddQueryForOldDevice = ""


      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] == null) {
              //arrayId = findValueIndex(newDeviceId, devices[dvc]['deviceid'])
              DPAddQueryForOldDevice += " INSERT INTO [" + dbName + "].ECCAnalytics.DataPoint ( deviceid, pointid,actualpoint,multiply,addition,dated,objtype,objinstance,devicerecordid,isenergyvalue) VALUES "
              DPAddQueryForOldDevice += "('" + devices[dvc]['deviceid'] + "','" + devices[dvc]['datapoint'][dp]['pointid'] + "','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','" + devices[dvc]['datapoint'][dp]['multiply'] + "','" + devices[dvc]['datapoint'][dp]['addition'] + "', CURRENT_TIMESTAMP, '" + devices[dvc]['datapoint'][dp]['objtype'] + "', '" + devices[dvc]['datapoint'][dp]['objinstance'] + "', " + existingDeviceIdWithRecordId[devices[dvc]['deviceid']] + ", '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "');"
              //DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', CURRENT_TIMESTAMP ); "
              DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated ) values((SELECT TOP (1) [datapointid]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] order by datapointid desc ), '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'add', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "',CURRENT_TIMESTAMP ); "
              DPAddQueryForOldDevice += DpauditSQL

            }
          }
          //console.log(query3)
          console.log(5)

        }
      }
      await request.query(DPAddQueryForOldDevice)


      DPupdateQueryForOldDevice = ""
      for (dvc = 0; dvc < devices.length; dvc++) {
        if (existingDeviceId.includes(devices[dvc]['deviceid']) == true) {// for update of already added device id
          for (dp = 0; dp < devices[dvc]['datapoint'].length; dp++) {
            if (devices[dvc]['datapoint'][dp]['datapointid'] != null) {
              //DPupdateQueryForOldDevice += " UPDATE ["+dbName+"].[ECCAnalytics].[DataPoint] SET  pointid = '"+devices[dvc]['datapoint'][dp]['pointid']+"',actualpoint = '"+devices[dvc]['datapoint'][dp]['actualpoint']+"',multiply = '"+devices[dvc]['datapoint'][dp]['multiply']+"', addition ='"+devices[dvc]['datapoint'][dp]['addition']+"', objtype = '"+devices[dvc]['datapoint'][dp]['objtype']+"',objinstance = '"+devices[dvc]['datapoint'][dp]['objinstance']+"',isenergyvalue = '"+devices[dvc]['datapoint'][dp]['isenergyvalue']+"' where datapointid = "+devices[dvc]['datapoint'][dp]['datapointid']+"; "
              //DPupdateQueryForOldDevice += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + devices[dvc]['deviceid'] + "',  pointid = '" + devices[dvc]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dp]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dp]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dp]['objinstance'] + "',isenergyvalue = '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "; "
              DPupdateQueryForOldDevice += " UPDATE [" + dbName + "].[ECCAnalytics].[DataPoint] SET deviceid = '" + devices[dvc]['deviceid'] + "',  pointid = '" + devices[dvc]['datapoint'][dp]['pointid'] + "',actualpoint = '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "',multiply = '" + devices[dvc]['datapoint'][dp]['multiply'] + "', addition ='" + devices[dvc]['datapoint'][dp]['addition'] + "', objtype = '" + devices[dvc]['datapoint'][dp]['objtype'] + "',objinstance = '" + devices[dvc]['datapoint'][dp]['objinstance'] + "',devicerecordid = '"+existingDeviceIdWithRecordId[devices[dvc]['deviceid']]+"', isenergyvalue = '" + devices[dvc]['datapoint'][dp]['isenergyvalue'] + "' where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "; "
              //DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "','"+modifier+"', 'update', CURRENT_TIMESTAMP ); "
              DpauditSQL = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,currentrecord,dated,previousrecord ) values('" + devices[dvc]['datapoint'][dp]['datapointid'] + "', '"+devices[dvc]['datapoint'][dp]['pointid']+"','" + devices[dvc]['datapoint'][dp]['actualpoint'] + "', "
              DpauditSQL += " '"+modifier+"', 'update', '" + devices[dvc]['datapoint'][dp]['actualpoint'] + "," + devices[dvc]['datapoint'][dp]['multiply'] + "," + devices[dvc]['datapoint'][dp]['addition'] + "," + devices[dvc]['datapoint'][dp]['objinstance'] + "," + devices[dvc]['datapoint'][dp]['objtype'] + "', CURRENT_TIMESTAMP,"
              DpauditSQL += " CONCAT((SELECT TOP (1) [pointid]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + ") , "
              DpauditSQL += "  ',',(SELECT TOP (1) [actualpoint]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [multiply]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [addition]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [objtype]  FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "), "
              DpauditSQL += "  ',',(SELECT TOP (1) [objinstance]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = " + devices[dvc]['datapoint'][dp]['datapointid'] + "))  ); "

              DPupdateQueryForOldDevice += DpauditSQL
              
            }
          }
          //console.log(query3)
          console.log(6)

        }
      }

      await request.query(DPupdateQueryForOldDevice)


    }
    return res.status(200).json('success');


  } //end try block




  catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

  }



}



const addsubequipment_7_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  equipmenttype = req.body.equipmenttype
  subequipmenttype = req.body.subequipmenttype
  query = "INSERT INTO [" + dbName + "].ECCAnalytics.SubEquipments (equipmenttype,subequipmenttype) VALUES ('" + equipmenttype + "','" + subequipmenttype + "')"

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        data = { 'status': 'success' }
        return res.status(200).json(data)
      }

    }

    )
  })
}


const addsubequipment = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  try {
    equipmenttype = req.body.equipmenttype
    subequipmenttype = req.body.subequipmenttype

    await pool.connect();
    const request = pool.request();

    query = "INSERT INTO [" + dbName + "].ECCAnalytics.SubEquipments (equipmenttype,subequipmenttype) VALUES ('" + equipmenttype + "','" + subequipmenttype + "')"
    await request.query(query)
    data = { 'status': 'success' }
    return res.status(200).json(data)
  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }

}


const addequipment_7_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  equipmenttype = req.body.equipmenttype
  query = "INSERT INTO [" + dbName + "].ECCAnalytics.Equipments_Old (equipmenttype) VALUES ('" + equipmenttype + "')"

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        data = { 'status': 'success' }
        return res.status(200).json(data)
      }

    }

    )
  })
}


const addequipment = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  try {
    equipmenttype = req.body.equipmenttype

    await pool.connect();
    const request = pool.request();

    query = "INSERT INTO [" + dbName + "].ECCAnalytics.Equipments_Old (equipmenttype) VALUES ('" + equipmenttype + "')"
    await request.query(query)
    data = { 'status': 'success' }
    return res.status(200).json(data)
  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }

}

const equipmentlist_old = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  eqp = req.query.eqp



  sql.connect(config, function (err) {
    if (err) conole.log(err)


    var request = new sql.Request();


    //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
    query = "SELECT [recordid],[equipmentid],[equipmenttype] FROM [" + dbName + "].ECCAnalytics.Equipments"
    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        return res.status(200).json(records['recordsets'][0])
      }

    }

    )
  })
}


const equipmentlist = async (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse

  // eqp = req.query.eqp


  try {

    await sql.connect(config)


    var request = new sql.Request();


    //query = "SELECT [recordid],[countryname] FROM ["+dbName+"].[ECCAnalytics].[Countries]"
    query = "SELECT [recordid],[equipmentid],[equipmenttype] FROM [" + dbName + "].ECCAnalytics.Equipments"
    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])


  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

  }
}



const updateproject_4_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse
  recordid = req.query.recordid

  query = "update [" + dbName + "].[ECCAnalytics].[Project]  set ";
  flag = 0

  if (typeof req.body.equipmentname !== 'undefined') {
    equipmentname = req.body.equipmentname
    if (flag == 0) {
      query += " [equipmentname] = '" + req.body.equipmentname + "'";
      flag = 1
    }
    else
      query += ", [equipmentname] = '" + req.body.equipmentname + "'";

    flag = 1

  }


  if (typeof req.body.equipmentid !== 'undefined') {
    equipmentid = req.body.equipmentid
    if (flag == 0) {
      query += " [equipmentid] = '" + req.body.equipmentid + "'";
      flag = 1
    }
    else
      query += ", [equipmentid] = '" + req.body.equipmentid + "'";


  }

  if (typeof req.body.associatedequipid !== 'undefined') {
    associatedequipid = req.body.associatedequipid
    if (flag == 0) {
      query += " [associatedequipid] = '" + req.body.associatedequipid + "'";
      flag = 1
    }
    else
      query += ", [associatedequipid] = '" + req.body.associatedequipid + "'";



  }


  if (typeof req.body.associatedequipdesc !== 'undefined') {
    associatedequipdesc = req.body.associatedequipdesc
    if (flag == 0) {
      query += " [associatedequipdesc] = '" + req.body.associatedequipdesc + "'";
      flag = 1
    }
    else
      query += ", [associatedequipdesc] = '" + req.body.associatedequipdesc + "'";


  }



  if (typeof req.body.users !== 'undefined') {
    users = req.body.users
    if (flag == 0) {
      query += " [users] = '" + req.body.users + "'";
      flag = 1
    }
    else
      query += ", [users] = '" + req.body.users + "'";


  }


  query += " where recordid = '" + recordid + "'";


  /*
    if (typeof req.body.pswd !== 'undefined' && typeof req.body.roles !== 'undefined') {
      pswd = req.body.pswd
  
     query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"', [roles] = '"+req.body.roles+"' where username = '"+username+"'";
  
    }
  
    */
  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    request.query(query, function (err, records) {
      if (err) {
        console.log(query);
        return res.status(200).json('failed')

      } else {

        console.log('success');
        console.log(query);
        return res.status(200).json('success')

      }


    })
  })


}


const updateproject = async (req, res) => {
  console.log(req.originalUrl);
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  recordid = req.query.recordid
  modifier = req.query.modifier

  try {
    await pool.connect();
    const request = pool.request();

    projectDataSql = "select * from [" + dbName + "].[ECCAnalytics].[Project] where recordid = " + recordid + "; "
    projectRecordsObj = await request.query(projectDataSql)
    projectRecordsData = projectRecordsObj['recordsets'][0][0]

    query = "update [" + dbName + "].[ECCAnalytics].[Project]  set ";
    flag = 0
    previousRecordData = ""
    currentRecordData = ""
    if (typeof req.body.equipmentname !== 'undefined') {

      equipmentname = req.body.equipmentname
      if (flag == 0) {
        query += " [equipmentname] = '" + req.body.equipmentname + "'";
        previousRecordData += projectRecordsData.equipmentname
        currentRecordData += req.body.equipmentname
        flag = 1
      }
      else {
        query += ", [equipmentname] = '" + req.body.equipmentname + "'";
        previousRecordData += ", " + projectRecordsData.equipmentname
        currentRecordData += ", " + req.body.equipmentname
      }
      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + projectRecordsData.equipmentname + "', '" + recordid + "','update','" + previousRecordData + "','" + currentRecordData + "',CURRENT_TIMESTAMP); "
      flag = 1

    }


    if (typeof req.body.equipmentid !== 'undefined') {
      equipmentid = req.body.equipmentid
      if (flag == 0) {
        query += " [equipmentid] = '" + req.body.equipmentid + "'";
        previousRecordData += projectRecordsData.equipmentid
        currentRecordData += req.body.equipmentid
        flag = 1
      }
      else {
        query += ", [equipmentid] = '" + req.body.equipmentid + "'";
        previousRecordData += ", " + projectRecordsData.equipmentid
        currentRecordData += ", " + req.body.equipmentid
      }
      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + projectRecordsData.equipmentname + "', '" + recordid + "','update','" + previousRecordData + "','" + currentRecordData + "',CURRENT_TIMESTAMP); "

    }

    if (typeof req.body.associatedequipid !== 'undefined') {
      associatedequipid = req.body.associatedequipid
      if (flag == 0) {
        query += " [associatedequipid] = '" + req.body.associatedequipid + "'";
        previousRecordData += projectRecordsData.associatedequipid
        currentRecordData += req.body.associatedequipid
        flag = 1
      }
      else {
        query += ", [associatedequipid] = '" + req.body.associatedequipid + "'";
        previousRecordData += ", " + projectRecordsData.associatedequipid
        currentRecordData += ", " + req.body.associatedequipid
      }
      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + projectRecordsData.equipmentname + "', '" + recordid + "','update','" + previousRecordData + "','" + currentRecordData + "',CURRENT_TIMESTAMP); "


    }


    if (typeof req.body.associatedequipdesc !== 'undefined') {
      associatedequipdesc = req.body.associatedequipdesc
      if (flag == 0) {
        query += " [associatedequipdesc] = '" + req.body.associatedequipdesc + "'";
        previousRecordData += projectRecordsData.associatedequipdesc
        currentRecordData += req.body.associatedequipdesc
        flag = 1
      }
      else {
        query += ", [associatedequipdesc] = '" + req.body.associatedequipdesc + "'";
        previousRecordData += ", " + projectRecordsData.associatedequipdesc
        currentRecordData += ", " + req.body.associatedequipdesc
      }

      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + projectRecordsData.equipmentname + "', '" + recordid + "','update','" + previousRecordData + "','" + currentRecordData + "',CURRENT_TIMESTAMP); "
    }



    if (typeof req.body.equipmentdesc !== 'undefined') {
      equipmentdesc = req.body.equipmentdesc
      if (flag == 0) {
        query += " [equipmentdesc] = '" + req.body.equipmentdesc + "'";
        previousRecordData += projectRecordsData.equipmentdesc
        currentRecordData += req.body.equipmentdesc
        flag = 1
      }
      else {
        query += ", [equipmentdesc] = '" + req.body.equipmentdesc + "'";
        previousRecordData += ", " + projectRecordsData.equipmentdesc
        currentRecordData += ", " + req.body.equipmentdesc
      }

      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + projectRecordsData.equipmentname + "', '" + recordid + "','update','" + previousRecordData + "','" + currentRecordData + "',CURRENT_TIMESTAMP); "
    }


    if (typeof req.body.users !== 'undefined') {
      users = req.body.users
      if (flag == 0) {
        query += " [users] = '" + req.body.users + "'";
        previousRecordData += projectRecordsData.user
        currentRecordData += req.body.users
        flag = 1
      }
      else {
        query += ", [users] = '" + req.body.users + "'";
        previousRecordData += ", " + projectRecordsData.users
        currentRecordData += ", " + req.body.users
      }
      updateprojectaudit_query = " INSERT INTO [" + dbName + "].ECCAnalytics.ProjectAudit (modifier,equipmentname,projectrecordid,event,previousrecord,currentrecord,dated) VALUES ('" + modifier + "','" + projectRecordsData.equipmentname + "', '" + recordid + "','update','" + previousRecordData + "','" + currentRecordData + "',CURRENT_TIMESTAMP); "

    }


    query += " where recordid = '" + recordid + "'";


    query += updateprojectaudit_query

    await request.query(query)
    return res.status(200).json('success');

  } catch (err) {
    console.error(err);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}


const getdatapointsforconfig_7_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  //ruleid = req.body.ruleid
  dbName = config.databse

  eqpname = req.query.eqpname
  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //query = "SELECT [datapointid],[deviceid],[pointid],[actualpoint],[multiply],[addition],[dated],[objtype],[objinstance],[devicerecordid] FROM ["+dbName+"].[ECCAnalytics].DataPoint WHERE devicerecordid in (SELECT [recordid] FROM ["+dbName+"].[ECCAnalytics].[Devices] where equipmentname = '"+eqpname+"');"
    query = "SELECT DV.[equipmentname],DV.[deviceid],DV.[ip],DV.[port],DV.[network],DV.[manufacturer],DV.[modelname],[datapointid],[pointid],[actualpoint],[multiply],[addition],[dated],[objtype],[objinstance],[devicerecordid],[isenergyvalue] FROM [" + dbName + "].[ECCAnalytics].DataPoint DP "
    query += " left join [" + dbName + "].[ECCAnalytics].[Devices] DV on [DP].[devicerecordid] = [DV].[recordid] where DV.equipmentname = '" + eqpname + "';"
    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        // return res.status(200).json(records['recordsets'][0])
        console.log(query)
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          //data.push({datapointid: records['recordsets'][0][i]['datapointid'],deviceid: records['recordsets'][0][i]['deviceid'],datapoint: records['recordsets'][0][i]['datapoint'],actualpoint: records['recordsets'][0][i]['actualpoint'], multiply: records['recordsets'][0][i]['multiply'],addition: records['recordsets'][0][i]['addition'],time: records['recordsets'][0][i]['dated'],type: records['recordsets'][0][i]['objtype'],instance: records['recordsets'][0][i]['objinstance']});
          data.push({ datapointid: records['recordsets'][0][i]['datapointid'], deviceid: records['recordsets'][0][i]['deviceid'], pointid: records['recordsets'][0][i]['pointid'], actualpoint: records['recordsets'][0][i]['actualpoint'], multiply: records['recordsets'][0][i]['multiply'], addition: records['recordsets'][0][i]['addition'], time: records['recordsets'][0][i]['dated'], objtype: records['recordsets'][0][i]['objtype'], objinstance: records['recordsets'][0][i]['objinstance'], devicerecordid: records['recordsets'][0][i]['devicerecordid'] });
          //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
        }

        return res.status(200).json(records['recordsets'][0])
      }

    }

    )
  })
}



const getdatapointsforconfig = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  try {
    await pool.connect();
    const request = pool.request();

    eqpname = req.query.eqpname
    query = "SELECT DV.[equipmentname],DV.[deviceid],DV.[ip],DV.[port],DV.[network],DV.[manufacturer],DV.[modelname],[datapointid],[pointid],[actualpoint],[multiply],[addition],[dated],[objtype],[objinstance],[devicerecordid],[isenergyvalue] FROM [" + dbName + "].[ECCAnalytics].DataPoint DP "
    query += " left join [" + dbName + "].[ECCAnalytics].[Devices] DV on [DP].[devicerecordid] = [DV].[recordid] where DV.equipmentname = '" + eqpname + "';"
    records = await request.query(query)

    var data = [];
    for (var i = 0; i < records['recordsets'][0].length; i++) {
      //data.push({datapointid: records['recordsets'][0][i]['datapointid'],deviceid: records['recordsets'][0][i]['deviceid'],datapoint: records['recordsets'][0][i]['datapoint'],actualpoint: records['recordsets'][0][i]['actualpoint'], multiply: records['recordsets'][0][i]['multiply'],addition: records['recordsets'][0][i]['addition'],time: records['recordsets'][0][i]['dated'],type: records['recordsets'][0][i]['objtype'],instance: records['recordsets'][0][i]['objinstance']});
      data.push({ datapointid: records['recordsets'][0][i]['datapointid'], deviceid: records['recordsets'][0][i]['deviceid'], pointid: records['recordsets'][0][i]['pointid'], actualpoint: records['recordsets'][0][i]['actualpoint'], multiply: records['recordsets'][0][i]['multiply'], addition: records['recordsets'][0][i]['addition'], time: records['recordsets'][0][i]['dated'], objtype: records['recordsets'][0][i]['objtype'], objinstance: records['recordsets'][0][i]['objinstance'], devicerecordid: records['recordsets'][0][i]['devicerecordid'] });
      //DATA.    ({'recordid': row[0],'projname': row[1],'projdesc' : row[2],'countryname' : row[3],'countrydesc' : row[4],'cityname' : row[5],'citydesc' : row[6],'campusname' : row[7],'campusdesc' : row[8],'buildingname' : row[9],'buildingdesc' : row[10],'equipmentname' : row[11],'equipmenttype' : row[12],'subequipmentname' : row[13],'subequipmentdesc' : row[14]})
    }
    return res.status(200).json(records['recordsets'][0])
  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }

}


const updatedatapoint_7_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse
  //  username = req.body.username
  datapointid = req.query.datapointid
  query = ""
  if (typeof req.body.multiply !== 'undefined') {
    multiply = req.body.multiply

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"'where username = '"+username+"'";
    query = "update [" + dbName + "].[ECCAnalytics].[DataPoint]  set [multiply] = '" + req.body.multiply + "'where datapointid = '" + datapointid + "'";

  }


  if (typeof req.body.addition !== 'undefined') {

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
    query = "update [" + dbName + "].[ECCAnalytics].[DataPoint]  set [addition] = '" + req.body.addition + "' where datapointid = '" + datapointid + "'";

  }


  if (typeof req.body.multiply !== 'undefined' && typeof req.body.addition !== 'undefined') {

    query = "update [" + dbName + "].[ECCAnalytics].[DataPoint]  set [multiply] = '" + req.body.multiply + "', [addition] = '" + req.body.addition + "' where datapointid = '" + datapointid + "'";

  }

  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    request.query(query, function (err, records) {
      if (err) {
        console.log(query);
        return res.status(200).json('failed')

      } else {

        console.log(query);
        return res.status(200).json('success')

      }


    })
  })


}


const updatedatapoint = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);
  //  username = req.body.username

  try {
    await pool.connect();
    const request = pool.request();

    datapointid = req.query.datapointid
    query = ""
    if (typeof req.body.multiply !== 'undefined') {
      multiply = req.body.multiply

      //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"'where username = '"+username+"'";
      query = "update [" + dbName + "].[ECCAnalytics].[DataPoint]  set [multiply] = '" + req.body.multiply + "'where datapointid = '" + datapointid + "'";

    }


    if (typeof req.body.addition !== 'undefined') {

      //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [pswd] = '"+req.body.pswd+"' where username = '"+username+"'";
      query = "update [" + dbName + "].[ECCAnalytics].[DataPoint]  set [addition] = '" + req.body.addition + "' where datapointid = '" + datapointid + "'";

    }


    if (typeof req.body.multiply !== 'undefined' && typeof req.body.addition !== 'undefined') {

      query = "update [" + dbName + "].[ECCAnalytics].[DataPoint]  set [multiply] = '" + req.body.multiply + "', [addition] = '" + req.body.addition + "' where datapointid = '" + datapointid + "'";

    }

    records = await request.query(query)
    return res.status(200).json('success')


  } catch (err) {
    return res.status(200).json('failed')
  } finally {
    // Close the connection pool
    pool.close();
  }



}


const deletedatapoint_7_7_2024 = (req, res) => {
  console.log(req.originalUrl);

  dbName = config.databse
  //  username = req.body.username
  datapointid = req.query.datapointid
  query = ""
  if (typeof req.query.datapointid !== 'undefined') {

    //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"'where username = '"+username+"'";
    query = "delete from [" + dbName + "].[ECCAnalytics].[DataPoint]  where datapointid = '" + datapointid + "'";

  } else {
    return res.status(200).json('failed')


  }


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    request.query(query, function (err, records) {
      if (err) {
        console.log(query);
        return res.status(200).json('failed')

      } else {

        console.log(query);
        return res.status(200).json('success')

      }


    })
  })


}


const deletedatapoint = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  //  username = req.body.username
  modifier = req.query.modifier
  datapointid = req.query.datapointid




  try {
    await pool.connect();
    const request = pool.request();

    query = ""
    if (typeof req.query.datapointid !== 'undefined') {

      //query = "update ["+dbName+"].[ECCAnalytics].[Users]  set [roles] = '"+req.body.roles+"'where username = '"+username+"'";
      query = "delete from [" + dbName + "].[ECCAnalytics].[DataPoint]  where datapointid = '" + datapointid + "'; ";
      auditquery = " insert into [" + dbName + "].[ECCAnalytics].[DataPointAudit] (datapointid,pointid, actualpoint,modifier,event,dated ) values('" + datapointid + "',(SELECT [pointid]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = '" + datapointid + "'),(SELECT [actualpoint]  FROM  [" + dbName + "].[ECCAnalytics].[DataPoint] where datapointid = '" + datapointid + "'),'"+modifier+"', 'delete', CURRENT_TIMESTAMP ); "
      auditquery += query
    } else {
      return res.status(200).json('failed')
    }

    await request.query(auditquery)
    console.log(auditquery)
    return res.status(200).json('success')

  } catch (err) {
    return res.status(200).json('failed')
  } finally {
    // Close the connection pool
    pool.close();
  }



}


const updateuserpassword_7_7_2024 = (req, res) => {
  console.log(req.originalUrl);
  //ruleid = req.body.ruleid

  username = req.body.username
  oldpass = req.body.oldpass
  newpassword = req.body.newpassword


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    // make a request as

    var request = new sql.Request();

    //make the query

    //var query = "SELECT [buildingname] as building FROM [ECCDB].[ECCAnalytics].[Buildings]"
    dbName = config.databse
    //query = "SELECT * FROM ["+dbName+"].ECCAnalytics.Users where username ='"+username+ "'"
    query = "SELECT * FROM [" + dbName + "].ECCAnalytics.Users where username ='" + username + "' and pswd ='" + oldpass + "'"
    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        if (records['recordsets'][0].length == 0)
          return res.status(200).json('not found')
        else {
          query = "update [" + dbName + "].[ECCAnalytics].[Users] set pswd = '" + newpassword + "' where  username = '" + username + "' and pswd = '" + oldpass + "'"
          request.query(query, function (err, records) {
            if (err)
              console.log(err);
            else {
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


const updateuserpassword = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);  //ruleid = req.body.ruleid


  try {
    await pool.connect();
    const request = pool.request();

    username = req.body.username
    oldpass = req.body.oldpass
    newpassword = req.body.newpassword

    var data = [];
    query = "SELECT * FROM [" + dbName + "].ECCAnalytics.Users where username ='" + username + "' and pswd ='" + oldpass + "'"
    records = await request.query(query)

    if (records['recordsets'][0].length == 0) {
      return res.status(200).json('not found')
    }
    else {
      query = "update [" + dbName + "].[ECCAnalytics].[Users] set pswd = '" + newpassword + "' where  username = '" + username + "' and pswd = '" + oldpass + "'"
      await request.query(query)
      return res.status(200).json('updated')

    }
  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }

}


const equipmentvariable = async (req, res) => {
  console.log(req.originalUrl);
  dbName = config.databse

  equipmentid = req.query.eqptid
  associatedequipid = req.query.aeid
  equipmentname = req.query.equipmentname
  //  sql.connect(config,function(err){
  try {

    await sql.connect(config)
    //if(err)conole.log(err)


    var request = new sql.Request();


    var data = [];
    equipmentQuery = " select FHT.pointid,FHT.associatedequipid,FHT.evarid,FHT.evardesc,FHT.linkedptid,SHT.actualpoint from (select * from (select [T1].[pointid], [T1].[pointdesc],[T2].[associatedequipid] from [" + dbName + "].[ECCAnalytics].[PointType] T1 "
    equipmentQuery += " left join [" + dbName + "].ECCAnalytics.AssociatedEquipments_DataPoints T2 on [T1].[pointid] =  [T2].[pointid] "
    equipmentQuery += " where [T2].equipmentid ='" + equipmentid + "' and [T2].associatedequipid  in(" + associatedequipid + ") ) as T3 "
    equipmentQuery += " inner join [" + dbName + "].ECCAnalytics.EquipmentVariables T4 on T3.pointid = T4.[linkedptid ]) FHT "
    equipmentQuery += " left join (  SELECT  pointid, DP.actualpoint,DP.deviceid "
    equipmentQuery += " FROM [" + dbName + "].[ECCAnalytics].[DataPoint] DP inner join "
    equipmentQuery += " [" + dbName + "].[ECCAnalytics].[Devices] DV on DP.devicerecordid = DV.recordid "
    equipmentQuery += " where DV.equipmentname = '" + equipmentname + "') SHT on FHT.pointid = SHT.pointid "
    records = await request.query(equipmentQuery)

    if (records['recordsets'][0].length > 0) {


      for (var i = 0; i < records['recordsets'][0].length; i++) {
        if (records['recordsets'][0][i]['actualpoint'] != null) {
          data.push({ pointid: records['recordsets'][0][i]['pointid'], associatedequipid: records['recordsets'][0][i]['associatedequipid'], evarid: records['recordsets'][0][i]['evarid'], linkedptid: records['recordsets'][0][i]['linkedptid'], evardesc: records['recordsets'][0][i]['evardesc'], actualpoint: records['recordsets'][0][i]['actualpoint'] });
        } else {
          data.push({ pointid: records['recordsets'][0][i]['pointid'], associatedequipid: records['recordsets'][0][i]['associatedequipid'], evarid: records['recordsets'][0][i]['evarid'], linkedptid: records['recordsets'][0][i]['linkedptid'], evardesc: records['recordsets'][0][i]['evardesc'], actualpoint: null });
        }
      }

    }
    sql.close()

    return res.status(200).json(data)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

  }
  //  })
}

const getequipmentvariable = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  aeid = req.query.aeid
  eqpid = req.query.eqpid


  try {
    await pool.connect();
    const request = pool.request();


    query = "SELECT pointid, associatedequiptype, b.evardesc,c.associatedequipid, evarid "
    query += "FROM [" + dbName + "].[ECCAnalytics].[AssociatedEquipments_DataPoints] a "
    query += " inner join [" + dbName + "].[ECCAnalytics].[EquipmentVariables] b on a.pointid = b.[linkedptid ] "
    query += " left join [" + dbName + "].[ECCAnalytics].[AssociatedEquipments] c on a.[associatedequipid] = c.[associatedequipid] "
    //query += " where a.associatedequipid = '" + aeid + "' and a.[equipmentid] = '" + eqpid + "'; "
    query += " where a.[equipmentid] = '" + eqpid + "'  and a.associatedequipid in (" + aeid + "); "
    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error(err);
    console.error(query);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}


const addequipmentvariableopration = async (req, res) => {

  console.log(req.originalUrl);
  dbName = config.databse


  equipmentvariabledata = req.body.equipmentvariabledata
  modifier = req.query.modifier
  auditData = ""

  try {

    await sql.connect(config)

    var request = new sql.Request();
    equipmentVariableQuery = ""
    auditQuery = ""
    for (i = 0; i < equipmentvariabledata.length; i++) {
      if (equipmentvariabledata[i].recordid == null) {
        equipmentVariableQuery += "insert into [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation]  (evarid,linkedptid,projectrecordid,equipmentname,evarvalue,isenergyvalue,dated) values ('" + equipmentvariabledata[i].evarid + "','" + equipmentvariabledata[i].linkedptid + "','" + equipmentvariabledata[i].projectrecordid + "','" + equipmentvariabledata[i].equipmentname + "','" + equipmentvariabledata[i].evarvalue + "','" + equipmentvariabledata[i].isenergyvalue + "', CURRENT_TIMESTAMP); "
        //auditData += equipmentvariabledata[i].evarvalue+", " 
        equipmentVariableQuery += " INSERT INTO [" + dbName + "].ECCAnalytics.EquipmentVarOperationAudit (evarid,equipmentname,linkedptid,event,currentrecord,dated,modifier) VALUES ('" + equipmentvariabledata[i].evarid + "','" + equipmentvariabledata[i].equipmentname + "', '" + equipmentvariabledata[i].linkedptid + "','add','" + equipmentvariabledata[i].evarvalue + "',CURRENT_TIMESTAMP,'" + modifier + "'); "
        //equipmentVariableQueryForNull += auditQuery

      } else {
        equipmentVariableQuery += " INSERT INTO [" + dbName + "].ECCAnalytics.EquipmentVarOperationAudit (evarid,equipmentname,linkedptid,event,previousrecord,currentrecord,dated,modifier) VALUES ('" + equipmentvariabledata[i].evarid + "','" + equipmentvariabledata[i].equipmentname + "', '" + equipmentvariabledata[i].linkedptid + "','update',(SELECT [evarvalue]  FROM [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation] where  recordid = '" + equipmentvariabledata[i].recordid + "'), '" + equipmentvariabledata[i].evarvalue + "',CURRENT_TIMESTAMP,'" + modifier + "'); "
        equipmentVariableQuery += "update [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation]  set evarvalue =  '" + equipmentvariabledata[i].evarvalue + "' where recordid =  " + equipmentvariabledata[i].recordid + "; "

        //await request.query(auditQuery)

      }
    }
     

    await request.query(equipmentVariableQuery)


    sql.close()

    return res.status(200).json({ "status": "success" })
  } catch (err) {
    console.error(auditQuery);
    return res.status(500).json({ error: 'Internal Server Error' });

  }


}

const deleteequipmentvariableoperation = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  recordid = req.query.id
  modifier = req.query.modifier
  //bvarvalue = req.body.bvarvalue

  updateuser_query = ""

  try {
    await pool.connect();
    const request = pool.request();


    deleteSql = " delete from [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation] where  recordid = " + recordid + "; "
    auditQuery = " INSERT INTO [" + dbName + "].ECCAnalytics.EquipmentVarOperationAudit (evarid,equipmentname,linkedptid,modifier,event,dated) VALUES ((SELECT [evarid]  FROM [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation] where  recordid = '" + recordid + "'),(SELECT [equipmentname]  FROM [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation] where  recordid = '" + recordid + "'), (SELECT [linkedptid]  FROM [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation] where  recordid = '" + recordid + "'),'"+modifier+"','delete',CURRENT_TIMESTAMP); "

    auditQuery += deleteSql
    await request.query(auditQuery)
    return res.status(200).json('success')

  } catch (err) {
    console.error(deleteSql);
    console.log(updateuser_query);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}



const bulkalarmdata = (req, res) => {
  const pollname = req.body.pollname;
  sql.connect(config, function (err) {
    if (err) conole.log(err)

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
    var query = "SELECT [T10].[subequipmenttype],[T10].[equipmenttype],[T1].[alarmid],[T1].[datapointrecordid] ,[T1].[ruleid] ,[T1].[deviceid] ,[T1].[analysisname] ,[T1].[analyticsummary] ,[T1].[measuretype] ,[T1].[costavoided] ,[T1].[energysaved] ,[T1].[alarmstatus],[T1].[alarmontimestamp],[T1].[alarmofftimestamp],[T1].[escalationstage],[T1].[buildingname],[T1].[taskstatus],[T1].[ruleno] FROM [" + dbName + "].[ECCAnalytics].[Alarm] T1  left JOIN [" + dbName + "].[ECCAnalytics].[Buildings] T2 "

    query += "on [T1].buildingname =  [T2].buildingname "
    query += " left JOIN [" + dbName + "].[ECCAnalytics].[Campuses] T3 "
    query += " on [T2].[campusname] = [T3].[campusname] "
    query += " left JOIN [" + dbName + "].[ECCAnalytics].[Cities] T4 "
    query += " on [T4].cityname = [T3].cityname "
    query += " LEFT JOIN [" + dbName + "].[ECCAnalytics].[Countries] T5 "
    query += " on [T5].countryname = [T4].countryname  "
    query += " inner join [" + dbName + "].[ECCAnalytics].[DataPointValue] T6"
    query += " on [T1].datapointrecordid = [T6].datapointrecordid "
    query += " inner join [" + dbName + "].[ECCAnalytics].[DataPoint] T7 "
    query += " on [T6].datapoint = [T7].datapoint "
    query += " inner join [" + dbName + "].[ECCAnalytics].[Devices] T8 "
    query += " on [T7].deviceid = [T8].deviceid  "
    query += " inner join [" + dbName + "].[ECCAnalytics].[Project] T9 "
    query += " on [T8].equipmentname = [T9].equipmentname "
    query += " inner join [" + dbName + "].[ECCAnalytics].[SubEquipments] T10 "
    //query += " on [T9].subequipmentname = [T10].subequipmenttype where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmid] "
    query += " on [T9].subequipmentname = [T10].subequipmenttype where  T1.[alarmstatus] != 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] = 0 and T1.[taskstatus]  != 0 OR T1.[alarmstatus] != 0 and T1.[taskstatus]  = 0   ORDER by T1.[alarmontimestamp] "


    request.query(query, function (err, records) {
      if (err)
        console.log(err);
      else {
        //res.send(records['recordsets'][0]);
        //  your out put as records  
        var data = [];
        for (var i = 0; i < records['recordsets'][0].length; i++) {
          data.push({ alarmid: records['recordsets'][0][i]['alarmid'], datapointrecordid: records['recordsets'][0][i]['datapointrecordid'], ruleid: records['recordsets'][0][i]['ruleid'], ruleno: records['recordsets'][0][i]['ruleno'], buildingname: records['recordsets'][0][i]['buildingname'], equipmentname: records['recordsets'][0][i]['equipmenttype'], subequipmentname: records['recordsets'][0][i]['subequipmenttype'], deviceid: records['recordsets'][0][i]['deviceid'], analysisname: records['recordsets'][0][i]['analysisname'], analyticsummary: records['recordsets'][0][i]['analyticsummary'], measuretype: records['recordsets'][0][i]['measuretype'], assigndate: records['recordsets'][0][i]['alarmontimestamp'], costavoided: records['recordsets'][0][i]['costavoided'], energysaved: records['recordsets'][0][i]['energysaved'], taskstatus: records['recordsets'][0][i]['taskstatus'] });

        }
        // return res.status(200).json(records['recordsets'][0])
        return res.status(200).json(data)
      }

    }

    )
  })
}


const updatetask = (req, res) => {

  query = '';
  dt = 22;
  for (let i = 268; i < 279; i++) {
    query += "update [" + dbName + "].[ECCAnalytics].[Task]  set [taskassigneddate] = cast('2022-07-" + dt + "' as date),[taskcloseddate] = cast('2022-07-" + dt + "' as date) from [" + dbName + "].[ECCAnalytics].[Task] Task  where [Task].[recordid] = " + i + ";";
    dt++;
  }


  sql.connect(config, function (err) {
    if (err) conole.log(err)

    var request = new sql.Request();

    request.query(query, function (err, records) {
      if (err)
        console.log(query);
      else {

        console.log('success');
        return res.status(200).json('success')

      }


    })
  })


}


const buildingvariable = async (req, res) => {
  console.log(req.originalUrl);
  dbName = config.databse

  buildingName = req.query.bld

  const pool = new sql.ConnectionPool(config);

  try {
    await pool.connect();
    const request = pool.request();

    var data = [];
    var bvarid = []

    buildingVarSql = "SELECT * FROM [" + dbName + "].[ECCAnalytics].BuildingVariables"
    buildingVarSqlRecords = await request.query(buildingVarSql)


    for (var i = 0; i < buildingVarSqlRecords['recordsets'][0].length; i++) {
      buildingVarOpSql = "select * FROM [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation]  where [buildingname] = '" + buildingName + "' and bvarid = '" + buildingVarSqlRecords['recordsets'][0][i]['bvarid'] + "';"
      records = await request.query(buildingVarOpSql)
      if (records['recordsets'][0].length < 1) {
        data.push({ bvarid: buildingVarSqlRecords['recordsets'][0][i]['bvarid'], bvardesc: buildingVarSqlRecords['recordsets'][0][i]['bvardesc'],recordid:  null,  bvarvalue:  null });

      } else {
        data.push({ bvarid: buildingVarSqlRecords['recordsets'][0][i]['bvarid'], bvardesc: buildingVarSqlRecords['recordsets'][0][i]['bvardesc'],recordid:  records['recordsets'][0][0]['recordid'], bvarvalue: records['recordsets'][0][0]['bvarvalue'] });

      }
    }
    return res.status(200).json(data)


  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();

  }

}






const campusvariable = async (req, res) => {
  console.log(req.originalUrl);
  dbName = config.databse

  campusName = req.query.cmp
  //  sql.connect(config,function(err){
  try {

    await sql.connect(config)
    //if(err)conole.log(err)


    var request = new sql.Request();


    var data = [];

    CampusVarSql = "SELECT * FROM [" + dbName + "].[ECCAnalytics].CampusVariables"
    CampusVarSqlRecords = await request.query(CampusVarSql)

    for (var i = 0; i < CampusVarSqlRecords['recordsets'][0].length; i++) {

      CampusVarOpSql = "select * FROM [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation]  where [campusname] = '" + campusName + "' and  cvarid = '" + CampusVarSqlRecords['recordsets'][0][i]['cvarid'] + "';"
      records = await request.query(CampusVarOpSql)
      if (records['recordsets'][0].length < 1) {
        data.push({ cvarid: CampusVarSqlRecords['recordsets'][0][i]['cvarid'], cvardesc: CampusVarSqlRecords['recordsets'][0][i]['cvardesc'],recordid: null, cvarvalue: null });

      }
      else{
        data.push({ cvarid: CampusVarSqlRecords['recordsets'][0][i]['cvarid'], cvardesc: CampusVarSqlRecords['recordsets'][0][i]['cvardesc'],recordid:  records['recordsets'][0][0]['recordid'], cvarvalue: records['recordsets'][0][0]['cvarvalue'] });

      }
  
    }
/*
    if (records['recordsets'][0].length > 0) {
      cvarid = records['recordsets'][0][0]['cvarid']
      cvarvalue = records['recordsets'][0][0]['cvarvalue']
      query = "SELECT * FROM [" + dbName + "].[ECCAnalytics].CampusVariables"
      records = await request.query(query)

      for (var i = 0; i < records['recordsets'][0].length; i++) {
        if (records['recordsets'][0][i]['cvarid'] == cvarid) {
          data.push({ cvarid: records['recordsets'][0][i]['cvarid'], cvardesc: records['recordsets'][0][i]['cvardesc'], cvarvalue: cvarvalue });
        } else {
          data.push({ cvarid: records['recordsets'][0][i]['cvarid'], cvardesc: records['recordsets'][0][i]['cvardesc'], cvarvalue: null });
        }
      }

    } else {
      query = "SELECT * FROM [" + dbName + "].[ECCAnalytics].CampusVariables"
      records = await request.query(query)

      for (var i = 0; i < records['recordsets'][0].length; i++) {
        data.push({ cvarid: records['recordsets'][0][i]['cvarid'], cvardesc: records['recordsets'][0][i]['cvardesc'], cvarvalue: null });
      }


    }
      */
    sql.close()


    return res.status(200).json(data)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

  }
  //  })
}


const addbuildingvariable = async (req, res) => {

  console.log(req.originalUrl);
  dbName = config.databse

  buildingvariabledata = req.body.buildingvariabledata
  modifier = req.body.modifier


  try {

    await sql.connect(config)

    var request = new sql.Request();
    buildingQuery = ""
    for (i = 0; i < buildingvariabledata.length; i++) {

      buildingQuery += " insert into [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation]  (bvarid,buildingname,bvarvalue,dated) values ('" + buildingvariabledata[i].bvarid + "','" + buildingvariabledata[i].buildingname + "','" + buildingvariabledata[i].bvarvalue + "', CURRENT_TIMESTAMP); "
      buildingQuery += " insert into [" + dbName + "].[ECCAnalytics].[BuildingVarOperationAudit]  (bvarid,buildingname,modifier,event, currentrecord,dated) values ('" + buildingvariabledata[i].bvarid + "','" + buildingvariabledata[i].buildingname + "','" + modifier + "', 'add','" + buildingvariabledata[i].bvarvalue + "', CURRENT_TIMESTAMP); "
    }
    await request.query(buildingQuery)

    sql.close()

    return res.status(200).json({ "status": "success" })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

  }


}


const addcampusvariable = async (req, res) => {

  console.log(req.originalUrl);
  dbName = config.databse


  campusvariabledata = req.body.campusvariabledata
  modifier = req.body.modifier

  try {

    await sql.connect(config)

    var request = new sql.Request();
    campusQuery = ""
    for (i = 0; i < campusvariabledata.length; i++) {
      campusQuery += " insert into [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation]  (cvarid,campusname,cvarvalue,dated) values ('" + campusvariabledata[i].cvarid + "','" + campusvariabledata[i].campusname + "','" + campusvariabledata[i].cvarvalue + "', CURRENT_TIMESTAMP);"
      campusQuery += " insert into [" + dbName + "].[ECCAnalytics].[CampusVarOperationAudit]  (cvarid,campusname,modifier,event, currentrecord,dated) values ('" + campusvariabledata[i].cvarid + "','" + campusvariabledata[i].campusname + "','" + modifier + "', 'add','" + campusvariabledata[i].cvarvalue + "', CURRENT_TIMESTAMP); "
    }
    await request.query(campusQuery)

    sql.close()

    return res.status(200).json({ "status": "success" })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

  }


}


const retrieveequipmentvariable = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  aeid = req.query.aeid
  equipmentname = req.query.eqpname

  finalResult = { "equipmentvarop": {}, "datapoint": {} }

  try {
    await pool.connect();
    const request = pool.request();


    queryEqpVarOpSQL = "SELECT [recordid],[evarid],[linkedptid],[projectrecordid],[equipmentname],[evarvalue],[dated]"
    queryEqpVarOpSQL += " FROM [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation] where equipmentname = '" + equipmentname + "' "
    queryEqpVarOpRecords = await request.query(queryEqpVarOpSQL)

    finalResult.equipmentvarop = queryEqpVarOpRecords['recordsets'][0]

    datapointTableDataSQL = " SELECT [datapointid],[deviceid],[pointid],[actualpoint],[isenergyvalue] "
    datapointTableDataSQL += " FROM [" + dbName + "].[ECCAnalytics].[DataPoint] where devicerecordid in (SELECT [recordid]  FROM [" + dbName + "].[ECCAnalytics].[Devices] where equipmentname = '" + equipmentname + "') "
    datapointTableRecords = await request.query(datapointTableDataSQL)

    finalResult.datapoint = datapointTableRecords['recordsets'][0]

    return res.status(200).json(finalResult)



  } catch (err) {
    console.error(err);
    console.error(deletequery);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}

const updatequipmentvariableoperation = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  recordid = req.query.id
  modifier = req.body.modifier
  evarvalue = req.body.evarvalue

  updateuser_query = ""

  try {
    await pool.connect();
    const request = pool.request();


    previousValSql = " select * from [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation] where  recordid = " + recordid + "; "
    console.log(previousValSql);
    //return 0;
    records = await request.query(previousValSql)
    prevEvarval = records['recordsets'][0][0].evarvalue
    evarid = records['recordsets'][0][0].evarid
    equipmentname = records['recordsets'][0][0].equipmentname
    linkedptid = records['recordsets'][0][0].linkedptid

    updateuser_query = " update [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation]  set evarvalue = '" + evarvalue + "' where recordid = '" + recordid + "'; ";


    //insertQuery = " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (userid,event,previousrecord,currentrecord,dated) VALUES ('" + username + "','update','" + prevEvarval + "','" + evarvalue + "',CURRENT_TIMESTAMP); "
    auditQuery = " INSERT INTO [" + dbName + "].ECCAnalytics.EquipmentVarOperationAudit (evarid,equipmentname,linkedptid,event,previousrecord,currentrecord,dated) VALUES ('" + evarid + "','" + equipmentname + "', '" + linkedptid + "','update','" + prevEvarval + "','" + evarvalue + "',CURRENT_TIMESTAMP); "

    updateuser_query += auditQuery
    console.log(updateuser_query);

    await request.query(updateuser_query)
    return res.status(200).json('success')

  } catch (err) {
    console.error(err);
    console.log(updateuser_query);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}


const addbuildingvariableoperation = async (req, res) => {

  console.log(req.originalUrl);
  dbName = config.databse

  buildingvariabledata = req.body.buildingvariabledata
  modifier = req.query.modifier


  try {

    await sql.connect(config)

    var request = new sql.Request();
    buildingQuery = ""
    auditQuery = ""
    addBuildingSQL = ""
    for (i = 0; i < buildingvariabledata.length; i++) {

      //buildingQuery += "insert into [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation]  (bvarid,buildingname,bvarvalue,dated) values ('" + buildingvariabledata[i].bvarid + "','" + buildingvariabledata[i].buildingname + "','" + buildingvariabledata[i].bvarvalue + "', CURRENT_TIMESTAMP)"
      //auditQuery += " INSERT INTO [" + dbName + "].ECCAnalytics.BuildingVarOperationAudit (bvarid,buildingname,event,currentrecord,dated) VALUES ('" + buildingvariabledata[i].bvarid + "','" + buildingvariabledata[i].buildingname + "', 'add','" + buildingvariabledata[i].bvarvalue + "',CURRENT_TIMESTAMP); "

      addBuildingSQL += "  IF (NOT EXISTS(SELECT * FROM [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation] WHERE bvarid = '" + buildingvariabledata[i].bvarid + "' and buildingname = '" + buildingvariabledata[i].buildingname + "') ) "
      addBuildingSQL += " BEGIN "
      addBuildingSQL += "  INSERT INTO  [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation]( bvarid,buildingname,bvarvalue,dated)  VALUES('" + buildingvariabledata[i].bvarid + "', '" + buildingvariabledata[i].buildingname + "', '" + buildingvariabledata[i].bvarvalue + "', CURRENT_TIMESTAMP) "
      addBuildingSQL += " INSERT INTO  [" + dbName + "].[ECCAnalytics].BuildingVarOperationAudit (bvarid,buildingname,modifier,event,currentrecord,dated) VALUES ('" + buildingvariabledata[i].bvarid + "','" + buildingvariabledata[i].buildingname + "', '"+modifier+"', 'add', '" + buildingvariabledata[i].bvarvalue + "',CURRENT_TIMESTAMP); "
      addBuildingSQL += " END  "
      addBuildingSQL += " ELSE "
      addBuildingSQL += " BEGIN  "
      addBuildingSQL += " INSERT INTO  [" + dbName + "].[ECCAnalytics].BuildingVarOperationAudit (bvarid,buildingname,modifier,event,previousrecord,currentrecord,dated) VALUES ('" + buildingvariabledata[i].bvarid + "','" + buildingvariabledata[i].buildingname + "','"+modifier+"', 'update',(SELECT bvarvalue FROM  [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation] WHERE bvarid = '" + buildingvariabledata[i].bvarid + "' and buildingname = '" + buildingvariabledata[i].buildingname + "'), '" + buildingvariabledata[i].bvarvalue + "',CURRENT_TIMESTAMP); "
      addBuildingSQL += " UPDATE  [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation] "
      addBuildingSQL += " SET bvarvalue = '" + buildingvariabledata[i].bvarvalue + "' "
      addBuildingSQL += " WHERE  bvarid = '" + buildingvariabledata[i].bvarid + "' and buildingname = '" + buildingvariabledata[i].buildingname + "'; "
      addBuildingSQL += " END ; "

    }
    buildingQuery += auditQuery
    await request.query(addBuildingSQL)
    console.log(addBuildingSQL)
    sql.close()

    return res.status(200).json({ "status": "success" })
  } catch (err) {
    console.error(err);
    console.log(addBuildingSQL)

    return res.status(500).json({ error: 'Internal Server Error' });

  }


}



const deletebuildingvariableoperation = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  recordid = req.query.id
  modifier = req.query.modifier
  bvarvalue = req.body.bvarvalue

  updateuser_query = ""

  try {
    await pool.connect();
    const request = pool.request();


    deleteSql = " delete from [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation] where  recordid = " + recordid + "; "
    auditQuery = " INSERT INTO [" + dbName + "].ECCAnalytics.BuildingVarOperationAudit (bvarid,buildingname,event,dated,modifier) VALUES ((SELECT [bvarid]  FROM [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation] where  recordid = '" + recordid + "'),(SELECT [buildingname]  FROM [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation] where  recordid = '" + recordid + "'), 'delete',CURRENT_TIMESTAMP,'" + modifier + "'); "

    auditQuery += deleteSql
    await request.query(auditQuery)
    return res.status(200).json('success')

  } catch (err) {
    console.error(deleteSql);
    console.log(updateuser_query);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}

const addcampusvariableoperation = async (req, res) => {

  console.log(req.originalUrl);
  dbName = config.databse


  campusvariabledata = req.body.campusvariabledata
  modifier = req.query.modifier

  try {

    await sql.connect(config)

    var request = new sql.Request();
    campusQuery = ""
    auditQuery = ""
    addCampusSQL = ""
    for (i = 0; i < campusvariabledata.length; i++) {
      campusQuery += "insert into [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation]  (cvarid,campusname,cvarvalue,dated) values ('" + campusvariabledata[i].cvarid + "','" + campusvariabledata[i].campusname + "','" + campusvariabledata[i].cvarvalue + "', CURRENT_TIMESTAMP);"
      auditQuery += " INSERT INTO [" + dbName + "].ECCAnalytics.CampusVarOperationAudit (cvarid,campusname,event,currentrecord,dated) VALUES ('" + campusvariabledata[i].cvarid + "','" + campusvariabledata[i].campusname + "', 'add','" + campusvariabledata[i].cvarvalue + "',CURRENT_TIMESTAMP); "

      addCampusSQL += "  IF (NOT EXISTS(SELECT * FROM [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation] WHERE cvarid = '" + campusvariabledata[i].cvarid + "' and campusname = '" + campusvariabledata[i].campusname + "') ) "
      addCampusSQL += " BEGIN "
      addCampusSQL += "  INSERT INTO  [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation]( cvarid,campusname,cvarvalue,dated)  VALUES('" + campusvariabledata[i].cvarid + "', '" + campusvariabledata[i].campusname + "', '" + campusvariabledata[i].cvarvalue + "', CURRENT_TIMESTAMP) "
      addCampusSQL += " INSERT INTO  [" + dbName + "].[ECCAnalytics].CampusVarOperationAudit (cvarid,campusname,modifier,event,currentrecord,dated) VALUES ('" + campusvariabledata[i].cvarid + "','" + campusvariabledata[i].campusname + "', '"+modifier+"', 'add', '" + campusvariabledata[i].cvarvalue + "',CURRENT_TIMESTAMP); "
      addCampusSQL += " END  "
      addCampusSQL += " ELSE "
      addCampusSQL += " BEGIN  "
      addCampusSQL += " INSERT INTO  [" + dbName + "].[ECCAnalytics].CampusVarOperationAudit (cvarid,campusname,modifier,event,previousrecord,currentrecord,dated) VALUES ('" + campusvariabledata[i].cvarid + "','" + campusvariabledata[i].campusname + "', '"+modifier+"', 'update',(SELECT cvarvalue FROM  [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation] WHERE cvarid = '" + campusvariabledata[i].cvarid + "' and campusname = '" + campusvariabledata[i].campusname + "'), '" + campusvariabledata[i].cvarvalue + "',CURRENT_TIMESTAMP); "
      addCampusSQL += " UPDATE  [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation] "
      addCampusSQL += " SET cvarvalue = '" + campusvariabledata[i].cvarvalue + "' "
      addCampusSQL += " WHERE  cvarid = '" + campusvariabledata[i].cvarid + "' and campusname = '" + campusvariabledata[i].campusname + "'; "
      addCampusSQL += " END ; "



    }
    //campusQuery += auditQuery
    await request.query(addCampusSQL)

    sql.close()

    return res.status(200).json({ "status": "success" })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });

  }


}


const updatecampusvariableoperation = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  recordid = req.query.id
  modifier = req.query.modifier
  cvarvalue = req.body.cvarvalue

  updateuser_query = ""

  try {
    await pool.connect();
    const request = pool.request();


    previousValSql = " select * from [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation] where  recordid = " + recordid + "; "
    console.log(previousValSql);
    records = await request.query(previousValSql)
    prevCvarval = records['recordsets'][0][0].cvarvalue
    cvarid = records['recordsets'][0][0].cvarid
    campusname = records['recordsets'][0][0].campusname

    updatcampus_query = " update [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation]  set cvarvalue = '" + cvarvalue + "' where recordid = '" + recordid + "'; ";


    auditQuery = " INSERT INTO [" + dbName + "].ECCAnalytics.CampusVarOperationAudit (cvarid,campusname,event,previousrecord,currentrecord,dated) VALUES ('" + cvarid + "','" + campusname + "', 'update','" + prevCvarval + "','" + cvarvalue + "',CURRENT_TIMESTAMP); "

    updatcampus_query += auditQuery
    console.log(updatcampus_query);

    await request.query(updatcampus_query)
    return res.status(200).json('success')

  } catch (err) {
    console.error(err);
    console.log(updateuser_query);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}

const deletecampusvariableoperation = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  recordid = req.query.id
  modifier = req.query.modifier
  bvarvalue = req.body.bvarvalue

  updateuser_query = ""

  try {
    await pool.connect();
    const request = pool.request();


    deleteSql = " delete from [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation] where  recordid = " + recordid + "; "
    auditQuery = " INSERT INTO [" + dbName + "].ECCAnalytics.CampusVarOperationAudit (cvarid,campusname,event,dated,modifier) VALUES ((SELECT [cvarid]  FROM [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation] where  recordid = '" + recordid + "'),(SELECT [campusname]  FROM [" + dbName + "].[ECCAnalytics].[CampusVariables_Operation] where  recordid = '" + recordid + "'), 'delete',CURRENT_TIMESTAMP,'" + modifier + "'); "

    auditQuery += deleteSql
    await request.query(auditQuery)
    return res.status(200).json('success')

  } catch (err) {
    console.error(deleteSql);
    console.log(auditQuery);
    return res.status(500).json('failed');

  } finally {

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

const updatebuildingvariableoperation = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);


  recordid = req.query.id
  modifier = req.body.modifier
  bvarvalue = req.body.bvarvalue

  updateuser_query = ""

  try {
    await pool.connect();
    const request = pool.request();


    previousValSql = " select * from [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation] where  recordid = " + recordid + "; "
    console.log(previousValSql);
    //return 0;
    records = await request.query(previousValSql)
    prevBvarval = records['recordsets'][0][0].bvarvalue
    bvarid = records['recordsets'][0][0].bvarid
    buildingname = records['recordsets'][0][0].buildingname

    updateuser_query = " update [" + dbName + "].[ECCAnalytics].[BuildingVariables_Operation]  set bvarvalue = '" + bvarvalue + "' where recordid = '" + recordid + "'; ";


    //insertQuery = " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (userid,event,previousrecord,currentrecord,dated) VALUES ('" + username + "','update','" + prevEvarval + "','" + evarvalue + "',CURRENT_TIMESTAMP); "
    auditQuery = " INSERT INTO [" + dbName + "].ECCAnalytics.BuildingVarOperationAudit (bvarid,buildingname,event,previousrecord,currentrecord,dated) VALUES ('" + bvarid + "','" + buildingname + "', 'update','" + prevBvarval + "','" + bvarvalue + "',CURRENT_TIMESTAMP); "

    updateuser_query += auditQuery
    console.log(updateuser_query);

    await request.query(updateuser_query)
    return res.status(200).json('success')

  } catch (err) {
    console.error(err);
    console.log(updateuser_query);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


}

const userdetail = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);
  userid = req.query.uid

  //  cn = req.query.cn

  try {
    await pool.connect();
    const request = pool.request();

    query = "SELECT * FROM [" + dbName + "].[ECCAnalytics].Users where userid = '"+userid+"'; "
    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}

const devicetreeview = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  //  cn = req.query.cn

  try {
    await pool.connect();
    const request = pool.request();

    query = "SELECT distinct [deviceid],[ip],[network] FROM [" + dbName + "].[ECCAnalytics].[Devices] ; "
    records = await request.query(query)

    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}

const devicedetails = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  deviceid = req.query.dv

  try {
    await pool.connect();
    const request = pool.request();

    query = "SELECT T1.[equipmentname],T2.[buildingname] FROM [" + dbName + "].[ECCAnalytics].[Devices] T1 left join [" + dbName + "].[ECCAnalytics].[Project] T2 on T1.equipmentname = T2.equipmentname where deviceid = '" + deviceid + "'; "
    records = await request.query(query)
    console.log(query)
    var data = [];
    for (var i = 0; i < records['recordsets'][0].length; i++) {
      queryForCount1 = "SELECT count(*) as total FROM [" + dbName + "].[ECCAnalytics].[DataPoint] DP left join [" + dbName + "].[ECCAnalytics].[Devices] DV on DP.devicerecordid = DV.recordid where equipmentname = '"+records['recordsets'][0][i]['equipmentname']+"' and dv.deviceid = '"+deviceid+"'"
      countRecords = await request.query(queryForCount1)
      count1 = countRecords['recordsets'][0][0]['total']
      
      /*
      queryForCount2 = "SELECT count(*) as total FROM [" + dbName + "].[ECCAnalytics].[EquipmentVariables_Operation] where equipmentname = '"+records['recordsets'][0][i]['equipmentname']+"'"
      countRecords2 = await request.query(queryForCount2)
      count2 = countRecords2['recordsets'][0][0]['total']
      count1 = count1 + count2
      */
      data.push({ equipmentname: records['recordsets'][0][i]['equipmentname'], buildingname: records['recordsets'][0][i]['buildingname'],pointsconsidered:count1});

    }

    //return res.status(200).json(records['recordsets'][0])
    return res.status(200).json(data)

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}


const countbynode = async (req, res) => {

  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);

  node = req.query.nd
  val = req.query.val

  whereClause = ""
  if (node == 'cn') {
    whereClause = " where countryname ='" + val + "'"
  }
  if (node == 'ct') {
    whereClause = " where cityname ='" + val + "'"
  }
  if (node == 'cm') {
    whereClause = " where campusname ='" + val + "'"
  }
  if (node == 'bl') {
    whereClause = " where buildingname ='" + val + "'"
  }


  try {
    await pool.connect();
    const request = pool.request();

    if (node == 'nw') {
      whereClause = " where network ='" + val + "'"


      query = " select count (*) as totalequipments, deviceid  from [" + dbName + "].[ECCAnalytics].[Devices] "
      query += whereClause
      query += " group by deviceid; "
      records = await request.query(query)
      console.log(query)
      return res.status(200).json(records['recordsets'][0])
    }

    query = "SELECT count(equipmentname) as total from [" + dbName + "].[ECCAnalytics].[Project]  "
    query += whereClause
    records = await request.query(query)
    console.log(query)
    return res.status(200).json(records['recordsets'][0])

  } catch (err) {
    console.error('Error with SQL Server:', err);
  } finally {
    // Close the connection pool
    pool.close();
  }


}

const deleteuserbyrole = async (req, res) => {
  console.log(req.originalUrl)
  dbName = config.databse
  const pool = new sql.ConnectionPool(config);
  modifier = req.query.modifier
  roles = req.query.roles

  //pool.connect().then(() => {
  try {
    await pool.connect();
    const request = pool.request();
    users = ''
    getUsernameQuery = "SELECT [username] FROM [" + dbName + "].ECCAnalytics.Users where [roles] = '" + roles + "';";
    userData = await request.query(getUsernameQuery)
    //username = userData['recordsets'][0][0].username
    for (var i = 0; i < userData['recordsets'][0].length; i++) {
      users +=  userData['recordsets'][0][i]['username']+',' 
    }
    //query = ""
    deletequery = " delete  FROM [" + dbName + "].[ECCAnalytics].[Users] where [roles] = '" + roles + "';";
    deletequery += " INSERT INTO [" + dbName + "].ECCAnalytics.UserAudit (modifier,userid,event,dated) VALUES ('" + modifier + "','" + users + "','delete',CURRENT_TIMESTAMP); "


    await request.query(deletequery)
    return res.status(200).json('success')

  } catch (err) {
    console.error(err);
   // console.error(deletequery);
    return res.status(500).json('failed');

  } finally {

    pool.close();


  }


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
  buildingvariable,
  campusvariable,
  addbuildingvariable,
  addcampusvariable,
  equipmentvariable,
  getequipmentvariable,
  addequipmentvariableopration,
  deleteequipmentvariableoperation,
  retrieveequipmentvariable,
  addbuildingvariableoperation,
  updatebuildingvariableoperation,
  deletebuildingvariableoperation,
  addcampusvariableoperation,
  updatecampusvariableoperation,
  deletecampusvariableoperation,
  getbuildingvariablevalue,
  updatequipmentvariableoperation,
  userdetail,
  devicetreeview,
  devicedetails,
  countbynode,
  deleteuserbyrole

}