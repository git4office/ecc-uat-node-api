const express = require('express');
//const sql = require('mssql');
const sql = require('mssql/msnodesqlv8');

const app = express();
const port = process.env.PORT || 3200;

var config = {

    server : "localhost\\ECC", // eg:: 'DESKTOP_mjsi\\MSSQLEXPRESS'
   databse: "ECCDB",
   user :'corp\\anudasgu',      // please read above note
   password:"Hydrogen1234",   // please read above note
  options :{
    trustedConnection:true,
  },
 driver:"msnodesqlv8",
}
app.get('/products', (req, res) => {
    sql.connect(config,function(err){
        if(err)conole.log(err)
    
        // make a request as
    
        var request = new sql.Request();
    
       //make the query
    
        var query = "SELECT Task.alarmid as id, Task.taskname, Task.taskassigneddate, Task.taskpriority,Task.taskrepeatdays, Alarm.deviceid, Task.taskid, Task.buildingname, Task.taskcloseddate, Task.closingdesc, Task.escalationstage  FROM [ECCDB].[ECCAnalytics].[Alarm] INNER JOIN [ECCDB].[ECCAnalytics].[Task] ON Alarm.alarmid = Task.alarmid;"
           
    
        request.query(query,function(err,records){
            if(err)
            console.log(err);
            else{
               res.send(records['recordsets'][0]);
               //  your out put as records  
            }
    
        }
    
    )
    })
});


   app.listen(port, () => {
      console.log(`App is listening at http://localhost:${port}`);
   });
