const axios = require('axios').default;

type NFTJSON = {
    token_address: string;
    token_id: string;
    minter: string;
    owner: string;
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
            const response = await axios.post(`${this.endpoint}/tokens`, nftJSON);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * fetch list of nfts minted by wallet
     * @param minter wallet address
     * @returns 
     */
    async getMintedNFTs(minter: string) {
        console.log("get minted nft");
        try {
            const response = await axios.get(`${this.endpoint}/tokens/minted/${minter}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * fetch list of nfts owned by wallet
     * @param owner 
     * @returns 
     */
    async getOwnedNFTs(owner: string) {
        console.log("get owned nft");
        try {
            const response = await axios.get(`${this.endpoint}/tokens/owned/${owner}`);
            return response.data;
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
        try {
            const response = await axios.get(`${this.endpoint}/listings/${tokenAddress}/${tokenId}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * gets all the listings sold by a particular seller
     * @param seller wallet address
     */
    async getListingsBySeller(seller: string) {
        console.log("get listings by a particular seller");
        try {
            const response = await axios.get(`${this.endpoint}/listings/${seller}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}