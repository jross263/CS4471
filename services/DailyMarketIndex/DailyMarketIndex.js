const config = require('./config.json');
const cron = require('node-cron');
const axios = require('axios');
const AWS = require('aws-sdk');
const { Sequelize, QueryTypes } = require('sequelize');

AWS.config.update(
  { accessKeyId: config.aws.snsKey,
    secretAccessKey:  config.aws.snsSecret,
    region: 'us-east-2' 
  });


const { host, port, user, password, database } = config.database;
const sequelize = new Sequelize(database, user, password, {host:host, dialect: 'mysql' });

///Everyday at midnight
cron.schedule('0 0 * * *', () => {
  axios.get("https://financialmodelingprep.com/api/v3/quotes/index?apikey=" + config.stockApi).then(gainers => {
      const gainerData = gainers.data;
      sequelize.query('UPDATE data SET json = ?, updatedAt = ? WHERE ServiceId = ?',
        {
          replacements: [JSON.stringify(gainerData), new Date(), config.database.serviceId],
          type: QueryTypes.UPDATE
        }).then(() => {

          const params = {
            Message: 'Daily Market Index service has new data available.',
            TopicArn: config.aws.ARN
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