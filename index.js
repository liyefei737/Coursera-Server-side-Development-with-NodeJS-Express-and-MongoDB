const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dishRouter = require('./dishRouter');
const promoRouter = require('./promoRouter');
const leaderRouter = require('./leaderRouter');
    
const app = express(); 

app.use(bodyParser.json()); // this sets req.body
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/dishes',dishRouter);
app.use('/promos',promoRouter);
app.use('/leaders',leaderRouter);


const port = 12345;
const hostname = 'localhost';
const server = http.createServer(app);
server.listen(port,hostname);