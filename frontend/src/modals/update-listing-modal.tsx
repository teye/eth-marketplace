import { Dialog, Transition } from "@headlessui/react";
import { ethers } from "ethers";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { MARKETPLACE_ABI } from "../abi/marketplaceABI";
import { PROGRESS } from "../constants";
import { CheckCircle } from "../icons/check-circle";
import { Spinner } from "../icons/spinner";
import { useAppSelector } from "../store/hooks";
import { formatTxDisplay } from "../utils";

type Props = {
    tokenAddress: string
    tokenId: string
    price: string
    classNames?: string
}

function UpdateListing(props: Props) {
    const {
        tokenAddress,
        tokenId,
        price,
        classNames
    } = props;

    let provider: any;
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? "0x0";

    const userState = useAppSelector((state) => state.user);

    const [isOpen, setIsOpen] = useState(false);
    const [progress, setProgress] = useState("");
    const [txHash, setTxHash] = useState("");
    const [newPrice, setNewPrice] = useState("0.001");
    const [priceError, setPriceError] = useState("");

    const onClose = () => {
        // delay for the animation to close the modal
        setIsOpen(false);
        setTimeout(() => {
            setProgress("");
            setTxHash("");
            setPriceError("");
            setNewPrice("0.001");
        }, 200);
    };

    const onUpdatePrice = (event: any) => {
        setPriceError("");
        setNewPrice(event.target.value);
    }

    const onSubmit = async () => {
        if (!userState.isConnected) {
            console.error("Please connect wallet to continue.");
            toast.error("Please connect wallet to continue.");
            return;
        }

        setPriceError("");

        if (!newPrice) {
            setPriceError("Price should be a whole number or decimals, e.g. 1, 1.234");
            return;
        }

        try {
            const newPriceWei = ethers.utils.parseEther(newPrice);

            if (newPriceWei.isZero()) {
                setPriceError("Price should be more than 0 ETH");
                return;
            }

            // input ok; proceed to update
            setProgress(PROGRESS.PENDING);
            provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const deployed = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, signer);

            try {
                const tx = await deployed.updateListing(
                    tokenAddress,
                    tokenId,
                    newPriceWei.toString()
                );
                console.log("tx: ", tx.hash);
                setProgress(PROGRESS.CONFIRM);
                setTxHash(tx.hash);
            } catch (e) {
                console.error(e);
                toast.error("Error updating the listing. Please try again.");
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
                Update listing
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
                                Listing Updated
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
                                    You have updated the price.It would take a few minutes for it to take effect.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Please refresh the page again later.
                                </p>
                                <button 
                                    type="button" 
                                    className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 mt-2"
                                    onClick={onClose}>
                                    OK
                                </button>
                            </div>
                            </>

                            :

                            <>
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                Update Listing
                            </Dialog.Title>
                            <div className="mt-4 text-left text-gray-600">
                                Enter a new price below to update the listing
                            </div>
                            <div className="mt-4 text-left text-gray-900">
                                <div className="text-gray-900 font-bold">Current Price</div>
                                <div className="font-medium mt-1">{ethers.utils.formatEther(price)} ETH</div>
                            </div>
                            <form className="mt-4 text-left">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="newPrice" className="text-gray-900 font-bold">New Price</label>
                                        <div className="flex items-center">
                                            <input 
                                                type="text"
                                                className="block w-96 mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black pr-10"
                                                value={newPrice}
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
                                    Update
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
    )
}

export default UpdateListing;