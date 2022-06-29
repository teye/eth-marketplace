import { NFTDetails } from "../types/types";


/**
 * used to display nft items without price info
 */
function NFTCard(props: NFTDetails) {
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
            </div>
        </div>
    );
}

export default NFTCard;