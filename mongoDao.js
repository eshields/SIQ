/**
 * Created by spacemunky on 4/7/16.
 */
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

var mongoclient = mongo.MongoClient;


//REST API calls go here.
//Get All
router.get('/api/v2/entries.json', function(req, res) {
    // find({},{content:0})
    mongoclient.connect('mongodb://localhost:27017/test', function(err, db) {
        if (err) {
            throw err;
        }db.collection('entries').find({},{subject:1}).toArray(function(err, result){
            if (err) {
                throw err;
            }
            console.log(result);
            res.status(201).json(result);
            db.close();
        })
    });
});

// IDEMPOTENT - You can repeat the operation as many times as you want without changing state.
// Create
router.post('/api/v2/entries.json', function(req, res){
    console.log(req.body);
    var subject = req.body.subject;
    var content = req.body.content;
    mongoclient.connect('mongodb://localhost:27017/test', function(err, db) {
        if (err) {
            throw err;
        }db.collection('entries').insert(req.body, function(err, result) {
            if (err) {
                throw err;
            }
            console.log('inserted ' + result.insertedIds[0]);
            res.status(201).json(result.insertedIds[0]);
            db.close();
        });
    });
});

// Read
router.get('/api/v2/entries/:id.json', function(req, res){
    // find({_id:${id}}, {content:1})
    var id = new mongo.ObjectId(req.params.id);
    mongoclient.connect('mongodb://localhost:27017/test', function(err, db) {
        if (err) {
            throw err;
        }db.collection('entries').find({_id:id}).toArray( function(err, result) {
            if (err) {
                throw err;
            }
            console.log('db get ' + result[0]);
            res.status(201).json(result[0]);
            db.close()
        });
    });
});

// Update
router.put('/api/v2/entries/:id.json', function(req, res){
    // insert({})
    var id = mongo.ObjectId(req.params.id);
    var _subject = req.body.subject;
    var _content = req.body.content;
    mongoclient.connect('mongodb://localhost:27017/test', function(err, db) {
        if (err) {
            throw err;
        }db.collection('entries').update({_id:id}, {subject:_subject, content:_content}, function(err, result) {
            if (err) {
                throw err;
            }
            console.log('db update');
            res.status(204);
            db.close();
        });
    });
});

// Delete
router.delete('/api/v2/entries/:id', function(req, res){
    var id = mongo.ObjectId(req.params.id);
    mongoclient.connect('mongodb://localhost:27017/test', function(err, db) {
        if (err) {
            throw err;
        }db.collection('entries').remove({_id:id}, true, function(err, result) {
            if (err) {
                throw err;
            }
            console.log('db delete ' + id);
            res.status(204);
            db.close();
        });
    });
});

module.exports = router;