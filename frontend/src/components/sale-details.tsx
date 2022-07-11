import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import useSWR from "swr";
import { useAppSelector } from "../store/hooks";
import toast from "react-hot-toast";
import BuyModal from "../modals/buy-modal";
import { PROGRESS } from "../constants";
import { BackendApi } from "../mixin/backend";
import { ListingDetails } from "../types/types";
import CancelListing from "../modals/cancel-listing-modal";
import UpdateListing from "../modals/update-listing-modal";
import { MARKETPLACE_HUMAN_ABI } from "../abi/marketplaceHumanABI";
import axios from "axios";


const fetchSalesDetails = async (
    key: string,
    marketplaceAddress: string,
    assetQuery: string
) => {
    let listingDetails: ListingDetails = {
        tokenAddress: '',
        tokenId: '',
        tokenName: '',
        price: '0',
        seller: '',
    };

    let result = {
        listingDetails,
        tokenURI: '',
        imgURI: '',
    }

    const assetQueryArray = assetQuery?.split(":") ?? [];

    if (assetQueryArray.length === 2) {
        const _tokenAddress: string = assetQueryArray[0];
        const _tokenId: string = assetQueryArray[1];

        const backend = new BackendApi();

        const listing = await backend.getListingByToken(_tokenAddress, _tokenId);

        if (!listing) {
            return result;
        }

        const nftDetails = await backend.getTokenInfo(_tokenAddress, _tokenId);
        const metadata = await axios.get(nftDetails.result.token_uri);

        result.tokenURI = nftDetails.result.token_uri;
        result.imgURI = metadata.data.image

        listingDetails.tokenName = nftDetails.result.token_name ?? "";
        listingDetails.tokenAddress = _tokenAddress;
        listingDetails.tokenId = _tokenId;
        listingDetails.price = listing.result.price;
        listingDetails.seller = listing.result.seller;
    }

    return result;
}

let provider: any;

function SaleDetails() {
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? "a";
    let navigate = useNavigate();
    const { assetQuery } = useParams();
    const { data, error } = useSWR([`swr_fetch_sales_details`, marketplaceAddress, assetQuery], fetchSalesDetails);
    
    const userState = useAppSelector((state) => state.user);
    const [openModal, setOpenModal] = useState(false);
    const [progress, setProgress] = useState("");
    const [txHash, setTxHash] = useState("");

    useEffect(() => {
        if (data && (!data?.listingDetails.tokenAddress || !data.listingDetails.tokenId)) {
            navigate("/error", { replace: true })
        }
    }, [data, navigate]);

    const onCloseModal = () => {
        // delay for the animation to close the modal
        setOpenModal(false);
        setTimeout(() => {
            setProgress("");
            setTxHash("");
        }, 200);
    };

    /**
     * buy an NFT
     * @param tokenAddress 
     * @param tokenId 
     * @param price Wei 
     * @returns 
     */
    const onBuy = async (
        tokenAddress: string, 
        tokenId: string, 
        price: string
    ) => {
        if (!userState.isConnected) {
            console.error("Please connect wallet to continue.");
            toast.error("Please connect wallet to continue.");
            return;
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);

        // check user balance
        const userBal = await provider.getBalance(userState.wallet);
        
        if (ethers.BigNumber.from(userBal).lt(ethers.BigNumber.from(price))) {
            console.error(`Insufficient balance; Require ${ethers.utils.formatEther(price)} ETH; Please top up wallet.`);
            toast.error(`Insufficient balance; Require ${ethers.utils.formatEther(price)} ETH; Please top up wallet.`);
            return;
        }

        const signer = provider.getSigner();

        setOpenModal(true);

        const deployed = new ethers.Contract(marketplaceAddress, MARKETPLACE_HUMAN_ABI, signer);

        try {
            const tx = await deployed.buy(
                tokenAddress, 
                tokenId,
                {
                    value: price
                }
            );
            console.log("tx: ", tx.hash);
            setProgress(PROGRESS.CONFIRM);
            setTxHash(tx.hash);
        } catch (e) {
            console.error(e);
            onCloseModal();
        }
    }
    
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
                        <h1 className="font-semibold text-xl">{data.listingDetails.tokenName} #{data.listingDetails.tokenId}</h1>
                        <div className="text-gray-500 text-[0.9em]">
                            Owned by <span className="text-blue-500">{data.listingDetails.seller.toLowerCase()}</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-md p-4 bg-slate-50 my-4 text-[0.9em]">
                            <h3 className="font-semibold text-gray-500">Token Contract</h3>
                            <div className="font-semibold text-blue-500">{data.listingDetails.tokenAddress ?? ''}</div>
                            <h3 className="font-semibold text-gray-500 mt-2">Token URI</h3>
                            <div className="font-semibold text-blue-500 break-all">
                                <a href={data.tokenURI} target="_blank" rel="noopener noreferrer">
                                    {data.tokenURI ?? ''}
                                </a>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-md p-4 bg-slate-50 mt-4 mb-8">
                            <h3 className="font-semibold text-zinc-400 text-[0.9em]">Current price</h3>
                            <div className="font-bold text-3xl text-neutral-800">{ethers.utils.formatEther(data.listingDetails.price)} ETH</div>
                        </div>
                        {
                            (
                                data.listingDetails.seller &&
                                data.listingDetails.price
                            ) 
                            ?
                            userState.wallet === data.listingDetails.seller
                            ?
                            <div className="flex">
                                {/* seller can update or cancel listing */}
                                <UpdateListing
                                    tokenAddress={data.listingDetails.tokenAddress}
                                    tokenId={data.listingDetails.tokenId}
                                    price={data.listingDetails.price}
                                />
                                <CancelListing 
                                    tokenAddress={data.listingDetails.tokenAddress}
                                    tokenId={data.listingDetails.tokenId}
                                />
                            </div>
                            :
                            <button 
                                className="bg-black font-bold text-sm text-white py-2 px-6 rounded mr-4"
                                onClick={() => onBuy(
                                    data.listingDetails.tokenAddress, 
                                    data.listingDetails.tokenId, 
                                    data.listingDetails.price)
                                }>
                                Buy now
                            </button>
                            :
                            <></>
                        }

                    </div>
                </div>
            }
            <BuyModal
                openModal={openModal}
                progress={progress}
                txHash={txHash}
                onClose={onCloseModal}
            />
        </div>
    );
}

export default SaleDetails;