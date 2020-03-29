// for common prefix /favorites
const express = require('express');
const favoritesRouter = express.Router();

const Dish = require('../models/dish_model');
const Favorites = require('../models/favorite_model');
const authenticate = require('../authenticate');
const cors = require('./cors');

favoritesRouter.route('/').options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({
            user: req.user._id
        }).populate('user').populate('dishes').then((favorites) => {
            res.status(200).json(favorites);
        }).catch((err) => {
            next(err);
        });
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.count({
            user: req.user._id
        }, (err, count) => {
            if (err) {
                next(err);
                return;
            }
            if (count === 0) {
                const favoriteDishes = req.body.map(dish => dish._id);
                Favorites.create({
                    user: req.user._id,
                    dishes: favoriteDishes
                }).then((favorites) => {
                    res.json(favorites);
                }).catch((err) => {
                    next(err);
                });
            } else if (count === 1) {
                Favorites.findOne({
                    user: req.user._id
                }).then((favorite_list) => {
                    for (let dish of req.body) {
                        if (favorite_list.dishes.indexOf(dish._id) === -1) {
                            favorite_list.dishes.push(dish._id);
                        }
                    }
                    favorite_list.save().then((favorite_list) => {
                        res.json(favorite_list);
                    }).catch((err) => {
                        next(err);
                    });
                }).catch((err) => {
                    next(err);
                });

            } else {
                next(new Error(`user ${req.user._id} has a wrong number of favorite lists.(i.e. not 0 or 1)`));
                return;
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.deleteOne({}).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            next(err);
        });
    });

favoritesRouter.route('/:dishID').options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Dish.findById(req.params.dishID).populate('comments.author').then((dishes) => {
            res.status(200).json(dishes);
        }).catch((err) => {
            next(err);
        });
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.count({
            user: req.user._id
        }, (err, count) => {
            if (err) {
                next(err);
                return;
            }
            if (count === 0) {

                Favorites.create({
                    user: req.user._id,
                    dishes: [req.params.dishID]
                }).then((favorites) => {
                    res.json(favorites);
                }).catch((err) => {
                    next(err);
                });
            } else if (count === 1) {
                Favorites.findOne({
                    user: req.user._id
                }).then((favorite_list) => {

                    if (favorite_list.dishes.indexOf(req.params.dishID) === -1) {
                        favorite_list.dishes.push(req.params.dishID);
                    }

                    favorite_list.save().then((favorite_list) => {
                        res.json(favorite_list);
                    }).catch((err) => {
                        next(err);
                    });
                }).catch((err) => {
                    next(err);
                });

            } else {
                next(new Error(`user ${req.user._id} has a wrong number of favorite lists.(i.e. not 0 or 1)`));
                return;
            }

        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verfiyAdmin, (req, res, next) => {
        Dish.findByIdAndUpdate(req.params.dishID, {
            $set: req.body
        }, {
            new: true
        }).then((dish) => {
            res.status(200).json(dish);
        }).catch((err) => {
            next(err);
        });
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.count({
            user: req.user._id
        }, (err, count) => {
            if (err) {
                next(err);
                return;
            }
            if (count === 0) {
                next(new Error('this user does not have a favorite list created.'))
            } else if (count === 1) {
                Favorites.findOne({
                    user: req.user._id
                }).then((favorite_list) => {
                    const index = favorite_list.dishes.indexOf(req.params.dishID);
                    if (index === -1) {
                        // supplied dish is not in this user's favorite list
                        res.json(favorite_list);
                    } else {
                        favorite_list.dishes.splice(index, 1);
                        favorite_list.save().then((favorite_list) => {
                            res.json(favorite_list);
                        }).catch((err) => {
                            next(err);
                        });
                    }
                }).catch((err) => {
                    next(err);
                });

            } else {
                next(new Error(`user ${req.user._id} has a wrong number of favorite lists.(i.e. not 0 or 1)`));
                return;
            }
        });

    });


module.exports = favoritesRouter;