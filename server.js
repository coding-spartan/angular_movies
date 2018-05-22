var express = require('express');
var app = express();
var path = require('path');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movies');
mongoose.Promise = global.Promise;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(express.static( __dirname + '/public/dist/public' ));





// app.get("*", function(req, res) {
//     res.sendFile(__dirname + "/public/dist/public/index.html");
//     })

// required: [true, "Name cannot be blank."],  
// description:{type: String, required: true, default: " "},
var MovieSchema = new mongoose.Schema({
    title: {type: String, minlength: [3, "Title must have at least 3 characters"]},
    user: {type: Array, minlength: [3, "Reviewer name must have at least 3 characters"]},
    stars: {type: Array, required: [true, "Star rating cannot be blank."]},
    review: {type: Array, minlength: [3, "Reviews must have at least 3 characters"]}
  }, {timestamps: true});

mongoose.model('Movie', MovieSchema);
var Movie = mongoose.model('Movie');

app.get('/movies', function(req, res){
        console.log("GET ALL MOVIE WORKS");
        Movie.find({}, function(err, data){
            if(err){
                res.json({message:"Error", error: err});
            }
            else {
                res.json({message:"Success", movie: data});
            }
        })
    });

app.get('/movies/:id', function(req, res){
        Movie.findOne({_id: req.params.id}, function(err, data){
               console.log("GET 1 MOVIE WORKS");
            if(err){
                res.json({message:"Error", error: err});
                console.log("ERRRORRRRR");
            }
            else {
                res.json({message:"Success", movie: data});
                console.log("YEAHHHHHHHHH");
            }
        })
    });


app.post('/movies/new', function(req, res){
        Movie.create({title: req.body.title, 
                      user: req.body.user,
                      stars: req.body.stars,
                      review: req.body.review},
                     function(err, data){
        if(err){
            res.json({message:"Error", error: err});
            console.log("ERRRRRORRRRRR")
        }
        else {
            res.json({message:"Success", movie: data});
            console.log("YEAH");
        }
    });
});
// {$set: req.body},

app.put('/movies/:id/review', function(req, res){
    // var opts = { runValidators: true };
    console.log("PATCHHHHHHH")
    Movie.update({_id: req.params.id} ,{$push: {user: req.body.user, stars: req.body.stars, review: req.body.review}},
                 function(err, data){
    if(err){
        res.json({message:"Error", error: err});
        console.log(error)
    }
    else {
        res.json({message:"Success", movie: data});
    }
    });
});

app.delete('/movies/:id/delete', function(req,res){
    Movie.remove({_id: req.params.id}, function(err, data){
        if(err){
            res.json({message:"Error", error: err});
        }
        else {
            res.json({message:"Success", movie: data});
        }
    })
});

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
  });

//   app.get("*", function(req, res) {
//     console.log("app ALLLL")
//     res.sendFile(__dirname + "/public/dist/public/index.html");
//     })
  
app.listen(8000, function(){
    console.log("listening on port 8000");
})
