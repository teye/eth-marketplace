import { Link } from "react-router-dom";
import useSWR from 'swr';
import { ZERO_ADDRESS } from "../constants";
import { BackendApi } from "../mixin/backend";
import { ListingDetails } from "../types/types";
import ShopCard from "./shop-card";


const fetchNFTs = async (
    key: string, 
    marketplaceAddress: string
) => {
    const backend = new BackendApi();
    let sales: ListingDetails[] = [];

    const listings = await backend.getListings();

    if (!listings) {
        return sales;
    }

    for (const item of listings.result) {
        const nftDetails = await backend.getTokenInfo(item.token_address, item.token_id);

        console.log(nftDetails);

        sales.push({
            tokenAddress: item.token_address,
            tokenId: item.token_id,
            tokenName: nftDetails.result.token_name ?? "",
            tokenURI: nftDetails.result.token_uri ?? "",
            seller: item.seller,
            price: item.price,
        });
    }

    console.log(listings);

    return sales;
};

function Explore() {
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? ZERO_ADDRESS;
    const { data, error } = useSWR(
        [`swr_fetch_nft`, marketplaceAddress], 
        fetchNFTs,
        { revalidateOnFocus: false, refreshInterval: 0 }
    );

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

export default Explore;