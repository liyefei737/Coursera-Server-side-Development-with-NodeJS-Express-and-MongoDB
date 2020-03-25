const express = require('express');
const cors = require('cors');

const app = express();

const origins_whitelist = ['https://localhost:3000', 'http://localhost:3443'];

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;

    if (origins_whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true,
        }
    } else {
        corsOptions = {
            origin: false
        };
    }
    callback(null, corsOptions);
};


module.exports.cors = cors();
module.exports.corsWithOptions = cors(corsOptionsDelegate);
