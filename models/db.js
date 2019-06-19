const Sequelize = require('sequelize');

const url = process.env.DATABASE_URL || 'postgres://postgres:123123@127.0.0.1:5432/postgres'
const db = new Sequelize(url);

module.exports = db;