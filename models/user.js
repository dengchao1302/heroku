const Sequelize = require('sequelize');
const crypto = require('crypto')
const db = require('./db');

const User = db.define('User', {
    // attributes
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        get() {
            return () => this.getDataValue('password')
        }
    },
    salt: {
        type: Sequelize.STRING,
        get() {
            return () => this.getDataValue('salt')
        }
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Role: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
});

User.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64')
}
User.encryptPassword = function (plainText, salt) {
    return crypto
        .createHash('RSA-SHA256')
        .update(plainText)
        .update(salt)
        .digest('hex')
}

const setSaltAndPassword = user => {
    if (user.changed('password')) {
        user.salt = User.generateSalt()
        user.password = User.encryptPassword(user.password(), user.salt())
    }
}
User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)

User.prototype.correctPassword = function (enteredPassword) {
    return User.encryptPassword(enteredPassword, this.salt()) === this.password()
}

module.exports = User;
