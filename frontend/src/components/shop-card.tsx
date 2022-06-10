import { BigNumber } from "ethers";
import { ethers } from "ethers";

type Props = {
    tokenId: string;
    price: BigNumber;
}

/**
 * used to display items for sale
 */
function ShopCard(props: Props) {
    const {
        tokenId,
        price
    } = props;

    return (
        <div className="rounded-xl border border-gray-300 max-w-fit md:min-w-fit p-3 shadow-md text-sm">
            <div className="mb-4">
                <div className="rounded-xl bg-blue-400 h-72 w-60">
                </div>
            </div>
            <div className="flex justify-between">
                {/* token info */}
                <div>
                    Token Name #{tokenId}
                </div>
                {/* price */}
                <div>
                    Price
                    <p>{ethers.utils.formatEther(`${price}`)} ETH</p>
                </div>
            </div>
        </div>
    );
}

export default ShopCard;