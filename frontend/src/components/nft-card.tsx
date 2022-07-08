import axios from "axios";
import useSWR from "swr";
import { NFTDetails } from "../types/types";


const fetchShopCard = async (
    key: string,
    tokenURI: string
) => {
    let details = {
        imgURI: "",
    }

    if (!tokenURI) {
        return details;
    }

    const metadata = await axios.get(tokenURI);
    details.imgURI = metadata.data.image

    return details
}

/**
 * used to display nft items without price info
 */
function NFTCard(props: NFTDetails) {
    const { data, error } = useSWR([`swr_fetch_shop_card`, props.tokenURI], fetchShopCard);

    return (
        <div className="rounded-xl border border-gray-300 max-w-fit md:min-w-fit p-3 shadow-md text-sm">
            {
                !data ?
                <div className="h-80 w-80 rounded-xl skeleton">
                </div>
                :
                <>
                <div className="mb-4 h-80 w-80">
                    {
                        data &&
                        data.imgURI
                        ?
                        <img src={data.imgURI} alt="" className="object-contain h-80 w-80" />
                        :
                        <div className="rounded-xl bg-gray-400 h-72 w-60">
                        </div>
                    }
                </div>
                <div className="flex justify-between">
                    {/* token info */}
                    <div className="text-[1rem] font-bold">
                        {props.tokenName ?? 'Token Name'} #{props.tokenId ?? '0'}
                    </div>
                </div>
                </>
            }
        </div>
    );
}

export default NFTCard;