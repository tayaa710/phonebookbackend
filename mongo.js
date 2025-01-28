const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Not enough arguments -> node mongo.js <password> <name> <number> or to show all node mongo.js <password>')
    process.exit(1)
} else if (process.argv.length > 5) {
    console.log('Too many arguments -> node mongo.js <password> <name> <number> or to show all node mongo.js <password>')
} else {
    const password = process.argv[2];

    const url = `mongodb+srv://aarontaylor1279:${password}@cluster0.ugjp8.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
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
                console.log("Phonebook:")
                result.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })
                mongoose.connection.close()
            })
        
    } else if (process.argv.length === 5) {
        const name = process.argv[3]
        const number = process.argv[4]
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