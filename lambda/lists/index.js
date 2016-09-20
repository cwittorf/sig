console.log('Loading function');

var AWS = require('aws-sdk');
var dynamo  = new AWS.DynamoDB();
/**
* Provide an event that contains the following keys:
*
*   - operation: one of the operations in the switch statement below
*   - tableName: required for operations that interact with DynamoDB
*   - payload: a parameter to pass to the operation being performed
*/
exports.handler = function(event, context, callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    dynamo.scan({
        TableName: 'sig'
    }, function (err, data) {
        console.log(data);
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            callback(err);
        } else {
            var venues = {};
            for(var x = 0; x < data.Items.length; x++) {
                var item = data.Items[x];

                if( venues[item.venue.S] === undefined ) {
                    console.log("got here");
                    venues[item.venue.S] = {};
                }
                
                venues[item.venue.S][item.description.S] = "";
            }
            context.done(null, JSON.stringify(venues));
        }
    });

};
