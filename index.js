const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())

morgan.token('body', (request, response) => {
    if (request.method === 'POST'){return JSON.stringify(request.body)}
    else {return ""}
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

contacts = []

app.get('/api/persons/', (request, response) => {
    console.log("Recieved GET request")
    const body = request.body
    const people = Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    
    Person.findById(id).then(person => {
        response.json(person)
    })
    .catch(() => console.log("Couldn't find person silly"))
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    contacts = contacts.filter(contact => contact.id !== id)
    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const newContact = request.body

    if (!newContact.name) {
        return response.status(400).json({
            error: 'Name missing'
        })
    }

    if (!newContact.number) {
        return response.status(400).json({
            error: 'Number missing'
        })
    }

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
    })
    
    morgan('body')
})

app.get('/info/', (request, response) => {
    const contactsCount = contacts.length
    const requestTime = Date(Date.now());
    const peoplePlural = contactsCount === 1 ? "person" : "people"
    response.send(`
        <p>Phonebook has info for ${contactsCount} ${peoplePlural}</p>
        <p>${requestTime}</p>

        `
    )
})


/*Server Setup*/
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})