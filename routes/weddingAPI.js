var express = require('express');


module.exports = function(dbConn,dbModels){
    var router = express.Router();
    var dbMusicRequestModel = dbModels.dbModelMusicRequests;
    var dbModelDateRequests = dbModels.dbModelDateRequests;
    var dbModelPollQuestions = dbModels.dbModelPollQuestions;
    var dbModelPollResults = dbModels.dbModelPollResults;
    var dbModelSeatingArrangement = dbModels.dbModelSeatingArrangement;

    router.get('/api/dateRequests', function(req, res) {
        // use mongoose to get all music in the database
        dbModelDateRequests.find(function(err, dateRequests) {
            if (err)
                res.send(err);

            res.json(dateRequests); // return all todos in JSON format
        });
    });
    router.post('/api/dateRequests', function(req, res) {


        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // create a todo, information comes from AJAX request from Angular
        dbModelDateRequests.create({
            requesterName : req.body.requesterName,
            requesterMsg : req.body.requesterMsg,
            requestDate: new Date().toDateString(),
            requestIp:ip,
            done : false
        }, function(err, dateRequest) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            dbModelDateRequests.find(function(err, dateRequests) {
                if (err)
                    res.send(err);
                res.json(dateRequests);
            });
        });

    });


    router.get('/api/musicRequests', function(req, res) {
        // use mongoose to get all music in the database
        dbMusicRequestModel.find(function(err, musicRequests) {
            if (err)
                res.send(err);

            res.json(musicRequests); // return all todos in JSON format
        });
    });
    router.post('/api/musicRequests', function(req, res) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // create a todo, information comes from AJAX request from Angular
        dbMusicRequestModel.create({
            artistName : req.body.artistName,
            songName : req.body.songName,
            requestDate: new Date().toDateString(),
            requestIp: ip,
            done : false
        }, function(err, musicRequest) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            dbMusicRequestModel.find(function(err, musicRequests) {
                if (err)
                    res.send(err);
                res.json(musicRequests);
            });
        });

    });


    router.get('/api/pollQuestions', function(req, res) {
        // use mongoose to get all poll questiosn
        dbModelPollQuestions.find(function(err, pollQuestions) {
            if (err)
                res.send(err);
//            console.log("pollquestions");
//            console.log(pollQuestions);

            res.json(pollQuestions); // return all poll questions in JSON format
        });
    });


    router.get('/api/seatingArrangement', function(req, res) {

        // use mongoose to get all poll questiosn
        dbModelSeatingArrangement.find(function(err, seatingArrangement) {
            if (err)
                res.send(err);
//            console.log("seating arrangements");
//            console.log(seatingArrangement);

            res.json(seatingArrangement); // return all poll questions in JSON format
        });
    });


    router.post('/api/pollResults', function(req, res) {

        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        dbModelPollResults.create({
            QID : req.body.QID,
            A : req.body.A,
            resultDate: new Date().toDateString(),
            requestIp: ip,
            done : false
        }, function(err, pollResult) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            dbModelPollResults.find({QID:pollResult.QID}, function(err, pollResults) {
                if (err)
                    res.send(err);

                res.json(pollResults);
            });
        });

    });

    return router;

}