import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import useSWR from "swr";
import { MARKETPLACE_ABI } from "../abi/marketplaceABI";


const fetchNFTDetatils = async (
    key: string,
    marketplaceAddress: string,
    assetQuery: string
) => {
    let tokenAddress = '';
    let tokenId = '';

    const assetQueryArray = assetQuery?.split(":") ?? [];

    if (assetQueryArray.length === 2) {
        const _tokenAddress: string = assetQueryArray[0];
        const _tokenId: string = assetQueryArray[1];

        const provider = ethers.getDefaultProvider("http://localhost:8545");
        const deployedMP = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, provider);

        try {
            let listing = await deployedMP.getListing(_tokenAddress, _tokenId);
            if (listing && listing.tokenAddress !== "0x0000000000000000000000000000000000000000") {
                tokenAddress = listing.tokenAddress;
                tokenId = listing.tokenId;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return {
        tokenAddress,
        tokenId
    }
}

function TokenDetails() {
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? "a";
    let navigate = useNavigate();
    const { assetQuery } = useParams();
    const { data, error } = useSWR([`swr_fetch_nft_details`, marketplaceAddress, assetQuery], fetchNFTDetatils);
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenId, setTokenId] = useState('');

    useEffect(() => {
        if (data && (!data?.tokenAddress || !data.tokenId)) {
            navigate("/error", { replace: true })
        }
    }, [data, navigate]);
    
    return (
        <div>
            <h1>Token Details</h1>
            <p>{assetQuery}</p>
        </div>
    );
}

export default TokenDetails;