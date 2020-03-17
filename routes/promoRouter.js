const express = require('express');
const promoRouter = express.Router();

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the promos to you!');
})
.post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promos');
})
.delete((req, res, next) => {
    res.end('Deleting all promos');
});

promoRouter.route('/:promoID')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send the promotion ' + req.params.promoID + ' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('post operation not supported on /promos/:promoID');
})
.put((req, res, next) => {
    res.end('Will update the promotion ' + req.params.promoID + '!');
})
.delete((req, res, next) => {
    res.end('Will delete the promotion ' + req.params.promoID + '!');
});


module.exports = promoRouter;