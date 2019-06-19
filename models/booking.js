const Sequelize = require('sequelize');
const db = require('./db');
const User = require('./user');
const Show = require('./showtime');

const Booking = db.define('Booking', {
    // attributes
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    timeBook: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    totalCost: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});


Booking.belongsTo(Show);
Show.hasMany(Booking)

Booking.belongsTo(User);
User.hasMany(Booking);

module.exports = Booking;
