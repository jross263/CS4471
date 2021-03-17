require('dotenv').config();
var cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
var aws = require('aws-sdk');

// AWS Stuff
AWS.config.update({
    accessKeyId: process.env.DB_IAM_ID,
    secretAccessKey: process.env.DB_IAM_KEY,
    region: "us-east-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var table = "ServiceData";


//Everyday at midnight, retrieve the week's IPOs and store in object storage
cron.schedule('0 0 * * *', () => {
    const startDate = new Date(new Date().toUTCString());
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const fhParams = {
        from: startDate.toISOString().split('T')[0],
        to: endDate.toISOString().split('T')[0],
        token: process.env.API_KEY
    };
    
    axios.get(`https://finnhub.io/api/v1/calendar/ipo`, {params: fhParams}).then(response => {
        let params = {
            TableName:table,
            Item:{
                "UUID": uuidv4(),
                "service": "Service3",
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
    }).catch(err => console.log(err));
});
