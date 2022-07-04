import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import useSWR from "swr";
import { MARKETPLACE_ABI } from "../abi/marketplaceABI";
import { useAppSelector } from "../store/hooks";
import toast from "react-hot-toast";
import BuyModal from "../modals/buy-modal";
import { DEFAULT_ETH_PROVIDER, PROGRESS } from "../constants";
import { BackendApi } from "../mixin/backend";
import { ListingDetails } from "../types/types";
import { BASIC_NFT_ABI } from "../abi/basicnftABI";
import CancelListingModal from "../modals/cancel-listing-modal";
import CancelListing from "../modals/cancel-listing-modal";
import UpdateListing from "../modals/update-listing-modal";
import { MARKETPLACE_HUMAN_ABI } from "../abi/marketplaceHumanABI";


const fetchSalesDetails = async (
    key: string,
    marketplaceAddress: string,
    assetQuery: string
) => {
    let result: ListingDetails = {
        tokenAddress: '',
        tokenId: '',
        tokenName: '',
        price: '0',
        seller: '',
    };

    const assetQueryArray = assetQuery?.split(":") ?? [];

    if (assetQueryArray.length === 2) {
        const _tokenAddress: string = assetQueryArray[0];
        const _tokenId: string = assetQueryArray[1];

        const backend = new BackendApi();

        const listing = await backend.getListingByToken(_tokenAddress, _tokenId);

        if (!listing) {
            return result;
        }

        const provider = ethers.getDefaultProvider(DEFAULT_ETH_PROVIDER);
        const nft = new ethers.Contract(_tokenAddress, BASIC_NFT_ABI, provider);
        result.tokenName = await nft.name();

        result.tokenAddress = _tokenAddress;
        result.tokenId = _tokenId;
        result.price = listing.result.price;
        result.seller = listing.result.seller;
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
        if (data && (!data?.tokenAddress || !data.tokenId)) {
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
                    <div className="rounded-xl bg-slate-800 h-[400px] w-[400px]"></div>
                    {/* nft details */}
                    <div className="p-4">
                        <h1 className="font-semibold text-xl">{data.tokenName} #{data.tokenId}</h1>
                        <div className="text-gray-500 text-[0.9em]">
                            Owned by <span className="text-blue-500">{data.seller.toLowerCase()}</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-md p-4 bg-slate-50 my-4 text-[0.9em]">
                            <h3 className="font-semibold text-gray-500">Contract</h3>
                            <div className="font-semibold text-blue-500">{data.tokenAddress ?? ''}</div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-md p-4 bg-slate-50 mt-4 mb-8">
                            <h3 className="font-semibold text-zinc-400 text-[0.9em]">Current price</h3>
                            <div className="font-bold text-3xl text-neutral-800">{ethers.utils.formatEther(data.price)} ETH</div>
                        </div>
                        {
                            (
                                data.seller &&
                                data.price
                            ) 
                            ?
                            userState.wallet === data.seller
                            ?
                            <div className="flex">
                                {/* seller can update or cancel listing */}
                                <UpdateListing
                                    tokenAddress={data.tokenAddress}
                                    tokenId={data.tokenId}
                                    price={data.price}
                                />
                                <CancelListing 
                                    tokenAddress={data.tokenAddress}
                                    tokenId={data.tokenId}
                                />
                            </div>
                            :
                            <button 
                                className="bg-black font-bold text-sm text-white py-2 px-6 rounded mr-4"
                                onClick={() => onBuy(data.tokenAddress, data.tokenId, data.price)}>
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