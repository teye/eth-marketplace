import { ethers } from "ethers";
import { useState } from "react";
import { Link } from "react-router-dom";
import useSWR from 'swr';
import { MARKETPLACE_ABI } from "../abi/marketplaceABI";
import { ZERO_ADDRESS } from "../constants";
import ShopCard from "./shop-card";


let provider;

const fetchNFTs = async (
    key: string, 
    marketplaceAddress: string
) => {
    let sales = [];

    console.log(marketplaceAddress);
    provider = ethers.getDefaultProvider("http://localhost:8545");
    // provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);

    // @TODO refactor to read token address and token id from database
    const deployedMP = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, provider);

    // console.log(deployedMP);
    const listing1 = await deployedMP.getListing("0x5FbDB2315678afecb367f032d93F642f64180aa3", "1");
    const listing2 = await deployedMP.getListing("0x5FbDB2315678afecb367f032d93F642f64180aa3", "2");
    sales.push(listing1);
    sales.push(listing2);
    
    console.log("listing1: ", listing1);
    console.log("listing2: ", listing2);

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
                                            tokenId={`${item.tokenId}`}
                                            price={item.price}
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