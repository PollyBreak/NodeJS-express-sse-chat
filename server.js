var express = require('express');
var SSE = require('express-sse')
const path = require('path');

var app = express();
var sse = new SSE(); // server sent events allows to send events to all the clients easily

app.listen(3000, function () {
    console.log('Server is listening on port 3000!');
});

app.use('/static', express.static(path.join(__dirname, 'mychat')));

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'chat.html'));
})

app.get('/', function (req, res) {
    res.send("Hi")
});

app.get('/json', function(req,res){
    var answerObj = {
        text:'Hi',
        numbers:[1,2,3]
    }
    res.json(answerObj);
})

app.get('/echo', function(req, res){
    var echo = req.query.input;
    if (!echo) { //if there is no parameters
        return res.status(400).json({error: 'Input is empty'});
    }
    var response = {
        normal:echo,
        shouty:echo.toString().toUpperCase(),
        characterCount:echo.toString().length,
        backwards:echo.toString().split('').reverse().join('')
    }
    res.json(response)
})

app.get('/sse', function(req, res,next){
    //res.flush uses for sending compressed responds to clients, but it does not work with SSE, so we need to make it empty
    res.flush = () => {};
    next(); //sse is middleware, so we need to use next
}, sse.init)

app.get('/chat', function(req, res){
    const message = req.query.message; //get parameter message from the query
    const name = req.query.name;
    console.log("server sends message: '"+message+"' from:"+name);
    sse.send({'message':message, 'name':name}); //sse sends json object to all clients
    res.status(200).send("Message was sent to all users");
})