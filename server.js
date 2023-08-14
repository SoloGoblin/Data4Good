//..............Include Express..................................//
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const {
  count
} = require('console');
const {
  off
} = require('process');



//..............Create an Express server object..................//
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);




//let server = require('http').Server(app);
//let io = require('socket.io')(server);
//..............Apply Express middleware to the server object....//
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static('public')); //specify location of static assests
app.set('views', __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library


app.use(require('./controllers/auth'));



//let socketapi =require('./controllers/socketConnections');
//socketapi.io.attach(server);//attach sockets to the server

app.use(require('./controllers/profile_controller'));


//.............Define server routes..............................//
//Express checks routes in the order in which they are defined

app.get('/', function (request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("index", {
    user: request.user,
    level:1,
    category:"default",
    source:0
    
  });
});
app.use("/topics",require("./controllers/topic"))


app.get('/:level/:category/:source', function (request, response) {///2/1
  const {level,category,source}=request.params
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("index", {
    user: request.user,
    level,
    category,
    source
    
  });
});











app.use("", function (request, response) {
  response.status(404);
  response.setHeader('Content-Type', 'text/html')
  response.render("error", {
    "errorCode": "404"
  });
});

//..............Start the server...............................//
const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server started at http://localhost:' + port + '.')
});