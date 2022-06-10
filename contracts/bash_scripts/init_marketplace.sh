#!/bin/bash
echo "Running init marketplace script..."
npx hardhat --network localhost run ../scripts/deploy-dummy-nft.js
npx hardhat --network localhost run ../scripts/deploy-marketplace.js
npx hardhat --network localhost run ../scripts/mint-and-list-nft.js

