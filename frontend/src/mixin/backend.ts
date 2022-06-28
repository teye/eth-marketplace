const axios = require('axios').default;

type NFTJSON = {
    token_address: string;
    token_id: string;
    wallet_address: string;
}

type ListingJSON = {
    token_address: string;
    token_id: string;
    seller: string;
    price: string;
}

export class BackendApi {
    endpoint: string;

    constructor(_backendUrl?: string, _backendPort?: string) {
        let backendURL = _backendUrl ? _backendUrl : process.env.REACT_APP_BACKEND_URL;     // http://localhost
        let backendPort = _backendPort ? _backendPort : process.env.REACT_APP_BACKEND_PORT; // 5000
        this.endpoint = `${backendURL}:${backendPort}`; // http://localhost:5000
    }

    /**
     * add newly minted NFT to db
     * @param nftJSON NFTJSON
     * @returns 
     */
    async addMintedNFT(nftJSON: NFTJSON) {
        console.log("add minted nft to backend");
        try {
            const response = await axios.post(`${this.endpoint}/minted`, nftJSON);
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * add listing to db
     * @param listingJSON 
     * @returns 
     */
    async addListing(listingJSON: ListingJSON) {
        console.log("add listings to backend");
        try {
            const response = await axios.post(`${this.endpoint}/listings`, listingJSON);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * get all the nft listings currently sold on the marketplace
     * @returns 
     * [
     *  {
     *    token_address,
     *    token_id
     *    price
     *    seller
     *  }
     * ]
     */
    async getListings() {
        console.log("get listings");
        try {
            const response = await axios.get(`${this.endpoint}/listings`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * get a particular nft listing details
     * @param tokenAddress nft contract address
     * @param tokenId nft token id
     * @returns 
     * {
     *   token_address
     *   token_id
     *   price
     *   seller
     * }
     */
    async getListingByToken(tokenAddress: string, tokenId: string) {
        console.log("get listings by token address-token id");
        console.log(tokenAddress);
        console.log(tokenId);
        try {
            const response = await axios.get(`${this.endpoint}/listings/${tokenAddress}/${tokenId}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}