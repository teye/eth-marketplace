const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

const upload = multer({ dest: '/tmp/' });

const mintingRoutes = express.Router();


/**
 * call pinata sdk to upload image and metadata
 * 
 * @param req.files[0]          User uploaded image file as a Blob
 * @param req.body.name         nft name
 * @param req.body.description  nft description
 * @param req.body.attributes   user uploaded metadata [{ trait_type: '', value: '' }]
 * @returns the metadata ipfs hash if uploaded successfully
 * {
 *   IpfsHash
 *   PinSize
 *   Timestamp
 * }
 */
mintingRoutes.route('/minting').post(upload.any(), function (req, res, next) {
    console.log('request file: ', req.files);
    console.log('req body: ', req.body);

    try {
        if (!req.body ||
            !req.body.name ||
            !req.body.description ||
            !req.body.attributes || 
            !req.files)
        {
            throw new Error('invalid params');
        }

        // file has been uploaded to /tmp as another name
        const uploadedDest = req.files[0].filename;
        const readableStreamForFile = fs.createReadStream(`/tmp/${uploadedDest}`);

        const { name, description, attributes } = req.body;

        let metadata = {
            "description": description,
            "external_url": "https://image.com",
            "image": "https://storage.com",
            "name": name,
            "attributes": JSON.parse(attributes),
        }

        pinata.pinFileToIPFS(readableStreamForFile).then((result) => {
            console.log(result);
            if (result) {
                const imgIPFSUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    
                console.log("uploading metadata to ipfs");
    
                metadata["external_url"] = imgIPFSUrl;
                metadata["image"] = imgIPFSUrl;
                
                // upload metadata
                pinata.pinJSONToIPFS(metadata).then((result) => {
                    console.log("pin json to ipfs");
                    console.log(result);
                    res.status(200).json({ success: true, result: result });
                }).catch((err) => {
                    console.log(err);
                    throw new Error(err);
                })
            }
        }).catch((err) => {
            console.log(err);
            throw new Error(err);
        })
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

module.exports = mintingRoutes;