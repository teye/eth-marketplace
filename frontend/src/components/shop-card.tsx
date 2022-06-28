import { ethers } from "ethers";
import { ListingDetails } from "../types/types";


/**
 * used to display items for sale
 */
function ShopCard(props: ListingDetails) {
    return (
        <div className="rounded-xl border border-gray-300 max-w-fit md:min-w-fit p-3 shadow-md text-sm">
            <div className="mb-4">
                <div className="rounded-xl bg-blue-400 h-72 w-60">
                </div>
            </div>
            <div className="flex justify-between">
                {/* token info */}
                <div className="text-[1rem] font-bold">
                    {props.tokenName ?? 'Token Name'} #{props.tokenId ?? '0'}
                </div>
                {/* price */}
                <div>
                    Price
                    <p>{ethers.utils.formatEther(`${props.price ?? '0'}`)} ETH</p>
                </div>
            </div>
        </div>
    );
}

export default ShopCard;