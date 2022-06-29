import { ethers } from "ethers";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { BASIC_NFT_ABI } from "../../abi/basicnftABI";
import { DEFAULT_ETH_PROVIDER } from "../../constants";
import { BackendApi } from "../../mixin/backend";
import { useAppSelector } from "../../store/hooks";
import { NFTDetails } from "../../types/types";
import NFTCard from "../nft-card";


let provider;

const fetchUserMinted = async (
    key: string,
    wallet: string,
) => {
    const backend = new BackendApi();
    let nfts: NFTDetails[] = [];

    provider = ethers.getDefaultProvider(DEFAULT_ETH_PROVIDER);
    provider = new ethers.providers.Web3Provider(window.ethereum);
    
    const listings = await backend.getMintedNFTs(wallet);

    if (!listings) {
        return nfts;
    }

    for (const item of listings.result) {
        const nft = new ethers.Contract(item.token_address, BASIC_NFT_ABI, provider);
        const tokenName = await nft.name();

        nfts.push({
            tokenAddress: item.token_address,
            tokenName: tokenName,
            tokenId: item.token_id,
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

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-20 gap-y-8 mb-8">
                        {
                            data.map((item, index) => {
                                return (
                                    <Link 
                                        key={index}
                                        to={`/token/${item.tokenAddress}:${item.tokenId}`}>
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