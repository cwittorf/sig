console.log('Loading function');

var AWS = require('aws-sdk');
var dynamo  = new AWS.DynamoDB();
var querystring = require("querystring");
/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = function(event, context, callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));

   var data = querystring.parse(event["body"]);
console.log(data);
    var id = data.id;
    var isNew = false;
    if(id == '') {
        isNew = true;
        id = 0;
    }
    
    dynamo.scan({
        TableName: 'sig'
    }, function(err, data1) {
        console.log(data1.Items);
        for(var x = 0; x < data1.Items.length; x++) {
            if(parseInt(data1.Items[x].id.N) > parseInt(id)) {
                if(isNew) {
                    id = data1.Items[x].id.N;
                }
            }
        }
        if(isNew) {
            id = parseInt(id) + 1;
        }
        if(err) {
            console.log(err, null, 2);
            // return 500 : something went wrong here
        } else {
            console.log("Got item:", JSON.stringify(data1, null, 2));

            var params = {
                TableName: "sig",
                Item: {
                    id     : {
                        N :  id.toString()
                    },
                    venue     : {
                        S :  data.VENUE
                    },
                    description: {
                        S : data.DESCRIPTION,
                    },
                    role    : {
                        S : data.role
                    },
                    chair : {
                        S : data.chair
                    },
                    date: {
                        S : data.DATE
                    },
                    start: {
                        S : data.START
                    },
                    end: {
                        S: data.END
                    },
                    svs: {
                        S: data.SVs
                    },
                    special: {
                        S: data.special
                    },
                    notified: {
                        S: data.notified
                    },
                    verified: {
                        S: data.verified
                    },
                }
            };
            console.log(params);
            dynamo.putItem(params, function(err, data) {
                if(err) {
                    console.log(err, null, 2);
                    callback(err, null);
                    // return 500 : something went wrong here
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                    callback(null, {status:"success"});
                }
            });
        }
    });


};
