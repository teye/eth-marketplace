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
    let seller = '';

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
                tokenId = `${listing.tokenId}`;
                seller = listing.seller;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return {
        tokenAddress,
        tokenId,
        seller
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
        <div className="container mx-auto">
            {
                !data ?
                <p>Loading</p>
                :
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* nft image */}
                    <div className="rounded-xl bg-slate-800 h-[400px] w-[400px]"></div>
                    {/* nft details */}
                    <div className="bg-blue-400">
                        <h1>Token Name #{data.tokenId}</h1>
                        <div>Owned by {data.seller.toLowerCase()}</div>
                        {/* add Buy button */}
                    </div>
                </div>
            }
        </div>
    );
}

export default TokenDetails;