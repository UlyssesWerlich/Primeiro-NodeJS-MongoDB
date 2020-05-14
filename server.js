// npm init
// npm install express --save
// npm install ejs --save
// npm install nodemon --save-dev (para restatar automaticamente o servidor)
// npm install body-parser --save (para pegar o form)
// npm install mongodb --save 

//iniciar o servidor
//node server.js
//npm run dev

//"mongodb+srv://ulysses:Joao0316@crud-nodejs-mfxqd.mongodb.net/test?retryWrites=true&w=majority"

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID
const uri = 'mongodb://localhost:27017/crud-nodejs'

MongoClient.connect(uri, (err, cliente) =>{
    if (err) return console.log(err)
    db = cliente.db('crud-nodejs')

    app.listen(3000, () => {
        console.log('server running on port 3000')
    })
})


app.use(bodyParser.urlencoded({ extended: true}))

app.set('view engine', 'ejs')

app.get('/', (req, res) =>{
    res.render('index.ejs')
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results})
    })
})

app.post('/show', (req, res) =>{
    db.collection('data').insertOne(req.body, (err, result) =>{
        if (err) return console.log(err)
        console.log('salvo no banco de dados')
        res.redirect('/')
    })
})

app.route('/edit/:id')
.get((req, res) =>{
    var id = req.params.id
    db.collection('data').find(ObjectId(id)).toArray((err, result) =>{
        if (err) return res.send(err)
        res.render('edit.ejs', { data: result })
    })
})
.post((req, res) =>{
    var id = req.params.id
    var nome = req.body.nome
    var telefone = req.body.telefone
    var email = req.body.email

    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            nome: nome,
            telefone: telefone,
            email: email
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de dados')
    })
})

app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Deletado do Banco de Dados!')
        res.redirect('/show')
    })
})
//senha mLAB: jBU4Ux4DiYp57rw senha ulysses: Joao0316