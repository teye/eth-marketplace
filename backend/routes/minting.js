const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

const upload = multer({ dest: '/tmp/' });

const mintingRoutes = express.Router();


/**
 * call pinata sdk to upload image and metadata
 */
mintingRoutes.route('/minting').post(upload.any(), function (req, res, next) {
    console.log('request: ', req.body.username);
    pinata.testAuthentication().then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = mintingRoutes;