var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.post('/', function(req, res, next) {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      database : 'sig',
      dateStrings: true
    });

    connection.connect();

    connection.query("select distinct VENUE, DESCRIPTION FROM shifts", function(err, rows, fields) {
        if(err) throw err;

        var obj = {};
        for(var j = 0; j < rows.length; j++) {
            if(obj[rows[j]] === undefined) {
                obj[rows[j].VENUE] = [];
            }
            obj[rows[j].VENUE].push(rows[j].DESCRIPTION);
        }

        var list = [];
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var shift = {
                venue: row.VENUE,
                description: row.DESCRIPTION
            };

            list.push(shift);
        }

        
/*        connection.query("select distinct DESCRIPTION, role FROM shifts", function(err, rows, fields) {
            if(err) throw err;

            var obj = {};
            for(var j = 0; j < rows.length; j++) {
                if(obj[rows[j]] === undefined) {
                    obj[rows[j].VENUE] = [];
                }
                obj[rows[j].VENUE].push(rows[j].DESCRIPTION);
            }

            var list = [];
            for(var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var shift = {
                    venue: row.VENUE,
                    description: row.DESCRIPTION
                };

                list.push(shift);
            }

            

            res.send(obj); 
        });
*/
        res.send(obj); 
    });
});

module.exports = router;
