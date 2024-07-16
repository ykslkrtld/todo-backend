"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

// SEQUELIZE
const { Sequelize, DataTypes } = require('sequelize')

// Connection
const sequelize = new Sequelize('sqlite:' + (process.env.SQLITE || './db.sqlite3'));

const Todo = sequelize.define('todos', {  
    title: {
        type: DataTypes.STRING(256), 
        allowNull: false
    },
    description: {
       type: DataTypes.TEXT,
       allowNull: false
    }, 
    priority: { // 1:High, 0:Normal, -1:Low
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

// Asynchronous function to handle database connection and synchronization
(async () => {
    try {
        // Authenticate the connection
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Synchronize models
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Model Export
module.exports = Todo;
