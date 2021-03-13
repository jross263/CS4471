const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        description: {type: DataTypes.STRING, allowNull: false},
        active: { type: DataTypes.BOOLEAN, allowNull: false },
        topic: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {

    };

    return sequelize.define('Services', attributes, options);
}