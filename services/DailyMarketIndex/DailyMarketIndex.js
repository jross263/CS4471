const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cron = require('node-cron');
const axios = require('axios');
const AWS = require('aws-sdk');
const { Sequelize, QueryTypes } = require('sequelize');

AWS.config.update(
  { accessKeyId: process.env.snsKey,
    secretAccessKey:  process.env.snsSecret,
    region: 'us-east-2' 
  });

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, { host: process.env.HOST, dialect: 'mysql' });



///Everyday at midnight
cron.schedule('0 0 * * *', () => {
  axios.get("https://financialmodelingprep.com/api/v3/quotes/index?apikey=" + process.env.STOCK_API).then(gainers => {
      const gainerData = gainers.data;
      sequelize.query('UPDATE data SET json = ?, updatedAt = ? WHERE ServiceId = ?',
        {
          replacements: [JSON.stringify(gainerData), new Date(), process.env.SERVICE_ID],
          type: QueryTypes.UPDATE
        }).then(() => {

          const params = {
            Message: 'Daily Market Index service has new data available.',
            TopicArn: process.env.ARN
          };

          const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
          publishTextPromise.then(
            function (data) {
              console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
              console.log("MessageID is " + data.MessageId);
            }).catch(
              function (err) {
                console.error(err, err.stack);
              });
        })
  }).catch(error => console.log(error));
});