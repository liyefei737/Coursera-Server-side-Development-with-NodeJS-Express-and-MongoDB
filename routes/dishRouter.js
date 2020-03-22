// for common prefix /dishes

const express = require('express');
const dishRouter = express.Router();

const mongoose = require('mongoose');
const Dish = require('../models/dish_model');
const authenticate = require('../authenticate');


dishRouter.route('/')
    .get((req, res, next) => {
        Dish.find({}).then((dishes) => {
            res.status(200).json(dishes);
        }).catch((err) => {
            next(err);
        });
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        Dish.create(req.body).then((dish) => {
            console.log(`dish created: ${dish.name}`);
            res.status(200).json(dish);
        }).catch((err) => {
            next(err);
        });
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Dish.deleteMany({}).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            next(err);
        });;
    });

dishRouter.route('/:dishID')
    .get((req, res, next) => {
        Dish.findById(req.params.dishID).then((dishes) => {
            res.status(200).json(dishes);
        }).catch((err) => {
            next(err);
        });
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('post operation not supported on /dishes/:dishID');
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        Dish.findByIdAndUpdate(req.params.dishID, { $set: req.body }, { new: true }).then((dish) => {
            res.status(200).json(dish);
        }).catch((err) => {
            next(err);
        });
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Dish.findByIdAndRemove(req.params.dishID).then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            next(err);
        });
    });



dishRouter.route('/:dishID/comments')
    .get((req, res, next) => {
        Dish.findById(req.params.dishID).then((dish) => {
            if (dish === null) {
                const err = new Error(`Dish ${req.params.dishID} not found`);
                err.status = 404;
                next(err);
                return;
            }
            res.status(200).json(dish.comments);
        }).catch((err) => {
            next(err);
        });
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        Dish.findById(req.params.dishID)
            .then((dish) => {
                if (dish === null) {
                    const err = new Error(`Dish ${req.params.dishID} not found`);
                    err.status = 404;
                    next(err);
                    return;
                }
                dish.comments.push(req.body);
                dish.save().then((dish) => {
                    res.status(200).json(dish);
                });
            }).catch((err) => {
                next(err);
            });
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/:dishID/comments');
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Dish.findById(req.params.dishID)
            .then((dish) => {
                if (dish === null) {
                    const err = new Error(`Dish ${req.params.dishID} not found`);
                    err.status = 404;
                    next(err);
                    return;
                }
                dish.comments = [];
                dish.save().then((dish) => {
                    res.status(200).json(dish);
                });
            }).catch((err) => {
                next(err);
            });
    });


dishRouter.route('/:dishID/comments/:commentID')
    .get((req, res, next) => {
        Dish.findById(req.params.dishID).then((dish) => {
            // dish does not exist
            if (dish === null) {
                const err = new Error(`Dish ${req.params.dishID} not found`);
                err.status = 404;
                next(err);
                return;
            }
            // dish exists but this comment does not exist
            if (dish.comments.id(req.params.commentID) === null) {
                const err = new Error(`comment ${req.params.commentID} not found`);
                err.status = 404;
                next(err);
                return;
            }

            res.status(200).json(dish.comments.id(req.params.commentID));
        }).catch((err) => {
            next(err);
        });
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/:dishID/comments/:commentID');
    })
    .put((req, res, next) => {
        Dish.findById(req.params.dishID)
            .then((dish) => {
                // dish does not exist
                if (dish === null) {
                    const err = new Error(`Dish ${req.params.dishID} not found`);
                    err.status = 404;
                    next(err);
                    return;
                }
                // dish exists but this comment does not exist
                if (dish.comments.id(req.params.commentID) === null) {
                    const err = new Error(`comment ${req.params.commentID} not found`);
                    err.status = 404;
                    next(err);
                    return;
                }

                // update the comment, only allow update on rating or comment after the comment first gets posted
                const comment = dish.comments.id(req.params.commentID);
                if (req.body.rating) {
                    comment.rating = req.body.rating;
                }
                if (req.body.comment) {
                    comment.comment = req.body.comment;
                }
                dish.save().then((dish) => {
                    res.status(200).json(dish);
                });
            }).catch((err) => {
                next(err);
            });
    })
    .delete((req, res, next) => {
        Dish.findById(req.params.dishID)
            .then((dish) => {
                if (dish === null) {
                    const err = new Error(`Dish ${req.params.dishID} not found`);
                    err.status = 404;
                    next(err);
                    return;
                }

                // dish exists but this comment does not exist
                if (dish.comments.id(req.params.commentID) === null) {
                    const err = new Error(`comment ${req.params.commentID} not found`);
                    err.status = 404;
                    next(err);
                    return;
                }

                dish.comments.id(req.params.commentID).remove();
                dish.save().then((dish) => {
                    res.status(200).json(dish);
                });
            }).catch((err) => {
                next(err);
            });
    });

module.exports = dishRouter;