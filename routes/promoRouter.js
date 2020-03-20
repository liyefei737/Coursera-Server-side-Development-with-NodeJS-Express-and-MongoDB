const express = require('express');
const promoRouter = express.Router();

const mongoose = require('mongoose');
const Promotion = require('../models/promotion_model');

promoRouter.route('/')
    .get((req, res, next) => {
        Promotion.find({}).then((promos) => {
            res.status(200).json(promos);
        }).catch((err) => {
            next(err);
        });
    })
    .post((req, res, next) => {
        Promotion.create(req.body).then((promo) => {
            console.log(`promotion created: ${promo.name}`);
            res.status(200).json(promo);
        }).catch((err) => {
            next(err);
        });
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res, next) => {
        Promotion.deleteMany({}).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            next(err);
        });;
    });

promoRouter.route('/:promoID')
    .get((req, res, next) => {
        Promotion.findById(req.params.promoID).then((promos) => {
            res.status(200).json(promos);
        }).catch((err) => {
            next(err);
        });
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('post operation not supported on /promotions/:promoID');
    })
    .put((req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promoID, { $set: req.body }, { new: true }).then((promo) => {
            res.status(200).json(promo);
        }).catch((err) => {
            next(err);
        });
    })
    .delete((req, res, next) => {
        Promotion.findByIdAndRemove(req.params.promoID).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            next(err);
        });
    });
module.exports = promoRouter;