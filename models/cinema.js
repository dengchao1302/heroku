const Sequelize = require('sequelize');
const db = require('./db');
const Cineplex = require('./cineplex')

const Cinema = db.define('Cinema', {
    // attributes
    Name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    horizon:{
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    vertical:{
        type: Sequelize.FLOAT,
        allowNull: false,
    },
});

Cinema.belongsTo(Cineplex);
Cineplex.hasMany(Cinema);

module.exports = Cinema;
