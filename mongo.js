const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length > 4) {
    console.log('Too many arguments -> node mongo.js <name> <number> or to show all node mongo.js <password>')
} else {

    const url = process.env.MONGODB_URI
    mongoose.set('strictQuery', false)

    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    if (process.argv.length === 3) {
        Person
            .find({})
            .then(result => {
                console.log('Phonebook:')
                result.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })
                mongoose.connection.close()
            })

    } else if (process.argv.length === 4) {
        const name = process.argv[2]
        const number = process.argv[3]
        const person = new Person({
            name: name ,
            number: number ,
        })

        person.save().then(result => {
            console.log(`Added ${result.name} number ${result.number} to phonebook`)
            mongoose.connection.close()
        })
    }
}