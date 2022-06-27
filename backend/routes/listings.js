const express = require('express');

const listingsRoutes = express.Router();

const dbo = require('../db/conn');

const COLLECTION_NAME = 'listings';

// READ schema.txt for schema

/**
 * fetch list of nfts listed on marketplace
 */
listingsRoutes.route('/listings').get(function (req, res) {
    const dbClient = dbo.getDB();

    dbClient
        .collection(COLLECTION_NAME)
        .find({})
        .limit(1000)
        .sort({ listing_date: -1 })
        .toArray(function (err, result) {
            if (err) {
                res.status(400).json({ success: false, msg: `error fetching listed nfts` });
            } else {
                res.status(200).json({ success: true, result: result });
            }
        });
});

/**
 * fetch the list of nfts listed by a particular seller
 */
listingsRoutes.route('/listings/:seller').get(function (req, res) {
    const dbClient = dbo.getDB();

    try {
        if (!req.params ||
            !req.params.seller) 
        {
            throw new Error('invalid params');
        }

        const { seller } = req.params;

        const filter = {
            seller: seller
        }
        
        dbClient
            .collection(COLLECTION_NAME)
            .find(filter)
            .limit(1000)
            .sort({ listing_date: -1 })
            .toArray(function (err, result) {
                if (err) {
                    throw new Error('error fetching seller listed nfts');
                } else {
                    res.status(200).json({ success: true, result: result });
                }
            });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
})

/**
 * fetch a specific listing by token address-token id pair
 */
listingsRoutes.route('/listings/:token_address/:token_id').get(function (req, res) {
    const dbClient = dbo.getDB();

    try {

        if (!req.params ||
            !req.params.token_address ||
            !req.params.token_id) 
        {
            throw new Error('invalid params');
        }

        const { token_address, token_id } = req.params;

        const filter = {
            token_address: token_address,
            token_id: token_id
        }

        dbClient
            .collection(COLLECTION_NAME)
            .findOne(filter, function (err, result) {
                if (err) {
                    console.error(err);
                    throw new Error(`error fetching listing - ${token_address}-${token_id}`);
                } else {
                    console.log(`Found entry - ${req.params.token_address} - ${req.params.token_id}`);
                    res.status(200).json({ success: true, result: result });
                }
            });

    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

/**
 * update the price of the token address-token id par
 */
listingsRoutes.route('/listings/:token_address/:token_id').put(function (req, res) {
    const dbClient = dbo.getDB();

    try {

        if (!req.params ||
            !req.params.token_address ||
            !req.params.token_id ||
            !req.body ||
            !req.body.price) 
        {
            throw new Error('invalid params');
        }

        const { token_address, token_id } = req.params;

        const updateQuery = {
            $set: {
                price: req.body.price,
                modified_Date: new Date(),
            }
        }

        const filter = {
            token_address: token_address,
            token_id: token_id
        }

        dbClient
            .collection(COLLECTION_NAME)
            .findOneAndUpdate(
                filter,
                updateQuery,
                function (err, result) {
                    if (err) {
                        console.error(err);
                        throw new Error(`error updating listing - ${token_address}-${token_id}`);
                    } else {
                        console.log(`Updated listing - ${token_address} - ${token_id}`);
                        res.status(200).json({ success: true, result: result });
                    }
                }
            );

    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

/**
 * add a listed nft on the marketplace
 * 
 * price in Wei
 */
listingsRoutes.route('/listings').post(function (req, res) {
    const dbClient = dbo.getDB();

    try {

        if (!req.body ||
            !req.body.token_address ||
            !req.body.token_id ||
            !req.body.seller ||
            !req.body.price) 
        {
            throw new Error('invalid body request');
        }

        const listing = {
            token_address: req.body.token_address,
            token_id: req.body.token_id,
            seller: req.body.seller,
            price: req.body.price,
            listing_date: new Date(),
            modified_date: new Date(),
        }

        dbClient
            .collection(COLLECTION_NAME)
            .insertOne(listing, function (err, result) {
                if (err) {
                    console.error(err);
                    throw new Error('error creating new listing');
                } else {
                    console.log(`Added a new entry - id: ${result.insertedId}`);
                    res.status(201).json({ success: true, result: result });
                }
            });

    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

/**
 * delete a listed nft (when sold)
 */
listingsRoutes.route('/listings/:token_address/:token_id').delete(function (req, res) {
    const dbClient = dbo.getDB();

    try {

        if (!req.params ||
            !req.params.token_address ||
            !req.params.token_id) 
        {
            throw new Error('invalid params');
        }

        const { token_address, token_id } = req.params;

        console.log(`${token_address}`);

        const filter = {
            token_address: token_address,
            token_id: token_id
        }

        dbClient
            .collection(COLLECTION_NAME)
            .findOneAndDelete(filter, function (err, result) {
                if (err) {
                    console.error(err);
                    throw new Error(`error deleting listing ${token_address}-${token_id}`);
                } else {
                    console.log(`Deleted entry - ${req.params.token_address} - ${req.params.token_id}`);
                    res.status(200).json({ success: true, result: result });
                }
            });

    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

module.exports = listingsRoutes;