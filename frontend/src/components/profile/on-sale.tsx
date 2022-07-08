import { Link } from "react-router-dom";
import useSWR from "swr";
import { BackendApi } from "../../mixin/backend";
import { useAppSelector } from "../../store/hooks";
import { ListingDetails } from "../../types/types";
import ShopCard from "../shop-card";


const fetchUserListings = async (
    key: string,
    wallet: string,
) => {
    const backend = new BackendApi();
    let sales: ListingDetails[] = [];

    const listings = await backend.getListingsBySeller(wallet);

    if (!listings) {
        return sales;
    }

    for (const item of listings.result) {
        const nftDetails = await backend.getTokenInfo(item.token_address, item.token_id);

        sales.push({
            tokenAddress: item.token_address,
            tokenName: nftDetails.result.token_name ?? "",
            tokenURI: nftDetails.result.token_uri ?? "",
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

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[8rem] gap-y-8 mb-8 lg:gap-x-[18rem]">
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