var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var app = express();
var server = http.createServer(app);
var db = new sqlite3.Database('./data.db');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(helmet());
db.run('CREATE TABLE IF NOT EXISTS emp(nombre TEXT, email TEXT, mensaje TEXT)');

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./public/indexPOST.html'));
});


// Add
app.post('/add', function(req,res){
  db.serialize(()=>{
    db.run('INSERT INTO emp(nombre,email,mensaje) VALUES(?,?,?)', [req.body.nombre, req.body.email,req.body.mensaje], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New employee has been added");
      res.sendFile(path.join(__dirname,'./public/indexPOST.html'));
        });

  });

});


// Closing the database connection.
app.get('/close', function(req,res){
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });

});



server.listen(3000, function(){
  console.log("server is listening on port: 3000");
});