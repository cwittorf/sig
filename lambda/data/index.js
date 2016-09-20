console.log('Loading function');

var AWS = require('aws-sdk');
var dynamo  = new AWS.DynamoDB();
var q = require("querystring");
/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = function(event, context, callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    var params = q.parse(event.body);
console.log(params);
    dynamo.scan({
        TableName: 'sig'

    }, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(err);
        } else {
            var venues = [];
            for(var x = 0; x < data.Items.length; x++) {
                var item = data.Items[x];

                var add = true;
                if(params.hasOwnProperty("venue") && params.venue != '' && params.venue.trim() != item.venue.S.trim()) {
                    add = false;
                }

                if(params.hasOwnProperty("desc") && params.desc != '' && params.desc != item.description.S) {
                    add = false;
                }

                if(params.hasOwnProperty("role") && params.role != '' && params.role != item.role.S) {
                    add = false;
                }



                if(add) {
                    venues.push({
                            "id": item.id.N,
                            "title": item.venue.S + "\n" + item.description.S + "\n" + item.role.S + "\n" + item.svs.S,
                            "venue": item.venue.S,
                            "description": item.description.S,
                            "chair": item.chair.S,
                            "date": item.date.S,
                            //"DAY": item.day.S,
                            "start": item.date.S + " " + item.start.S,
                            "end": item.date.S + " " + item.end.S,
                            "svs": item.svs.S,
                            "role": item.role.S,
                            "special": item.special.S,
                            "notified": item.notified.S,
                            "verified": item.verified.S
                    });
                }
            }
            context.done(null, JSON.stringify(venues));
        }
    });

};
