const express = require('express')
const sql = require('mssql')
var config = {
 userName: 'ECC', //username created from SQL Management Studio
 password: 'Hydrogen1234',
 server: 'localhost',    //the IP of the machine where SQL Server runs

 options: {
     instanceName: 'ECC',
     database: 'ECCDB',  //the username above should have granted permissions in order to access this DB.
     debug: {
         packet: false,
         payload: false,
         token: false,
         data: false
     },
     //encrypt: true
 }

}
//instantiate a connection pool
const appPool = new sql.ConnectionPool(config)
//require route handlers and use the same connection pool everywhere
const route1 = require('./routes/route1')
const app = express()
app.get('/path', route1)

//connect the pool and start the web server when done
appPool.connect().then(function(pool) {
  app.locals.db = pool;
  const server = app.listen(3000, function () {
    const host = server.address().address
    const port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
  })
}).catch(function(err) {
  console.error('Error creating connection pool', err)
});