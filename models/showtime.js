const Sequelize = require('sequelize');
const db = require('./db');
const Film = require('./film')
const Cinema = require('./cinema')

const ShowTime = db.define('ShowTime', {
    // attributes
    timeStart: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    timeEnd: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

ShowTime.belongsTo(Cinema);
Cinema.hasMany(ShowTime);

ShowTime.belongsTo(Film);
Film.hasMany(ShowTime);


module.exports = ShowTime;
