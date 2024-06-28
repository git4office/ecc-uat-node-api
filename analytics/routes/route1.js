const sql = require('mssql');

module.exports = function(req, res) {
  req.app.locals.db.query('SELECT TOP 10 * FROM table_name', function(err, recordset) {
    if (err) {
      console.error(err)
      res.status(500).send('SERVER ERROR')
      return
    }
    res.status(200).json({ message: 'success' })
  })
}