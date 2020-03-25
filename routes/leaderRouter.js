const express = require('express');
const leaderRouter = express.Router();

const mongoose = require('mongoose');
const Leader = require('../models/leader_model');
const authenticate = require('../authenticate');
const cors = require('./cors');

leaderRouter.route('/').options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
    .get(cors.cors,(req, res, next) => {
        Leader.find({}).then((leaders) => {
            res.status(200).json(leaders);
        }).catch((err) => {
            next(err);
        });
    })
    .post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verfiyAdmin, (req, res, next) => {
        Leader.create(req.body).then((leader) => {
            console.log(`promotion created: ${leader.name}`);
            res.status(200).json(leader);
        }).catch((err) => {
            next(err);
        });
    })
    .put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verfiyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verfiyAdmin,(req, res, next) => {
        Leader.deleteMany({}).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            next(err);
        });;
    });

leaderRouter.route('/:leaderID').options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
    .get(cors.cors,(req, res, next) => {
        Leader.findById(req.params.leaderID).then((leaders) => {
            res.status(200).json(leaders);
        }).catch((err) => {
            next(err);
        });
    })
    .post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verfiyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('post operation not supported on /promotions/:leaderID');
    })
    .put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verfiyAdmin,(req, res, next) => {
        Leader.findByIdAndUpdate(req.params.leaderID, { $set: req.body }, { new: true }).then((leader) => {
            res.status(200).json(leader);
        }).catch((err) => {
            next(err);
        });
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verfiyAdmin,(req, res, next) => {
        Leader.findByIdAndRemove(req.params.leaderID).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            next(err);
        });
    });
module.exports = leaderRouter;