const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const config = require('config.json');
const db = require('_helpers/db');
const { getById } = require('../users/user.service')

AWS.config.update({
    accessKeyId: config.aws.snsKey,
    secretAccessKey: config.aws.snsSecret,
    region: config.aws.region,
});

module.exports = {
    getAll,
    getAllActive,
    getSubscriptions,
    subscribe,
    unsubscribe,
    create,
    update
};

async function getAll() {
    return await db.Service.findAll();
}

async function getAllActive() {
    return await db.Service.findAll({ where: { active: true } });
}

async function getSubscriptions(userId) {
    const user = await getById(userId);

    return await user.getServices({ where: { active: true } });
}

async function create(params) {
    const topicData = await new AWS.SNS({ apiVersion: '2010-03-31' }).createTopic({ Name: uuidv4() }).promise();
    params["topic"] = topicData.TopicArn
    return await db.Service.create(params);
}

async function subscribe(serviceId, userId) {
    const user = await getById(userId);
    const service = await getService(serviceId)
    var params = {
        Protocol: 'EMAIL',
        TopicArn: service.topic,
        Endpoint: user.email
    };
    const subscription = await new AWS.SNS({ apiVersion: '2010-03-31' }).subscribe(params).promise();

    return await service.addUser(userId)

}

async function unsubscribe(serviceId, userId) {
    const user = await getById(userId);
    const service = await getService(serviceId)
    
    const arn = await getSubscriptionArn(serviceId,userId);
    await new AWS.SNS({apiVersion: '2010-03-31'}).unsubscribe({SubscriptionArn : arn}).promise();
    
    return await service.removeUser(user)
}

async function update(id, params) {
    const service = await getService(id);
    // copy params to user and save
    Object.assign(service, params);
    await service.save();

    return service;
}

// helper functions

async function getService(id) {
    const service = await db.Service.findByPk(id);
    if (!service) throw 'User not found';
    return service;
}

async function getSubscriptionArn(serviceId, userId) {
    const service = await getService(serviceId);
    const user = await getById(userId);
    const params = {
        TopicArn: service.topic
    }
    const subscriptions = await new AWS.SNS({ apiVersion: '2010-03-31' }).listSubscriptionsByTopic(params).promise();
    return subscriptions.Subscriptions.filter(ele=> user.email === ele.Endpoint)[0].SubscriptionArn
}