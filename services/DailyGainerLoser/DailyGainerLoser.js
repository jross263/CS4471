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
cron.schedule('* * * * *', () => {
  axios.get("https://financialmodelingprep.com/api/v3/gainers?apikey=" + config.stockApi).then(gainers => {
    axios.get("https://financialmodelingprep.com/api/v3/losers?apikey=" + config.stockApi).then(losers => {
      const gainerData = gainers.data;
      for (let i = 0; i < gainerData.length; i++) {
        const percent = gainerData[i].changesPercentage;

        gainerData[i].changesPercentage = percent.substr(2, percent.length - 4)
      }
      const losersData = losers.data;
      for (let i = 0; i < losersData.length; i++) {
        const percent = losersData[i].changesPercentage;

        losersData[i].changesPercentage = percent.substr(1, percent.length - 3)
      }
      sequelize.query('UPDATE data SET json = ?, updatedAt = ? WHERE ServiceId = ?',
        {
          replacements: [JSON.stringify(gainerData.concat(losersData)), new Date(), config.stockApi],
          type: QueryTypes.UPDATE
        }).then(() => {

          const params = {
            Message: 'Daily Gainer Loser service has new data available.',
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
    })
  }).catch(error => console.log(error));
});