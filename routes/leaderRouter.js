const express = require('express');
const promoRouter = express.Router();

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the leaders to you!');
})
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all leaders');
});

promoRouter.route('/:leaderID')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send the leader ' + req.params.leaderID + ' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('post operation not supported on /leaders/:leaderID');
})
.put((req, res, next) => {
    res.end('Will update the leader ' + req.params.leaderID + '!');
})
.delete((req, res, next) => {
    res.end('Will delete the leader ' + req.params.leaderID + '!');
});


module.exports = promoRouter;