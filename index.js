const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())

morgan.token('body', (request, response) => {
    if (request.method === 'POST') { return JSON.stringify(request.body) }
    else { return "" }
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }

    next(error)
}

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

contacts = []

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


app.get('/api/persons/', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (!person) {
            response.status(404).json({ error: 'Person not found' })
        }
        response.json(person)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
    const newContact = request.body

    if (contacts.find(contact => contact.name === newContact.name)) {
        return response.status(409).json({
            error: 'name already in use'
        })
    }

    const newPerson = new Person({
        name: newContact.name,
        number: newContact.number,
    })

    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
        console.log(savedPerson)
    }).catch(error => next(error))

    morgan('body')
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        }).catch(error => next(error))
})

app.get('/info/', (request, response,next) => {
    Person.find({}).then(peopleArray => {
        const contactsCount = peopleArray.length
        const requestTime = Date(Date.now());
        const peoplePlural = contactsCount === 1 ? "person" : "people"
        response.send(`
            <p>Phonebook has info for ${contactsCount} ${peoplePlural}</p>
            <p>${requestTime}</p>
            `
        )
    }).catch(error => next(error))
})
app.use(unknownEndpoint)
app.use(errorHandler)


/*Server Setup*/
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})