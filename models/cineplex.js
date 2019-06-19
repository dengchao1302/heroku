const Sequelize = require('sequelize');
const db = require('./db');

const Cineplex = db.define('Cineplex', {
    // attributes
    Name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Cineplex;
