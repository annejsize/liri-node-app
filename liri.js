var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

//Load the keys here;
var keys = require('./keys.js');
var client = new Twitter(keys.twitterKeys);
//Variables
var userInput = process.argv;
var userRequest = "";
var userCommand = process.argv[2];
var songName;
var movieName = "";

//Write a loop that processes all the input entered by the user;
for (var i = 3; i < userInput.length; i++) {
  if (i > 3 && i < userInput.length) {
    userRequest = userRequest + " " + userInput[i];
  } else {
    userRequest += userInput[i];
  }
}

// SWITCH STATEMENTS //
switch (userCommand) {
  case "my-tweets":
    tweetTheTweets();
    break;

  case "spotify-this-song":
    if (userRequest === null || userRequest === undefined || userRequest==="") {
      songName = "the sign";
    } else {
      songName = userRequest;
    }
    spotTheSpotify(songName);
    break;

  case "movie-this":
    if (userRequest === null || userRequest === undefined|| userRequest==="") {
        movieName = "Mr Nobody";
  } else {
        movieName = userRequest;
  }
    findTheMovie(movieName);
    break;

  case "do-what-it-says":
    justDoIt();
    break;

  default:
    console.log("You entered: " + userCommand);
    console.log("Please enter any of the following commands:");
    console.log("my-tweets, spotify-this-song <a song title>, movie-this <a movie title>, do-what-it-says");

}
// FUNCTION FUN //

function tweetTheTweets() {

  // TWITTER //
  var params = {screen_name: 'JennaLiri', count: 20};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
          console.log("-----------| Tweet #" + i + "|-----");
          console.log(params.screen_name + " tweeted: '" + tweets[i].text + ".");
          console.log("on " + tweets[i].created_at.substring(0, 19));
          console.log("-----------------------------------");
      }
      //show your last 20 tweets and when they were created at in your terminal/bash window.
    } else {
      console.log(error);
    }
  });
}
// SPOTIFY //
function spotTheSpotify(songName) {
  var spotify = new Spotify({
    id: "00690367690b49e7a37cfd11136cd237",
    secret: "8fa1a6ee446649fa9e56616d0e75f7de"
  });
  spotify.search({
    type: 'track',
    query: songName
  }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // console.log(JSON.stringify(data, null, 2));
    // console.log(data.tracks);
    for (var i = 0; i < data.tracks.items.length; i++) {

      console.log("=============| RESULTS FOR " + songName + " |===============");
      console.log("The song name is " + data.tracks.items[i].name + ".");
      console.log("The preview link can be found here: " + data.tracks.items[i].external_urls.spotify);
      console.log("The song is in the following album: " + data.tracks.items[i].album.name + ".");
      console.log("The artist for this song is " + data.tracks.items[i].artists[0].name + ".");
      console.log("=======================/+++++++++\=========================");
    }
  });
}

function findTheMovie(movieName) {
  var request = require("request");
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      console.log("--| Movie Summary |----------------------------------------");
      console.log(JSON.parse(body).Title);
      console.log("===========================================================");
      console.log("Year: " + JSON.parse(body).Year);
      console.log("imdb Rating: " + JSON.parse(body).imdbRating);
      console.log(JSON.parse(body).Ratings[1].Source + " Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("--| Plot Summary |----------------------------------------");
      console.log(JSON.parse(body).Plot);
      console.log("-----------------------------<3---------------------------");
      console.log("Actors in movie: " + JSON.parse(body).Actors);
      console.log("----------------------------------------------->>>--------");
    } else {
      console.log(error);
    }
  });
}

function justDoIt() {
// DO IT WHAT IT SAYS YO
fs.readFile("random.txt", "utf8", function(error, data) {
  if (error) {
    return console.log(error);
  }
  result = data.split(',');
  songName = result[1];
  spotTheSpotify(songName);
});
}
