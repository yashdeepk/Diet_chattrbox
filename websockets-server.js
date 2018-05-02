/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-undef: "off"*/

var WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
var topic = "";


console.log("websockets server started");


ws.on("connection", function(socket) {
  console.log("client connection established");

  if (topic) {
    socket.send("*** Topic is " + topic + "");
  }

  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on("message", function(data) {
    console.log("message received: " + data);

    var topicString = "";
    if (data.startsWith("/topic")) {
      topic = data.split("/topic")[1].trim();
      topicString = ("*** Topic has changed to " + topic + "");
    } else {
      topicString = data;
      messages.push(topicString);
    }

    ws.clients.forEach(function(clientSocket) {
      clientSocket.send(topicString);
    });
  });
});
