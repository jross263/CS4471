const config = require('./config.json');
const cron = require('node-cron');
const axios = require('axios');
const AWS = require('aws-sdk');
const { Sequelize, QueryTypes } = require('sequelize');

AWS.config.update({
    accessKeyId: config.AWS.snsKey,
    secretAccessKey:config.AWS.snsSecret,
    region: 'us-east-2'
});

const sequelize = new Sequelize(database, user, password, {host:host, dialect: 'mysql' });

///Everyday at midnight
cron.schedule('* * * * *', () => {
    const startDate = new Date(new Date().toUTCString());
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const fhParams = {
        from: startDate.toISOString().split('T')[0],
        to: endDate.toISOString().split('T')[0],
        token: config.stockApi
    };

    axios
        .get(`https://finnhub.io/api/v1/calendar/ipo`, { params: fhParams })
        .then((ipoCal) => {
            // Format data here before storing in DB
            const ipoData = ipoCal.data.ipoCalendar;
            sequelize
                .query(
                    'UPDATE data SET json = ?, updatedAt = ? WHERE ServiceId = ?',
                    {
                        replacements: [
                            JSON.stringify(ipoData),
                            new Date(),
                            config.database.serviceId
                        ],
                        type: QueryTypes.UPDATE
                    }
                )
                .then(() => {
                    const params = {
                        Message: 'IPO Calendar service has new data available.',
                        TopicArn: config.AWS.ARN
                    };

                    const publishTextPromise = new AWS.SNS({
                        apiVersion: '2010-03-31'
                    })
                        .publish(params)
                        .promise();
                    publishTextPromise
                        .then(function (data) {
                            console.log(
                                `Message ${params.Message} sent to the topic ${params.TopicArn}`
                            );
                            console.log('MessageID is ' + data.MessageId);
                        })
                        .catch(function (err) {
                            console.error(err, err.stack);
                        });
                });
        })
        .catch((error) => console.log(error));
});
