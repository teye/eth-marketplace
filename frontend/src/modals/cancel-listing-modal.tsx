import { Dialog, Transition } from "@headlessui/react";
import { ethers } from "ethers";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { MARKETPLACE_ABI } from "../abi/marketplaceABI";
import { PROGRESS } from "../constants";
import { CheckCircle } from "../icons/check-circle";
import { Spinner } from "../icons/spinner";
import { useAppSelector } from "../store/hooks";
import { formatTxDisplay } from "../utils";

type Props = {
    tokenAddress: string
    tokenId: string
    classNames?: string
}

function CancelListing(props: Props) {
    let provider: any;
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? "0x0";

    const userState = useAppSelector((state) => state.user);

    const {
        tokenAddress,
        tokenId,
        classNames,
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [progress, setProgress] = useState("");
    const [txHash, setTxHash] = useState("");

    const onClose = () => {
        // delay for the animation to close the modal
        setIsOpen(false);
        setTimeout(() => {
            setProgress("");
            setTxHash("");
        }, 200);
    };

    /**
     * cancel the listing
     * @returns 
     */
    const onCancel = async () => {
        if (!userState.isConnected) {
            console.error("Please connect wallet to continue.");
            toast.error("Please connect wallet to continue.");
            return;
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);

        // check user balance

        const signer = provider.getSigner();

        setIsOpen(true);

        const deployed = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, signer);

        try {
            const tx = await deployed.cancelListing(
                tokenAddress, 
                tokenId
            );
            console.log("tx: ", tx.hash);
            setProgress(PROGRESS.CONFIRM);
            setTxHash(tx.hash);
        } catch (e) {
            console.error(e);
            onClose();
        }
    }

    return (
        <div className={classNames}>
        <button 
            className="bg-red-500 font-bold text-sm text-white py-2 px-6 rounded mr-4"
            onClick={() => onCancel()}
        >
            Cancel listing
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
                            Listing Cancelled
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
                            Your NFT would be delisted from the marketplace.<br/>It would appear under 'Profile' &gt; 'Collectibles'.
                            </p>
                            <p className="text-sm text-gray-500 mt-4">
                            Redirecting you back to marketplace...
                            </p>
                            <Link to={`/explore`}>
                                <button 
                                    type="button" 
                                    className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 mt-2">
                                    OK
                                </button>
                            </Link>
                        </div>
                        </>

                        :

                        <>
                        <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                        >
                            Cancelling Listing
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

export default CancelListing;