// REQUIRED MODULES
const fs = require('fs');
const path = require('path');
const express = require('express');
const { v1: uuidv1 } = require('uuid');
// ------------------------------------

// Sets the port to 3001
const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require('./db/db.json');

// ------------------------------------
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ----------- HTML ROUTES -------------
// Displays the index.html page when requested
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

// Displays the notes.html page when requested
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

// ----------- API ROUTES -------------
// Displays the notes in JSON object form
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw (err);
        let notes = JSON.parse(data);
        return res.json(notes);
    })
});

// Reads the incoming request, assigns a randomId  
app.post('/api/notes', (req, res) => {
    let note = { ...req.body, id: uuidv1() };

    //Reads the db.json file and throws error if needed
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw (err);
        // Sets 'addNote' as the incoming data
        let addNote = (JSON.parse(data));
        // Pushes the note to the array
        addNote.push(note);

        // Writes the new note information to the JSON file ('db.json')  
        fs.writeFile('./db/db.json', JSON.stringify(addNote), (err) => {
            // logs successful notes addition
            console.log('A new note was created!')
        })
    })

    res.json(note);
})

app.delete('/api/notes/:id', (req, res) => {
    let deletedId = req.params.id

    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw (err);
        let pastNote = JSON.parse(data);
        let filteredNotes = pastNote.filter(eachNote => eachNote.id != deletedId);
        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) => {
            console.log(`Deleted note ${deletedId} successfully`);
        })

        res.json(filteredNotes);
    })
})

// ----------- PORT LISTENER -------------
// Begins listening on the port specified at the top of server.js
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
