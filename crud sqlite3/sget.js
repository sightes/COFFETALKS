
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var app = express();
var server = http.createServer(app);
var db = new sqlite3.Database('./data.db');
db.run('CREATE TABLE IF NOT EXISTS emp(nombre TEXT, email TEXT, mensaje TEXT)');
app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./public/indexGET.html'));
});

// CREATE
app.get('/add', function(req,res){
  
  db.serialize(()=>{
    db.run('INSERT INTO emp(nombre,email,mensaje) VALUES(?,?,?)', [req.query.nombre, req.query.email, req.query.mensaje], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("ingreso ok !");
      res.sendFile(path.join(__dirname,'./public/indexGET.html'));
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