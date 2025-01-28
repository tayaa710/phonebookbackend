const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())

morgan.token('body', (request, response) => {
    if (request.method === 'POST'){return JSON.stringify(request.body)}
    else {return ""}
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

let contacts = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons/', (request, response) => {
    console.log("Recieved GET request")
    response.json(contacts)
    console.log("Responding")
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    } else {
        console.log("No data found for this id")
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    contacts = contacts.filter(contact => contact.id !== id)
    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const id = String(Math.floor(Math.random() * 900719925474))
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

    newContact.id = id
    contacts = contacts.concat(newContact)
    response.json(newContact)
    console.log(newContact)
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
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})