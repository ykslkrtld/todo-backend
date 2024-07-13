"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

// npm i -y
// npm i express dotenv express-async-errors
// echo PORT=8000 > .env
// cat > .gitignore

const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 8000;

/* ------------------------------------------------------- */
// Accept json data and convert to object
app.use(express.json()) // builtin-middleware

// Asnc errors to errorHandler
require('express-async-errors')

// app.all('/', (req, res) => {
//     res.send('WELCOME TO TODO API')
// })

/* ------------------------------------------------------- */

// SEQUELIZE
// npm i sequelize sqlite3

const { Sequelize, DataTypes } = require('sequelize')


// Connection
// const sequelize = new Sequelize('sqlite:' + process.env.SQLITE)
const sequelize = new Sequelize('sqlite:' + process.env.SQLITE || './db.sqlite3') // new varsa Instance'dır normalde Pasqal olması gerekir. (Kullanacağımız veritabanı:veri tabanının yeri) artık veritabanı ile ilgili tüm işlmleri burdan yapacağız


// Sequelize Model
// Her bir model veri tabanında bir tabloya karşılık gelir
// sequelize.define('tableName', {...columns})

const Todo = sequelize.define('todos', {  // Todo isminde model oluşturuyoruz sequelize.define() ile

    // ID sütunu belirtmeye gerek yoktur. Sequelize ID sütununu otomatik oluşturur
    // id: {
    //     // ilk 4 kullanılacak diğerleriyle pek işimiz yok
    //     type: DataTypes.INTEGER, // DATATYPE
    //     allowNull: false, // default: true, sutun verisi boş olabilir mi
    //     unique: true, // default: false, benzersiz kayıt mı / email, id vb
    //     defaultValue: 0, // kayıt eklendiğinde default olarak ne yazılsın
    //     autoIncrement: true, // default: false, sütun değeri her bir kayıtta otomatik olarak +1 artsın mı
    //     primaryKey: true, // default: false, tablonun her bir kaydını ifade eden eşşiz numara
    //     comment: 'yorum eklenebilir',
    //     field: 'custom_field_name' id alanının veritabanında custom_field_name sütunuyla eşleşeceğini belirtir.
    // },

    title: {
        type: DataTypes.STRING(256), // varchar(256)
        allowNull: false
    },

    description: DataTypes.TEXT, // sadece type belirleyeceksek bu şekilde yapabiliriz obje açmaya gerek yok

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

    // kadir: {
    //     type: DataTypes.TEXT,
    //     allowNull: false,
    //     defaultValue: "deneme",
    // },

    // createdAt ve updatedAt tanımlamaya gerek yok. Otomatik oluşturulur.
})


    // Syncronization
    // Modelleri veritabanına uygula

// sequelize.sync() // Create Table (sadece yeni bir tablo oluşturur. sonradan yapılan değişikleri algılamaz)
// sequelize.sync({force: true}) // Delete Table & create table (tablo silip baştan oluşturduğu için olan datalar da silinir)
// sequelize.sync({alter: true}) // To Backup & Delete Table & create table & from backup (önce olanı yedeğe alıp silip oluşturup geri yüklüyor backuptaki datayı)
// **** Sencronisation bir kere yapınca yoruma alın ki her değişiklikte çalışmasın


// Connect to DB
sequelize.authenticate()
    .then(() => console.log('* DB connected *'))
    .catch(() => console.log('* DB not connected *'))


/* ------------------------------------------------------- */

// Routes
const router = express.Router()


// List todos
router.get('/', async (req, res) => {

    // const data = await Todo.findAll()
    const data = await Todo.findAndCountAll()

    res.status(200).send({
        error: false,
        result: data
    })

})


// create todo
router.post('/', async(req, res) => {

    // const receivedData = req.body
    // // console.log(receivedData)

    // const data = await Todo.create({
    //     title: receivedData.title,
    //     description: receivedData.description,
    //     priority: receivedData.priority,
    //     isDone: receivedData.isDone
    // })

    const data = await Todo.create(req.body)

    res.status(201).send({
        error: false,
        result: data.dataValues
    })

})


// Read Todo
router.get('/:id', async (req, res) => {

    // const data = await Todo.findOne({ where: { id: req.params.id } })
    const data = await Todo.findByPk(req.params.id)

    res.status(200).send({
        error: false,
        result: data
    })
})


// Update Todo
router.put('/:id', async (req, res) => {

    // const data = await Todo.update({ ...newData }, {...filter})
    const data = await Todo.update(req.body, {where: { id: req.params.id }})
    // console.log(data) // const data [0] gönderirse put başarısız [1] ise put başarılı

    res.status(202).send({
        error: false,
        result: data,
        message: (data[0] >= 1 ? 'Updated' : 'Can not updated'),
        new: await Todo.findByPk(req.params.id) // Güncellenmiş kaydı göster
    })

})



// Delete Todo
router.delete('/:id', async (req, res) => {

    // const data = await Todo.destroy({... filter})
    const data = await Todo.destroy({ where: { id:req.params.id } })
    console.log(data) // const data 0 gönderirse put başarısız 1 ise put başarılı

    // res.status(204).send({
    //     error: false,
    //     result: data,
    //     message: (data >= 1 ? 'Deleted' : 'Can not deleted'),
    // })

    if(data >= 1) {
        // deleted
        // res.status(204).send({
        //     error: false,
        //     result: data,
        //     message: 'Deleted',
        // })
        res.sendStatus(204)

    } else {
        // Not deleted
        // res.status(404).send({
        //     error: true,
        //     result: data,
        //     message: 'Can not deleted',
        // })
        res.errorStatusCode = 404
        throw new Error('Can not deleted. Maybe already deleted')
        
    }

})



app.use(router)


/* ------------------------------------------------------- */

const errorHandler = (err, req, res, next) => {
    const errorStatusCode = res.errorStatusCode ?? 500
    console.log('errorHandler worked.')
    res.status(errorStatusCode).send({
        error: true, // special data
        message: err.message, // error string message
        cause: err.cause, // error option cause, hata fırlattığımız yerde error.message'dan sonra {cause: ""}
        // stack: err.stack, // error details
    })
}
app.use(errorHandler)
/* ------------------------------------------------------- */
app.listen(PORT, () => console.log("Running: http://127.0.0.1:" + PORT));