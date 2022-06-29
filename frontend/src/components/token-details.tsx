import { ethers } from "ethers";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { BASIC_NFT_ABI } from "../abi/basicnftABI";
import { DEFAULT_ETH_PROVIDER } from "../constants";
import { BackendApi } from "../mixin/backend";
import { NFTDetails } from "../types/types";


const fetchNFTDetails = async (
    key: string,
    assetQuery: string
) => {
    let nftDetails: NFTDetails = {
        tokenAddress: '',
        tokenId: '',
        tokenName: '',
        owner: '',
        isListed: false,
    };

    const assetQueryArray = assetQuery?.split(":") ?? [];

    if (assetQueryArray.length === 2) {
        const _tokenAddress: string = assetQueryArray[0];
        const _tokenId: string = assetQueryArray[1];

        const backend = new BackendApi();

        const tokenInfo = await backend.getTokenInfo(_tokenAddress, _tokenId);

        if (!tokenInfo) {
            return nftDetails;
        }

        const provider = ethers.getDefaultProvider(DEFAULT_ETH_PROVIDER);
        const nft = new ethers.Contract(_tokenAddress, BASIC_NFT_ABI, provider);
        nftDetails.tokenName = await nft.name();

        nftDetails.tokenAddress = _tokenAddress;
        nftDetails.tokenId = _tokenId;
        nftDetails.owner = tokenInfo.result.owner;
    }

    return nftDetails;
}

/**
 * Token details page shown when NFT is not listed on marketplace
 * see SaleDetails component for NFT detailed page listed on marketplace
 */
function TokenDetails() {
    let navigate = useNavigate();
    const { assetQuery } = useParams();
    const { data, error } = useSWR([`swr_fetch_nft_details`, assetQuery], fetchNFTDetails);

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
                    <div className="p-4">
                        <h1 className="font-semibold text-xl">{data.tokenName} #{data.tokenId}</h1>
                        <div className="text-gray-500 text-[0.9em]">
                            Owned by <span className="text-blue-500">{data.owner ?? ''}</span>
                        </div>
                    </div>
                    {/* since not listed, we can add sell button */}
                </div>
            }
        </div>
    );
}

export default TokenDetails;