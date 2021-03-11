require('dotenv').config()
var cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

var AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.DB_IAM_ID,
    secretAccessKey: process.env.DB_IAM_KEY,
    region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "ServiceData";


///Everyday at midnight
cron.schedule('* * * * *', () => {
    axios.get("https://financialmodelingprep.com/api/v3/gainers?apikey="+process.env.STOCK_API).then(response => {
        var params = {
            TableName:table,
            Item:{
                "UUID": uuidv4(),
                "service": "Service1",
                "time": Date.now(),
                "data":response.data
            }
        };
        
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
        });
    }).catch(error => console.log(error));
});