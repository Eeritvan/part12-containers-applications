const mongoose = require('mongoose')

const phoneBookSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: x => /(\d{2}|\d{3})-(\d+)/.test(x)
        },
        required: true
    }
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('phoneBook', phoneBookSchema)