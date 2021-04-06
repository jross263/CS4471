const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const shell = require('shelljs');

const config = require('config.json');
const db = require('_helpers/db');
const { getById } = require('../users/user.service');


AWS.config.update({
    accessKeyId: config.aws.snsKey,
    secretAccessKey: config.aws.snsSecret,
    region: config.aws.region,
});

module.exports = {
    getAll,
    getAllActive,
    getSubscriptions,
    getData,
    subscribe,
    unsubscribe,
    shutdown,
    start
};

async function getAll() {
    return await db.Service.findAll({attributes: {exclude: ['topic']}});
}

async function getAllActive() {
    return await db.Service.findAll({ where: { active: true }, attributes: {exclude: ['topic']} });
}

async function getSubscriptions(userId) {
    const user = await getById(userId);

    return await user.getServices({ where: { active: true } });
}

async function getData(serviceId) {
    const service = await getService(serviceId)
    return await service.getDatum();
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
    if(arn === "PendingConfirmation"){
        throw 'Please confirm your subscription via email before unsubscribing!'
    }
    if(arn === "Deleted"){
        return await service.removeUser(user)
    }
    await new AWS.SNS({apiVersion: '2010-03-31'}).unsubscribe({SubscriptionArn : arn}).promise();
    
    return await service.removeUser(user)
}

async function shutdown(id) {
    const service = await getService(id);

    const {code, stdout, stderr} = await exec(`pm2 stop ../services/${service.name}/${service.name}.js`)
    
    if(code !== 0){
        throw 'Error shutting down service'
    }

    Object.assign(service, {active:0});
    return await service.save();
}

async function start(id) {
    const service = await getService(id);

    const {code, stdout, stderr} = await exec(`pm2 start ../services/${service.name}/${service.name}.js`)
    
    if(code !== 0){
        console.log(stderr)
        throw 'Error starting service'
    }

    // copy params to user and save
    Object.assign(service, {active:1});
    return await service.save();
}


// helper functions

const exec = (cmd) => new Promise(resolve=> shell.exec(cmd,{silent:true},(code, stdout, stderr)=>resolve({code, stdout, stderr})))

async function getService(id) {
    const service = await db.Service.findByPk(id);
    if (!service) throw 'Service not found';
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