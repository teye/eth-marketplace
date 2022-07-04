import { Dialog, Transition } from "@headlessui/react";
import { ethers } from "ethers";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BASIC_NFT_ABI } from "../abi/basicnftABI";
import { MARKETPLACE_HUMAN_ABI } from "../abi/marketplaceHumanABI";
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
    const [salePrice, setSalePrice] = useState("0.001");
    const [priceError, setPriceError] = useState("");
    const [currStep, setCurrStep] = useState(1);
    const [progress1, setProgress1] = useState('');
    const [progress2, setProgress2] = useState('');
    const [tx1, setTx1] = useState('');
    const [tx2, setTx2] = useState('');

    const onClose = () => {
        // delay for the animation to close the modal
        setIsOpen(false);
        setTimeout(() => {
            setCurrStep(1);
            setPriceError("");
            setSalePrice("0.001");
            setProgress1('');
            setProgress2('');
            setTx1('');
            setTx2('');
        }, 200);
    };

    const onUpdatePrice = (event: any) => {
        setPriceError("");
        setSalePrice(event.target.value);
    }

    /**
     * approve marketplace address to sell
     * @param tokenAddress 
     * @param tokenId 
     * @returns 
     */
    const onApprove = async (tokenAddress: string, tokenId: string) => {
        setProgress1('pending');

        provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(tokenAddress, BASIC_NFT_ABI, signer);
        const approvalTx = await nftContract.approve(marketplaceAddress, tokenId);

        return approvalTx;
    }

    /**
     * list nft for sale on marketplace
     */
    const onSell = async (tokenAddress: string, tokenId: string, salePriceWei: string) => {
        setCurrStep(2);
        setProgress2('pending');

        provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const deployed = new ethers.Contract(marketplaceAddress, MARKETPLACE_HUMAN_ABI, signer);

        const tx = await deployed.sell(
            tokenAddress,
            tokenId,
            salePriceWei
        )

        setProgress2('done');
        setTx2(tx.hash);

        return tx;
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

            try {
                const approvalTx = await onApprove(tokenAddress, tokenId);
                const approvalTxReceipt = await approvalTx.wait();

                setProgress1('done');
                setTx1(approvalTxReceipt.transactionHash);

                const sellTx = await onSell(tokenAddress, tokenId, salePriceWei.toString());

                console.log("sell tx: ", sellTx.hash);

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
                            <button 
                                type="button" 
                                className="float-right text-gray-900 text-[1.2rem]"
                                onClick={onClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            {/* show form */}
                            {
                                !progress1 && 
                                !progress2

                                ?
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

                                :

                                <>
                                {/* form submitted */}
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-semibold leading-6 text-gray-900 mb-6"
                                >
                                    Listing NFT - {tokenName}
                                </Dialog.Title>
                                {/* step 1 - approve */}
                                <div className="mt-4 flex space-x-4">
                                    {
                                        currStep >= 1
                                        ?
                                        progress1 === 'done' 
                                        ?
                                        <CheckCircle 
                                            height="30"
                                            width="30"
                                        />
                                        :
                                        <Spinner
                                            height="30"
                                            width="30"
                                        />
                                        :
                                        <div className="w-7 h-7 rounded-full bg-gray-200 flex justify-center items-center">
                                            <p className="text-[0.7em] text-gray-500 font-semibold">3</p>
                                        </div>
                                    }
                                    <div className="text-[0.9em] text-gray-900 font-semibold flex flex-col justify-start text-left">
                                        <div>Grant marketplace permisson to sell</div>
                                        {
                                            progress1 === 'done' &&
                                            tx1 &&
                                            <div className="text-[0.85em] text-blue-400">TX: {formatTxDisplay(tx1)}</div>
                                        }
                                    </div>
                                </div>
                                {/* step 2 - sell */}
                                <div className="mt-4 flex space-x-4">
                                    {
                                        currStep >= 2
                                        ?
                                        progress2 === 'done' 
                                        ?
                                        <CheckCircle 
                                            height="30"
                                            width="30"
                                        />
                                        :
                                        <Spinner
                                            height="30"
                                            width="30"
                                        />
                                        :
                                        <div className="w-7 h-7 rounded-full bg-gray-200 flex justify-center items-center">
                                            <p className="text-[0.7em] text-gray-500 font-semibold">2</p>
                                        </div>
                                    }
                                    <div className="text-[0.9em] text-gray-900 font-semibold flex flex-col justify-start text-left">
                                        <div>Listing NFT on marketplace</div>
                                        {
                                            progress2 === 'done' &&
                                            tx2 &&
                                            <div className="text-[0.85em] text-blue-400">TX: {formatTxDisplay(tx2)}</div>
                                        }
                                    </div>
                                </div>
                                </>
                            }
                            {
                                currStep >= 2 &&
                                progress2 === 'done' &&
                                <div className="mt-4 text-[0.9em]">
                                <p className="font-bold">NFT {tokenName} listed!</p>
                                <p>You may proceed to the marketplace to view!</p>
                                <Link to="/explore">
                                    <button 
                                            type="button" 
                                            className="inline-flex justify-center rounded-md border border-transparent bg-teal-100 px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 mt-2"
                                        >
                                            OK
                                        </button>
                                    </Link>
                                </div>
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