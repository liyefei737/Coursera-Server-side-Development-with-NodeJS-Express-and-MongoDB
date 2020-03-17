const express = require('express');
const dishRouter = express.Router();

dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all dishes');
});

dishRouter.route('/:dishID')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send the dish ' + req.params.dishID + ' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('post operation not supported on /dishes/:dishID');
})
.put((req, res, next) => {
    res.end('Will update the dish ' + req.params.dishID + '!');
})
.delete((req, res, next) => {
    res.end('Will delete the dish ' + req.params.dishID + '!');
});


module.exports = dishRouter;