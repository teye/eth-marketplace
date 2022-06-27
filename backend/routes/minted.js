const express = require('express');

// mintedRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /minted.

// READ schema.txt for schema

const mintedRoutes = express.Router();

const dbo = require('../db/conn');

/**
 * fetch the list of created nfts
 */
mintedRoutes.route('/minted').get(async function (req, res) {
    const dbClient = dbo.getDB();

    // can be improved by using pagination
    dbClient
        .collection('minted')
        .find({})
        .limit(1000)
        .sort({ minted_date: -1 })
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send('Error fetching minted nfts!');
            } else {
                res.json(result);
            }
        });
});

/**
 * fetch the list of created nfts for a specific wallet
 */
mintedRoutes.route('/minted/:wallet_address').get(async function (req, res) {
    const dbClient = dbo.getDB();

    const query = {
        wallet_address: req.params.wallet_address
    }

    dbClient
        .collection('minted')
        .find(query)
        .limit(1000)
        .sort({ minted_date: -1 })
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send(`Error fetching minted nfts - ${req.params.wallet_address}!`);
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

    try {
        if (!req.body || !req.body.token_address || !req.body.token_id || !req.body.wallet_address) {
            throw new Error('invalid body request');
        }

        const minted = {
            token_address: req.body.token_address,
            token_id: req.body.token_id,
            wallet_address: req.body.wallet_address,
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

    } catch (error) {
        res.status(400).json({ msg: error.message });
    } 
});

module.exports = mintedRoutes;