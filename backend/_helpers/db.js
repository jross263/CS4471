const config = require('config.json');
const { Sequelize } = require('sequelize');
const fs = require('fs');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const shell = require('shelljs');

AWS.config.update({
    accessKeyId: config.aws.snsKey,
    secretAccessKey: config.aws.snsSecret,
    region: config.aws.region,
});

const exec = (cmd) => new Promise(resolve=> shell.exec(cmd,{silent:true},(code, stdout, stderr)=>resolve({code, stdout, stderr})))


module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;

    // connect to db
    const sequelize = new Sequelize(database, user, password, {host:host, dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);
    db.Service = require('../services/service.model')(sequelize);
    db.Data = require('../data/data.model')(sequelize);

    db.User.belongsToMany(db.Service, {through:'Subscriptions'})
    db.Service.belongsToMany(db.User, {through:'Subscriptions'})

    db.Service.hasOne(db.Data);
    db.Data.belongsTo(db.Service);

    // sync all models with database
    await sequelize.sync();

    await exec(`pm2 stop all`)

    for(const file of fs.readdirSync('../services/')){
        const checkService = await db.Service.findOne({where:{name:file}});
        if(!checkService){
            const serviceDescription = require(`../../services/${file}/package.json`).description
            const params = {
                name:file,
                description:serviceDescription,
                active:false
            }
            const topicData = await new AWS.SNS({ apiVersion: '2010-03-31' }).createTopic({ Name: uuidv4() }).promise();
            params["topic"] = topicData.TopicArn
            await db.Service.create(params);
        }
        else{
            if(checkService.active){
                await exec(`pm2 start ../services/${checkService.name}/${checkService.name}.js`)
            }else{
                await exec(`pm2 stop ../services/${checkService.name}/${checkService.name}.js`)
            }
        }
    }
}