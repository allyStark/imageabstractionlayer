var express = require('express');
var Searched = require('./models/Searched.js');
var mongoose = require("mongoose");
var Bing = require('node-bing-api')({accKey: "2e38696ed05d40ffaf84f8b659b84930"});

var app = express();

//main page
app.use(express.static(__dirname + "/public"));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/imageLayerQueries');

app.get("/api/:thisSearch", function(req,res,next){
    var thisSearch = req.params.thisSearch;
    var offset = 0;
    if(req.query.offset){
        offset = req.query.offset;
    }
    
    var query = new Searched({
        query: thisSearch
    });

    query.save(function(err){
        if(err){
            console.log("error saving query");
        }
    });

    //console.log(thisSearch.toString());
    Bing.images(thisSearch, {
        top: 20,   // Number of results (max 50)
        skip: offset    // Skip first 3 result
    }, function(err, response, body){
        if(err){
            res.send("Error");
        }
        
        var returnArr = body.value.map(function(entry){
            return {
                "name": entry.name,
                "thumbnail url": entry.thumbnailUrl,
                "display page url": entry.hostPageDisplayUrl
            }
        });
        res.end(JSON.stringify(returnArr, null, 4));
    });
});

app.get("/queries", function(req,res,next){
    Searched.find({}, {query:1, createdAt: 1, _id:0})
        .exec(function(err, queries){
            res.end(JSON.stringify(queries.reverse(), null, 4))
        });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("made connection");
});