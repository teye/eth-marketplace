import { Dialog, Transition } from "@headlessui/react";
import { ethers } from "ethers";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BASIC_NFT_ABI } from "../abi/basicnftABI";
import { MARKETPLACE_HUMAN_ABI } from "../abi/marketplaceHumanABI";
import { PROGRESS } from "../constants";
import { CheckCircle } from "../icons/check-circle";
import { Spinner } from "../icons/spinner";
import { useAppSelector } from "../store/hooks";
import { formatTxDisplay } from "../utils";

type Props = {
    tokenAddress: string
    tokenId: string
    tokenName: string
    classNames?: string
}

function SellListing(props: Props) {
    const {
        tokenAddress,
        tokenId,
        tokenName,
        classNames
    } = props;

    let provider: any;
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? "0x0";

    const userState = useAppSelector((state) => state.user);

    const [isOpen, setIsOpen] = useState(false);
    const [progress, setProgress] = useState("");
    const [txHash, setTxHash] = useState("");
    const [salePrice, setSalePrice] = useState("0.001");
    const [priceError, setPriceError] = useState("");

    const onClose = () => {
        // delay for the animation to close the modal
        setIsOpen(false);
        setTimeout(() => {
            setProgress("");
            setTxHash("");
            setPriceError("");
            setSalePrice("0.001");
        }, 200);
    };

    const onUpdatePrice = (event: any) => {
        setPriceError("");
        setSalePrice(event.target.value);
    }

    const onSubmit = async () => {
        if (!userState.isConnected) {
            console.error("Please connect wallet to continue.");
            toast.error("Please connect wallet to continue.");
            return;
        }

        setPriceError("");

        try {
            const salePriceWei = ethers.utils.parseEther(salePrice);

            if (salePriceWei.isZero()) {
                setPriceError("Price should be more than 0 ETH");
                return;
            }

            // input ok; proceed to sell
            setProgress(PROGRESS.APPROVAL);

            try {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
    
                const deployed = new ethers.Contract(marketplaceAddress, MARKETPLACE_HUMAN_ABI, signer);

                // approve
                const nftContract = new ethers.Contract(tokenAddress, BASIC_NFT_ABI, signer);
                const approvalTx = await nftContract.approve(marketplaceAddress, tokenId);
                await approvalTx.wait();

                setProgress(PROGRESS.PENDING);

                // sell
                const tx = await deployed.sell(
                    tokenAddress,
                    tokenId,
                    salePriceWei.toString()
                );
                console.log("tx: ", tx.hash);
                setProgress(PROGRESS.CONFIRM);
                setTxHash(tx.hash);

            } catch (e) {
                console.error(e);
                toast.error("Error updating the listing. Please try again.");
                onClose();
                return;
            }

        } catch (err) {
            console.error(err);
            setPriceError("Price should be a whole number or decimals, e.g. 1, 1.234");
            return;
        }
    }

    return (
        <div className={classNames}>
            <button 
                className="bg-black font-bold text-sm text-white py-2 px-6 rounded mr-4"
                onClick={() => setIsOpen(true)}
            >
                Sell
            </button>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                        {
                            progress === PROGRESS.CONFIRM

                            ?
                            <>
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                {`NFT Listed - ${tokenName}`}
                            </Dialog.Title>
                            <div className="mt-4 flex items-center justify-center">
                                <CheckCircle 
                                    height="30"
                                    width="30"
                                />
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 font-bold">
                                Transaction
                                </p>
                                <p className="text-sm text-gray-500 break-words">
                                {formatTxDisplay(txHash)}
                                </p>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500">
                                    You have listed the NFT on the marketplace.
                                </p>
                                <p className="text-sm text-gray-500">
                                    It would take a few minutes for it to show up on the marketplace 'Explore'.
                                </p>
                                <Link to={`/sale/${tokenAddress}:${tokenId}`}>
                                    <button 
                                        type="button" 
                                        className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 mt-2"
                                        onClick={onClose}
                                    >
                                        OK
                                    </button>
                                </Link>
                            </div>
                            </>

                            :

                            progress === PROGRESS.APPROVAL

                            ?

                            <>
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                
                            </Dialog.Title>
                            <div className="mt-4 flex items-center justify-center">
                                <Spinner
                                    height="30"
                                    width="30"
                                />
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500">
                                Please wait while we process the blockchain transaction.
                                </p>
                                <p className="text-sm text-gray-500">
                                Do not close this window.
                                </p>
                            </div>
                            </>

                            :

                            progress === PROGRESS.PENDING

                            ?

                            <>
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                Processing Sell
                            </Dialog.Title>
                            <div className="mt-4 flex items-center justify-center">
                                <Spinner
                                    height="30"
                                    width="30"
                                />
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500">
                                Please wait while we process the blockchain transaction.
                                </p>
                                <p className="text-sm text-gray-500">
                                Do not close this window.
                                </p>
                            </div>
                            </>

                            :

                            <>
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                Create Listing
                            </Dialog.Title>
                            <div className="mt-4 text-left text-gray-600">
                                Enter an asking price.
                            </div>
                            <form className="mt-4 text-left">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="salePrice" className="text-gray-900 font-bold">Price</label>
                                        <div className="flex items-center">
                                            <input 
                                                type="text"
                                                className="block w-96 mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black pr-10"
                                                value={salePrice}
                                                onChange={onUpdatePrice}
                                            />
                                            <div className="-ml-8 font-semibold">ETH</div>
                                        </div>
                                    </div>
                                    {
                                        priceError && <p className="text-sm text-red-500 font-bold">{priceError}</p>
                                    }
                                </div>
                            </form>
                            <button 
                                type="submit"
                                className="mt-12 bg-blue-600 text-white text-sm px-4 py-2 rounded font-bold text-left"
                                onClick={() => onSubmit()}
                                >
                                    Sell
                            </button>
                            </>
                        }
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default SellListing;