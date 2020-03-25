// for common prefix /upload
const express = require('express');
const dishRouter = express.Router();

const mongoose = require('mongoose');
const Dish = require('../models/dish_model');
const authenticate = require('../authenticate');

const multer = require('multer');

const storageEngine = multer.diskStorage({
    destination: (req, fileInfo, cb) => {
        cb(null, 'public/images');        
    },
    filename: (req, fileInfo, cb) => {
        cb(null, fileInfo.originalname);        
    }
});

const fileFilter = (req, fileInfo, cb) => {
    if (!fileInfo.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('you can only upload images.'), false);
    } else {
        cb(null, true)
    }
};

const multerOptions = {
    storage: storageEngine,
    fileFilter: fileFilter
};

const uploadEngine = multer(multerOptions);

const uploadRouter = express.Router();

uploadRouter.route('/').post(authenticate.verifyUser, authenticate.verfiyAdmin,uploadEngine.single('imageFile'), (req, res, next) => {
    res.status(200).json(req.file);
});

module.exports = uploadRouter;