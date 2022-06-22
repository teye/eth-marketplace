const express = require('express');

// mintedRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /minted.

const mintedRoutes = express.Router();

const dbo = require('../db/conn');

/**
 * fetch the list of created nfts
 */
mintedRoutes.route('/minted').get(async function (req, res) {
    const dbClient = dbo.getDB();

    dbClient
        .collection('minted')
        .find({})
        .limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send('Error fetching minted nfts!');
            } else {
                res.json(result);
            }
        });
});

/**
 * add a newly minted nft
 */
mintedRoutes.route('/minted').post(function (req, res) {
    const dbClient = dbo.getDB();

    const minted = {
        token_address: "0x0123",
        token_id: "1",
        wallet_address: "0xdeadbeef",
        minted_date: new Date()
    }

    dbClient
        .collection('minted')
        .insertOne(minted, function (err, result) {
            if (err) {
                console.error(err);
                res.status(400).send('Error creating new minted entry!');
            } else {
                console.log(`Added a new entry - id: ${result.insertedId}`);
                res.status(201).json(result);
            }
        });
});

module.exports = mintedRoutes;