const Sequelize = require('sequelize');
const db = require('./db');

const Film = db.define('Film', {
    // attributes
    Name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    publicDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    posterURL: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    time: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    trailer: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    hotRate: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = Film;
