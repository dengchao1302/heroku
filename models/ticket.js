const Sequelize = require('sequelize');
const db = require('./db');
const Booking = require('./booking')

const Ticket = db.define('Ticket', {
    // attributes
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    sitCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    vertAddress: {
        type: Sequelize.SMALLINT,
        allowNull: false,
    },
    horAddress: {
        type: Sequelize.SMALLINT,
        allowNull: false,
    },
    cost: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Ticket.belongsTo(Booking);
Booking.hasMany(Ticket);

module.exports = Ticket;
