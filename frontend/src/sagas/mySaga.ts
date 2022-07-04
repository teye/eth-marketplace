import { ethers } from "ethers";
import { MARKETPLACE_HUMAN_ABI } from "../abi/marketplaceHumanABI";
import { DEFAULT_ETH_PROVIDER } from "../constants";
import { BackendApi } from "../mixin/backend";
import { fork, take } from 'redux-saga/effects'
import { APP_MOUNTED } from "../store/blockchainSlice";



const buyListener = async (from: string, tokenAddress: string, tokenId: number) => {
    console.log(`marketplace bought event: ${from}, ${tokenAddress}, ${tokenId}`);

    const _tokenAddress = tokenAddress.toLowerCase();
    const _tokenId = tokenId.toString().toLowerCase();
    const _from = from.toLowerCase();
    
    // call db to update owner and remove listing
    const backend = new BackendApi();
    await backend.deleteListing(_tokenAddress, _tokenId);
    await backend.updateToken(_tokenAddress, _tokenId, _from);
}

const sellListener = async (from: string, tokenAddress: string, tokenId: number, price: number) => {
    console.log(`marketplace sell event: ${from}, ${tokenAddress}, ${tokenId}, ${price}`);

    // call db to add new sell listing
    const _tokenAddress = tokenAddress.toLowerCase();
    const _tokenId = tokenId.toString().toLowerCase();
    const _from = from.toLowerCase();
    const _price = price.toString();

    const backend = new BackendApi();

    await backend.addListing({
        token_address: _tokenAddress,
        token_id: _tokenId,
        seller: _from,
        price: _price,
    });
}

const updateListener = async (from: string, tokenAddress: string, tokenId: number, price: number) => {
    // call db to update listing details
    console.log(`marketplace update event: ${from}, ${tokenAddress}, ${tokenId}, ${price}`);

    const _tokenAddress = tokenAddress.toLowerCase();
    const _tokenId = tokenId.toString().toLowerCase();
    const _from = from.toLowerCase();
    const _price = price.toString();

    const backend = new BackendApi();

    await backend.updateListing(
        _tokenAddress, 
        _tokenId, 
        {
            price: _price
        }
    );
}

const cancelListener = async (from: string, tokenAddress: string, tokenId: number) => {
    // call db to remove listing
    console.log(`marketplace cancel event: ${from}, ${tokenAddress}, ${tokenId}`);

    const _tokenAddress = tokenAddress.toLowerCase();
    const _tokenId = tokenId.toString().toLowerCase();
    // const _from = from.toLowerCase();

    const backend = new BackendApi();

    await backend.deleteListing(_tokenAddress, _tokenId);
}

function* initEthListener() {
    console.log("eth listener running...");
    
    try {
        let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? "a";
        const provider = ethers.getDefaultProvider(DEFAULT_ETH_PROVIDER);
        const marketplace = new ethers.Contract(marketplaceAddress, MARKETPLACE_HUMAN_ABI, provider);

        provider.once("block", () => {
            marketplace.on("NFTBought", buyListener);
            marketplace.on("NFTListed", sellListener);
            marketplace.on("NFTDeListed", cancelListener);
            marketplace.on("ListingUpdated", updateListener);
        });

        marketplace.removeAllListeners("NFTBought");
        marketplace.removeAllListeners("NFTListed");
        marketplace.removeAllListeners("NFTDeListed");
        marketplace.removeAllListeners("ListingUpdated");
    } catch (e) {
        console.error(e);
    }
}

/**
 * marketplace event listener
 * to listen for buy, sell, update, cancel event and update db
 */
function* mySaga() {
    console.log("my saga running...");
    yield take(APP_MOUNTED);
    yield fork(initEthListener);
}

export default mySaga;