import { Link } from "react-router-dom";
import useSWR from "swr";
import { BackendApi } from "../../mixin/backend";
import { useAppSelector } from "../../store/hooks";
import { NFTDetails } from "../../types/types";
import NFTCard from "../nft-card";


const fetchUserMinted = async (
    key: string,
    wallet: string,
) => {
    const backend = new BackendApi();
    let nfts: NFTDetails[] = [];
    
    const listings = await backend.getMintedNFTs(wallet);

    if (!listings) {
        return nfts;
    }

    for (const item of listings.result) {
        const listing = await backend.getListingByToken(item.token_address, item.token_id);
        const isListed = listing.result ? true : false;

        nfts.push({
            tokenAddress: item.token_address,
            tokenName: item.token_name,
            tokenURI: item.token_uri,
            tokenId: item.token_id,
            owner: item.owner,
            isListed,
        });
    }

    return nfts;
}

/**
 * part of profile page
 * show nfts that are minted by connecting wallet
 */
 function Minted() {
    const userState = useAppSelector((state) => state.user);

    const { data, error } = useSWR(
        ['swr_fetch_user_minted', userState.wallet],
        fetchUserMinted
    );

    return (
        <div className="container mx-auto">
            <h1 className="font-semibold font-kanit text-2xl mt-4">Minted</h1>
            <div className="text-gray-900 mb-8">View the NFTs that you minted</div>
            <div>
                {
                    !data ?
                    <p>Loading...</p>
                    :
                    data.length === 0 
                    ?
                    <p>You do not owned any NFTs.</p>
                    :

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[8rem] gap-y-8 mb-8 lg:gap-x-[18rem]">
                        {
                            data.map((item, index) => {
                                return (
                                    <Link 
                                        key={index}
                                        to={
                                            item.isListed ? 
                                            `/sale/${item.tokenAddress}:${item.tokenId}` : 
                                            `/token/${item.tokenAddress}:${item.tokenId}`}>
                                        <NFTCard 
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

export default Minted;