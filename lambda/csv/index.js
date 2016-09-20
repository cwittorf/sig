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
    }, function(err, data) {

        if(err) {
            console.log(err, null, 2);
            // return 500 : something went wrong here
        } else {
            console.log("Got item:", JSON.stringify(data, null, 2));
        }

        var csv = [];
        for(var x = 0; x < data.Items.length; x++) {
            var line = [];
            var header = [];

            for(var key in data.Items[x]) {
                if(x == 0) {
                    header.push(key.toUpperCase());
                }
                if(data.Items[x][key].hasOwnProperty('N')) {
                    line.push(data.Items[x][key].N);
                } else {
                    line.push(data.Items[x][key].S);
                }
            }
            if(x == 0) {
                csv.push('"' + header.join('","') + '"');
            }
            csv.push('"' + line.join('","') + '"');
        }

        var lines = csv.join("\r\n");
        console.log(lines);
        callback(null, {csv: lines});

    });


};
