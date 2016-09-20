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

    var query = "";
    if(data.hasOwnProperty("id") && data.id != "") {

        var updateArr = [];
        for(var key in data) {
            if(key != "id") {
                updateArr.push( key + " = '" + data[key] + "' " );
            }
        }

        query = "update shifts set " + updateArr.join(", ") + " where id = '" + data.id  + "'";
    } else {
        console.log(data);
        var insertString = [];
        for(var key in data) {
            if(key != 'id') {
                insertString.push(data[key]);
            }
        }
        var attributes = [];
        console.log("got ehre");
        for(var key in data) {
            if(key != 'id') {
                attributes.push(key);
            }
        }
        
        query = "insert into shifts (" + attributes.join(",") + ") values ('" + insertString.join("','")  + "')";
    }

    console.log(query);

    connection.query(query, function(err, rows, fields) {
        if(err) throw err;


        res.send({}); 
    });
   
});

module.exports = router;
