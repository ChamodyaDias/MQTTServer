//app.js

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var moscaServer = require("./moscaServer");

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000)

app.get('/*', (req, res) => {
  console.log("get request called");
  res.send({ data: "success" });
})
app.get('/test', (req, res) => {
  console.log("get request called");
  res.send({ data: "success" });
})
app.post('/GPSData', (req, res) => {
  console.log("Post request called");
  moscaServer.publishGetDataRequest(req, res);
})

var server = http.createServer(app)
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})



// var mqtt = require('mqtt')
// var client  = mqtt.connect('mqtt://192.168.8.105')

// client.on('connect', function () {
//   setInterval(function() {
//   client.publish('get/gpsdata', 'send');
//   console.log('Message Sent');
//   }, 10000);
//   });

