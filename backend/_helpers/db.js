const config = require('config.json');
const { Sequelize } = require('sequelize');

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

    db.User.belongsToMany(db.Service, {through:'Subscriptions'})
    db.Service.belongsToMany(db.User, {through:'Subscriptions'})

    // sync all models with database
    await sequelize.sync();
}