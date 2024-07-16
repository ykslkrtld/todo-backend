"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

// SEQUELIZE
const { Sequelize, DataTypes } = require('sequelize')

// Connection
const sequelize = new Sequelize('sqlite:' + process.env.SQLITE || './db.sqlite3') 

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

})


    // Syncronization
    // Modelleri veritabanına uygula

// sequelize.sync() // Create Table
// sequelize.sync({alter: true}) // To Backup & Delete Table & create table & from backup
// (async () => {
//     await sequelize.sync({ alter: true }); // Tabloyu günceller, yoksa oluşturur
//   })();

// Connect to DB
sequelize.authenticate()

// Model Export
module.exports = Todo
