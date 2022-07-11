import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { BackendApi } from "../mixin/backend";
import SellListing from "../modals/sell-modal";
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

    let result = {
        nftDetails,
        imgURI: '',
        tokenURI: '',
    }

    const assetQueryArray = assetQuery?.split(":") ?? [];

    if (assetQueryArray.length === 2) {
        const _tokenAddress: string = assetQueryArray[0];
        const _tokenId: string = assetQueryArray[1];

        const backend = new BackendApi();

        const tokenInfo = await backend.getTokenInfo(_tokenAddress, _tokenId);

        if (!tokenInfo) {
            return result;
        }

        const metadata = await axios.get(tokenInfo.result.token_uri);

        result.imgURI = metadata.data.image;
        result.tokenURI = tokenInfo.result.token_uri;

        nftDetails.tokenName = tokenInfo.result.token_name;
        nftDetails.tokenAddress = _tokenAddress;
        nftDetails.tokenId = _tokenId;
        nftDetails.owner = tokenInfo.result.owner;
    }

    return result;
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
        if (data && (!data?.nftDetails.tokenAddress || !data.nftDetails.tokenId)) {
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
                    <img src={data.imgURI} alt="" className="object-contain h-[400px] w-[400px] rounded-xl border-2 border-gray-100" />
                    {/* nft details */}
                    <div className="p-4">
                        <h1 className="font-semibold text-xl">{data.nftDetails.tokenName} #{data.nftDetails.tokenId}</h1>
                        <div className="text-gray-500 text-[0.9em]">
                            Owned by <span className="text-blue-500">{data.nftDetails.owner ?? ''}</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-md p-4 bg-slate-50 my-8 text-[0.9em]">
                            <h3 className="font-semibold text-gray-500">Token Contract</h3>
                            <div className="font-semibold text-blue-500">{data.nftDetails.tokenAddress ?? ''}</div>
                            <h3 className="font-semibold text-gray-500 mt-2">Token URI</h3>
                            <div className="font-semibold text-blue-500 break-all">
                                <a href={data.tokenURI} target="_blank" rel="noopener noreferrer">
                                    {data.tokenURI ?? ''}
                                </a>
                            </div>
                        </div>
                        {/* since not listed, we can add sell button */}
                        <SellListing
                            tokenAddress={data.nftDetails.tokenAddress}
                            tokenId={data.nftDetails.tokenId}
                            tokenName={data.nftDetails.tokenName}
                            classNames={'mt-8'}
                        />
                    </div>
                </div>
            }
        </div>
    );
}

export default TokenDetails;