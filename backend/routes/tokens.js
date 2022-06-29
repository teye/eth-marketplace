const express = require('express');

// mintedRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /tokens.

// READ schema.txt for schema

const tokensRoutes = express.Router();

const dbo = require('../db/conn');

/**
 * fetch the list of created nfts
 */
 tokensRoutes.route('/tokens').get(async function (req, res) {
    const dbClient = dbo.getDB();

    // can be improved by using pagination
    dbClient
        .collection('tokens')
        .find({})
        .limit(1000)
        .sort({ minted_date: -1 })
        .toArray(function (err, result) {
            if (err) {
                res.status(400).json({ success: false, msg: `error fetching minted nfts` });
            } else {
                res.status(200).json({ success: true, result: result });
            }
        });
});

/**
 * fetch the list of nfts minted by particular wallet
 */
 tokensRoutes.route('/tokens/minted/:minter').get(async function (req, res) {
    const dbClient = dbo.getDB();

    const query = {
        minter: req.params.minter
    }

    dbClient
        .collection('tokens')
        .find(query)
        .limit(1000)
        .sort({ minted_date: -1 })
        .toArray(function (err, result) {
            if (err) {
                res.status(400).json({ success: false, msg: `error fetching minted nfts - ${req.params.minter}` });
            } else {
                res.status(200).json({ success: true, result: result });
            }
        });
});

/**
 * fetch the list of nfts owned by particular wallet
 */
 tokensRoutes.route('/tokens/owned/:owner').get(async function (req, res) {
    const dbClient = dbo.getDB();

    const query = {
        owner: req.params.owner
    }

    dbClient
        .collection('tokens')
        .find(query)
        .limit(1000)
        .sort({ minted_date: -1 })
        .toArray(function (err, result) {
            if (err) {
                res.status(400).json({ success: false, msg: `error fetching owned nfts - ${req.params.owner}` });
            } else {
                res.status(200).json({ success: true, result: result });
            }
        });
});

/**
 * update the token entry, e.g updating the owner when it changed hands
 */
tokensRoutes.route('/tokens/:token_address/:token_id').put(function (req, res) {
    const dbClient = dbo.getDB();

    try {
        if (!req.params ||
            !req.params.token_address ||
            !req.params.token_id ||
            !req.body ||
            !req.body.owner) 
        {
            throw new Error('invalid params');
        }

        const { token_address, token_id } = req.params;

        const updateQuery = {
            $set: {
                owner: req.body.owner,
                modified_date: new Date(),
            }
        }

        const filter = {
            token_address: token_address,
            token_id: token_id,
        }

        dbClient
            .collection('tokens')
            .findOneAndUpdate(
                filter,
                updateQuery,
                function (err, result) {
                    if (err) {
                        console.error(err);
                        throw new Error(`error updating tokens - ${token_address}-${token_id}`);
                    } else {
                        console.log(`Updated tokens - ${token_address} - ${token_id}`);
                        res.status(200).json({ success: true, result: result });
                    }
                }
            );

    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

/**
 * add a newly minted nft
 */
 tokensRoutes.route('/tokens').post(function (req, res) {
    const dbClient = dbo.getDB();

    try {
        if (!req.body || !req.body.token_address || !req.body.token_id || !req.body.minter || !req.body.owner) {
            throw new Error('invalid body request');
        }

        const minted = {
            token_address: req.body.token_address,
            token_id: req.body.token_id,
            minter: req.body.minter,
            owner: req.body.owner,
            minted_date: new Date(),
            modified_date: new Date(),
        }
    
        dbClient
            .collection('tokens')
            .insertOne(minted, function (err, result) {
                if (err) {
                    console.error(err);
                    throw new Error('error creating new minted entry');
                } else {
                    console.log(`Added a new entry - id: ${result.insertedId}`);
                    res.status(201).json({ success: true, result: result });
                }
            });

    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    } 
});

module.exports = tokensRoutes;