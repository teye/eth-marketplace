import { ethers } from "ethers";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { BASIC_NFT_ABI } from "../../abi/basicnftABI";
import { DEFAULT_ETH_PROVIDER } from "../../constants";
import { BackendApi } from "../../mixin/backend";
import { useAppSelector } from "../../store/hooks";
import { ListingDetails } from "../../types/types";
import ShopCard from "../shop-card";

let provider;

const fetchUserListings = async (
    key: string,
    wallet: string,
) => {
    const backend = new BackendApi();
    let sales: ListingDetails[] = [];

    provider = ethers.getDefaultProvider(DEFAULT_ETH_PROVIDER);
    provider = new ethers.providers.Web3Provider(window.ethereum);
    
    const listings = await backend.getListingsBySeller(wallet);

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

    return sales;
}

/**
 * part of profile page
 * show nfts that are sold by connected wallet
 */
function OnSale() {
    const userState = useAppSelector((state) => state.user);

    const { data, error } = useSWR(
        ['swr_fetch_user_listings', userState.wallet],
        fetchUserListings
    );

    return (
        <div className="container mx-auto">
            <h1 className="font-semibold font-kanit text-2xl mt-4">On Sale</h1>
            <div className="text-gray-900 mb-8">View your listings currently put up at the marketplace.</div>
            <div>
                {
                    !data ?
                    <p>Loading...</p>
                    :
                    data.length === 0 
                    ?
                    <p>You have not listed any NFTs on the marketplace yet.</p>
                    :

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-20 gap-y-8 mb-8">
                        {
                            data.map((item, index) => {
                                return (
                                    <Link 
                                        key={index}
                                        to={`/sale/${item.tokenAddress}:${item.tokenId}`}>
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

export default OnSale;