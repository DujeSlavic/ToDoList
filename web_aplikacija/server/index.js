// paketi koji su nam potrebni
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path')

// inicijaliziramo serversku express aplikaciju
var app = express();

// konfiguriramo serversku aplikaciju tako da može prihvatiti
// ono što joj klijent salje
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// vodimo računa o tome koji je trenutni
// identifikacijski broj nekog TODO zapisa
var currentID = 0


// klasa koja predstavlja TODO zapis
class TODO {
    constructor(id, description, done) {
        this.id = id;
        this.description = description;
        this.done = done;
    }
}

// ovdje spremamo sve todo zapise
var todos = [];

// ovako server odgovara na zahtjev klijenta za sve todo zapise
app.get('/todo', function(req, res){
    res.json({ todos });
});

// klijent zahtjeva spremanje novog todo zapisa
app.post('/todo', function(req, res) {

    // iz tijela HTML POST zahtjeva dovhaćamo opis i je li zadatak učinjen
    var description = req.body.description;
    var done = req.body.done == 'true';

    // instanciramo novi todo zapis
    todo = new TODO(++currentID, description, done);

    // dodajemo ga svim todo zapisima
    todos.push(todo);

    // na klijent šaljemo sve todo-ove do sada
    res.json({ todos });
});

// DELETE TODO WITH PARTICULAR ID
app.delete('/todo/:id', function(req, res) {
    // iz parametara HTTP DELETE zahtjeva dohvacamo id todo zapisa
    var id = parseInt(req.params.id);
    // prezivljavaju oni zapisi koji imaju id razlicit od poslanog id-a
    todos = todos.filter(item => item.id !== id); 
    // na klijent šaljemo sve todo-ove do sada
    res.json({ todos })
});

// MODIFY TODO WITH PARTICULAR ID
app.put('/todo/:id', function(req, res) {
    // iz parametara HTTP PUT zahtjeva dohvacamo id todo zapisa
    var id = parseInt(req.params.id);
    // prodi kroz sve todo-ove, označi kao učinjen onaj koji ima id isti kao poslan id
    for(var i = 0; i < todos.length; ++i) {
        if(id == todos[i].id) {
            todos[i].done = true;
        }
    }
    // na klijent šaljemo sve todo-ove do sada
    res.json({ todos });
});

// serverskoj aplikaciji naznačavamo gdje se nalazi klijentska aplikacija
// preciznije - iz koje mape server smije slati klijenta prema pregledniku
app.use(express.static(path.join(__dirname, '../client')));


// čim preglednik nije zatražio jednu od gore navedenih ruta 
// pošalji mu klijentsku aplikaciju
app.use('**', function(req, res){
    res.sendFile(path.join(__dirname, '../client/index.html'));
});


// slušaj na portu 3000
app.listen(3000, function(){
    console.log("Listening on port " + 3000 + "!")
});