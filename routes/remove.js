var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.post('/', function(req, res, next) {
    var data = req.body;


    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      database : 'sig',
      dateStrings: true
    });

    connection.connect();

    if(!data.hasOwnProperty("id")) {
        res.send({});
        return;
    }

    var idString = data.id;

    connection.query("delete from shifts where id = '" + idString + "'", function(err, rows, fields) {
        if(err) throw err;


        res.send({}); 
    });
});

module.exports = router;
