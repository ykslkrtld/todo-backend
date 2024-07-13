"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

// Model
const Todo = require('../models/todo.model')


module.exports = {

    list: async (req, res) => {

        // const data = await Todo.findAll()
        const data = await Todo.findAndCountAll()
    
        res.status(200).send({
            error: false,
            result: data
        })
    },

    create: async(req, res) => {
    
        const data = await Todo.create(req.body)
    
        res.status(201).send({
            error: false,
            result: data.dataValues
        })
    
    },

    read: async (req, res) => {

        const data = await Todo.findByPk(req.params.id)
    
        res.status(200).send({
            error: false,
            result: data
        })
    },

    update: async (req, res) => {

    const data = await Todo.update(req.body, {where: { id: req.params.id }})

    if(data[0]) {
        res.status(202).send({
            error: false,
            result: data,
            message: 'Updated',
            new: await Todo.findByPk(req.params.id)
        })

    } else {
     
        res.errorStatusCode = 404
        throw new Error('Can not updated. Maybe there is no data to update')
        
    }

    },

    delete: async (req, res) => {

        const data = await Todo.destroy({ where: { id:req.params.id } })
        console.log(data) 
    
        if(data) {
   
            res.sendStatus(204)
    
        } else {
            
            res.errorStatusCode = 404
            throw new Error('Can not deleted. Maybe already deleted')
            
        }
    
    }

}