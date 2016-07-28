/**
 * Created by spacemunky on 4/7/16.
 */
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'tysql' });

connection.connect();

//REST API calls go here.
router.get('/api/v1/entries.json', function(req, res) {
    connection.query("select subject, id from entries", function(err, rows, fields) {
        if (err) throw err;
        //console.log('The solution is: ', rows[0].solution);
        res.status(200).json(rows);
    });
});

// IDEMPOTENT - You can repeat the operation as many times as you want without changing state.
// Create
router.post('/api/v1/entries.json', function(req, res){
    // Store new entry and return id.
    console.log(req.body);
    // {"subject":"Two","content":"content2"}
    var subject = connection.escape(req.body.subject);
    var content = connection.escape(req.body.content);

    connection.query(`INSERT INTO entries (subject, content) VALUES( ${subject}, ${content})`, function(err, rows, fields) {
        if (err) throw err;
        res.status(201).json(rows.insertId);
    });
});

// Read
router.get('/api/v1/entries/:id.json', function(req, res){
    var id = connection.escape(req.params.id);
    //var id = req.params.id;
    console.log(`select * from entries where id = ${id}`);
    connection.query(`select * from entries where id = ${id}`, function(err, rows, fields) {
        if (err) throw err;
        res.status(200).json(rows[0]);
    });
});

// Update
router.put('/api/v1/entries/:id.json', function(req, res){
    var id = connection.escape(req.params.id);
    console.log(req.body);
    // {"subject":"Two","content":"content2"}
    var subject = connection.escape(req.body.subject);
    var content = connection.escape(req.body.content);
    //UPDATE siq.entries SET content = 'foo', subject = 'bar' WHERE id = 12
    connection.query(`update entries set subject = ${subject}, content = ${content} where id = ${id}`, function(err, rows, fields) {
        if (err) throw err;
    });
    console.log("server update");
    res.sendStatus(204);
});

// Delete
router.delete('/api/v1/entries/:id', function(req, res){
    var id = connection.escape(req.params.id);
    connection.query(`delete from entries where id = ${id}`, function(err, rows, fields) {
        if (err) throw err;
    });
    console.log("server delete");
    res.sendStatus(204);
});

module.exports = router;