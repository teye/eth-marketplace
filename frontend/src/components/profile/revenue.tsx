import { ethers } from "ethers";
import useSWR from "swr";
import { MARKETPLACE_HUMAN_ABI } from "../../abi/marketplaceHumanABI";
import { DEFAULT_ETH_PROVIDER } from "../../constants";
import WithdrawPayment from "../../modals/withdraw-modal";
import { useAppSelector } from "../../store/hooks";



const fetchProfits = async (
    key: string,
    marketplaceAddress: string,
    wallet: string,
) => {
    let revenue = "0";

    console.log(`fetching profits - ${wallet}`);

    let provider = ethers.providers.getDefaultProvider(DEFAULT_ETH_PROVIDER);
    const marketplace = new ethers.Contract(marketplaceAddress, MARKETPLACE_HUMAN_ABI, provider);

    try {
        const profits = await marketplace.getProceeds(wallet);
        revenue = profits.toString();
        console.log("profits: ", profits);
    } catch (err) {
        console.error(err);
    }

    return revenue;
}

/**
 * part of profile page
 * allows user to withdraw sales profits
 * @returns 
 */
function Revenue() {
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? "0x0";
    const userState = useAppSelector((state) => state.user);

    const { data, error } = useSWR(
        ['swr_fetch_profits', marketplaceAddress, userState.wallet],
        fetchProfits,
        { revalidateOnFocus: false, refreshInterval: 0 }
    );

    return (
        <div className="container mx-auto">
            <h1 className="font-semibold font-kanit text-2xl mt-4">Revenue</h1>
            <div className="text-gray-900 mb-8">Withdraw your sales profits.</div>
            {
                !data
                ?
                <p>Loading...</p>
                :
                <div>
                    <div className="flex text-gray-900">
                        <div className="mr-2 font-bold">Profits:</div> 
                        <div>{ethers.utils.formatEther(data)} ETH</div>
                    </div>
                    {
                        data !== "0"
                        &&
                        <WithdrawPayment 
                            profits={data}
                        />
                    }
                </div>
            }
        </div>
    );
}

export default Revenue;