var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var dynamo  = new AWS.DynamoDB();

router.post('/', function(req, res, next) {
    var data = req.body;

    var where = [];
    if(data.hasOwnProperty("venue") && data.venue != "") {
        where.push("venue = '" + data.venue + "'");
    }

    if(data.hasOwnProperty("desc") && data.desc != "") {
        where.push("description = '" + data.desc + "'");
    }

    if(data.hasOwnProperty("role") && data.role != "") {
        where.push("role = '" + data.role + "'");
    }

    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      database : 'sig',
      dateStrings: true
    });

    connection.connect();

    var whereString = "";
    if(where.length > 0) {
        whereString = " AND "+where.join(" AND ");
    }

    connection.query("select * from shifts where DATE is not null and START is not null " + whereString, function(err, rows, fields) {
        if(err) throw err;

        var shifts = [];
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var shift = {
                id:     row.id,
                title:  row.DESCRIPTION + '\n' + row.role + '\n' + row.SVs,
                venue:  row.VENUE,
                role:   row.role,
                desc:   row.DESCRIPTION,
                chair:  row.CHAIR,
                start:  row.DATE+"T"+row.START+"+08:00",
                end:    row.DATE+"T"+row.END+"+08:00",
                sv:     row.SVs,
                special: row.special,
                backgroundColor: row.special == 1 ? "#add8e6" : "##778899",
                textColor: row.special == 1 ? "#111111" : "#FFFFFF"
            };
console.log(row);
            var params = {
                TableName: "sig",
                Item: {
                    id     : {
                        N :  row.id.toString()
                    },
                    venue     : {
                        S :  row.VENUE
                    },
                    description: {
                        S : row.DESCRIPTION,
                    },
                    role    : {
                        S : row.role ? row.role : "None"
                    },
                    chair : {
                        S : row.CHAIR ? row.CHAIR : "0"
                    },
                    date: {
                        S : row.DATE
                    },
                    start: {
                        S : row.START
                    },
                    end: {
                        S: row.END
                    },
                    svs: {
                        S: row.SVs.toString() ? row.SVs.toString() : "0"
                    },
                    special: {
                        S: row.special.toString() ? row.special.toString() : "0"
                    },
                    notified: {
                        S: row.notified.toString() ? row.notified.toString() : "0"
                    },
                    verified: {
                        S: row.verified.toString() ? row.verified.toString() : "0"
                    },
                }
            };
            //console.log(params);
            dynamo.putItem(params, function(err, data) {
                if(err) {
                    console.log(err);
                    // return 500 : something went wrong here
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                }
            });

            shifts.push(shift);
        }

        res.send(shifts);
    });
});

module.exports = router;
