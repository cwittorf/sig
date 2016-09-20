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

   var data = q.parse(event["body"])
   console.log(data);

   if(!data.hasOwnProperty("id")) {
       context.done(null, "{}");
       return;
   }

console.log(data);
    var params = {
        TableName: "sig",
        Key:{
            "id": {
                N: data.id
            }
        }
    };

    dynamo.deleteItem(params, function(err, data) {
        if(err) {
            console.log(err, null, 2);
            callback(err, null);
            // return 500 : something went wrong here
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            callback(null, {status:"success"});
        }
    });

};
