const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        json: { type: DataTypes.JSON, allowNull: false },
    };

    const options = {

    };

    return sequelize.define('Data', attributes, options);
}