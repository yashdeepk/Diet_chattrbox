/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-undef: "off"*/

// Create an app
var server = require("diet");
var fs = require("fs");
var wss = require("./websockets-server");
var mime = require("mime-types");
var app = server();
app.listen("http://localhost:8000");


var staticDiet = require("diet-static")({
  path: app.path + "/app/"
});

app.view("file", staticDiet);

app.missing(function($) {
  $.header("Content-Type", "text/html");
  $.status("404");
  fs.readFile(__dirname + "/app/error.html", function(error, content) {
    if (error) throw error;
    $.end(content.toString());
  });
});

app.error(function($) {
  $.end($.statusCode + "\n" + $.statusMessage + "\n" + $.fail.error.message);
});

// When http://localhost:8000/ is requested, respond with "Hello World!"
app.get("/", function($){
  $.redirect("index.html");
});
