import { ethers } from "ethers";
import { useState } from "react";
import { Link } from "react-router-dom";
import useSWR from 'swr';
import { BASIC_NFT_ABI } from "../abi/basicnftABI";
import { MARKETPLACE_ABI } from "../abi/marketplaceABI";
import { ZERO_ADDRESS } from "../constants";
import { BackendApi } from "../mixin/backend";
import { ListingDetails } from "../types/types";
import ShopCard from "./shop-card";


let provider;

const fetchNFTs = async (
    key: string, 
    marketplaceAddress: string
) => {
    const backend = new BackendApi();
    let sales: ListingDetails[] = [];
    
    provider = ethers.getDefaultProvider("http://localhost:8545");
    provider = new ethers.providers.Web3Provider(window.ethereum);

    const listings = await backend.getListings();

    if (!listings) {
        return sales;
    }

    for (const item of listings.result) {
        const nft = new ethers.Contract(item.token_address, BASIC_NFT_ABI, provider);
        const tokenName = await nft.name();

        sales.push({
            tokenAddress: item.token_address,
            tokenName: tokenName,
            tokenId: item.token_id,
            seller: item.seller,
            price: item.price,
        });
    }

    console.log(listings);

    return sales;
};

function Explore() {
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? ZERO_ADDRESS;
    const { data, error } = useSWR([`swr_fetch_nft`, marketplaceAddress], fetchNFTs);

    return (
        <div className="container mx-auto">
            <h1 className="font-semibold font-kanit text-3xl my-4">Explore NFTs</h1>
            <div>
                {
                    !data ?
                    <p>Loading...</p>
                    :
                    data.length === 0 
                    ?
                    <p>No NFTs listed yet.</p>
                    :

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-20 gap-y-8 mb-8">
                        {
                            data.map((item, index) => {
                                return (
                                    <Link 
                                        key={index}
                                        to={`/token/${item.tokenAddress}:${item.tokenId}`}>
                                        <ShopCard 
                                            {...item}
                                        />
                                    </Link>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Explore;