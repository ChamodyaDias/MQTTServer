var mosca = require('mosca');

var settings = {
  port: 1883,
};

var moscaServer = new mosca.Server(settings);
module.exports.moscaServer = moscaServer

moscaServer.on('clientConnected', function (client) {
  console.log('client connected', client.id);
});

var message = {
  topic: 'get/gpsdata',
  payload: 'send', // or a Buffer
  qos: 0, // 0, 1, or 2
  retain: false // or true
};

var gpsdataObj = {
  status: "reset",
  data: "",
  lastUpdated: new Date()
}

async function publishGetDataRequest(req, res) {
  moscaServer.publish(message, function () {
    console.log("request published")
  });
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("timeout");
    }, 30000);

    // fired when a message is published
    moscaServer.on('published', function (packet, client) {
      if (packet.topic == "client/connected") {
        console.log(client.id);
      }
      else if (packet.topic == "data/notready") {
        console.log("data Not ready from client : " + client.id);
      }
      else if (packet.topic == "send/gpsdata") {
        console.log('Published', client.id);
        const cent = Buffer.from(packet.payload);
        var data = decoder.write(cent)
        var jsonData = JSON.parse(data);
        console.log(jsonData);
        gpsdataObj.data = jsonData;
        gpsdataObj.lastUpdated = new Date()
        gpsdataObj.status = "updated";
        console.log("data updated");
        resolve(gpsdataObj);
      }

    });
  }).then(obj => {
    console.log('done!');
    res.send(obj);
  }).catch(err => {
    console.log('error!');
    res.send({ 'error': err });
  })
}

module.exports.publishGetDataRequest = publishGetDataRequest

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

moscaServer.on('clientConnected', function (client) {
  console.log("Client connected :" + client.id);
})


// // fired when a message is published
// moscaServer.on('published', function (packet, client) {
//   if(packet.topic == "client/connected"){
//     console.log(client.id);
//   }
//   else if(packet.topic == "data/notready"){
//     console.log("data Not ready from client : " + client.id);
//   }
//   else if(packet.topic == "send/gpsdata"){
//     console.log('Published', client.id);
//     const cent = Buffer.from(packet.payload);
//     var data = decoder.write(cent)
//     var jsonData = JSON.parse(data);
//     console.log(jsonData);
//     gpsdataObj.data = jsonData;
//     gpsdataObj.lastUpdated = new Date()
//     gpsdataObj.status = "updated";
//     console.log("data updated");
//   }

// });

moscaServer.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running on port : ' + settings.port);
}
module.exports.setup = setup
