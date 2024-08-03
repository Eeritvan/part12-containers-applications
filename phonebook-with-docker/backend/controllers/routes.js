const phonebookRouter = require('express').Router()
const phoneBook = require('../models/persons')

phonebookRouter.get('/info', (request, response, next) => {
    const date = new Date().toString()

    phoneBook.countDocuments({})
        .then(count => {
            response.end(
                `<p>Phonebook has info for ${count} people</p>
            <p>${date}</p>`)
        })
        .catch(error => next(error))
})

phonebookRouter.get('/', (request, response) => {
    phoneBook.find().then(x => response.json(x))
})

phonebookRouter.get('/:id', (request, response, next) => {
    const id = request.params.id
    phoneBook.findById(id)
        .then(result => {
            if (result) {
                response.json(result)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

phonebookRouter.delete('/:id', (request, response, next) => {
    const id = request.params.id
    phoneBook.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

phonebookRouter.post('/', (request, response, next) => {
    const entry = new phoneBook({
        name: request.body.name,
        number: request.body.number
    })

    phoneBook.find({ name:entry.name })
        .then(result => {
            if (result.length > 0) {
                response.status(400).end()
            } else {
                entry.save().then(result => {
                    response.status(201).json(result) })
                    .catch(error => next(error))
            }
        })
})

phonebookRouter.put( '/:id', (request, response, next) => {
    const id = request.params.id
    const { name, number } = request.body

    phoneBook.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(result => { response.json(result) })
        .catch(error => next(error))
})

module.exports = phonebookRouter