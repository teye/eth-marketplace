import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import useSWR from "swr";
import { MARKETPLACE_ABI } from "../abi/marketplaceABI";
import { useAppSelector } from "../store/hooks";
import toast from "react-hot-toast";


const fetchNFTDetatils = async (
    key: string,
    marketplaceAddress: string,
    assetQuery: string
) => {
    let tokenAddress = '';
    let tokenId = '';
    let seller = '';
    let price = '';

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
                price = `${listing.price}`;
                seller = listing.seller;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return {
        tokenAddress,
        tokenId,
        seller,
        price
    }
}

let provider: any;

function TokenDetails() {
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? "a";
    let navigate = useNavigate();
    const { assetQuery } = useParams();
    const { data, error } = useSWR([`swr_fetch_nft_details`, marketplaceAddress, assetQuery], fetchNFTDetatils);
    
    const userState = useAppSelector((state) => state.user);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (data && (!data?.tokenAddress || !data.tokenId)) {
            navigate("/error", { replace: true })
        }
    }, [data, navigate]);

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

        provider = ethers.getDefaultProvider("http://localhost:8545");

        // check user balance
        const userBal = await provider.getBalance(userState.wallet);
        
        if (ethers.BigNumber.from(userBal).lt(ethers.BigNumber.from(price))) {
            console.error(`Insufficient balance; Require ${ethers.utils.formatEther(price)} ETH; Please top up wallet.`);
            toast.error(`Insufficient balance; Require ${ethers.utils.formatEther(price)} ETH; Please top up wallet.`);
            return;
        }

        const signer = provider.getSigner();

        const deployed = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, signer);

        try {
            const tx = await deployed.buy(
                tokenAddress, 
                tokenId,
                {
                    value: price
                }
            );
            console.log("tx: ", tx.hash);
        } catch (e) {
            console.error(e);
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
                        <h1 className="font-semibold text-xl">Token Name #{data.tokenId}</h1>
                        <div className="text-gray-500 text-[0.9em]">
                            Owned by <span className="text-blue-500">{data.seller.toLowerCase()}</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-md p-4 bg-slate-50 my-8">
                            <h3 className="font-semibold text-zinc-400 text-[0.9em]">Current price</h3>
                            <div className="font-bold text-3xl text-neutral-800">{ethers.utils.formatEther(data.price)} ETH</div>
                        </div>
                        <button 
                            className="bg-black font-bold text-sm text-white py-2 px-6 rounded mr-4"
                            onClick={() => onBuy(data.tokenAddress, data.tokenId, data.price)}>
                            Buy now
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}

export default TokenDetails;