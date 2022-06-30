import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "../icons/check-circle";
import { Spinner } from "../icons/spinner";
import { formatTxDisplay } from "../utils";

type Props = {
    nftAddress: string
    openModal: boolean
    currStep: number
    progress1: string
    progress2: string
    progress3: string
    progress4: string
    tx1: string
    tx2: string
    tx3: string
    tx4: string
    onClose: () => void
}

function MintModal(props: Props) {
    const {
        nftAddress,
        openModal,
        currStep,
        progress1,
        progress2,
        progress3,
        progress4,
        tx1,
        tx2,
        tx3,
        tx4,
        onClose
    } = props;

    return (
        <Transition appear show={openModal} as={Fragment}>
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
                <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 mb-6"
                >
                    Create and List NFT
                </Dialog.Title>
                {/* step 1 */}
                <div className="mt-6 flex space-x-4">
                    <div>
                        {
                            progress1 === 'pending' &&
                            <Spinner
                                height="30"
                                width="30"
                            />
                        }
                        {
                            progress1 === 'done' &&
                            <CheckCircle 
                                height="30"
                                width="30"
                            />
                        }
                    </div>
                    <div className="text-[0.9em] text-gray-900 font-semibold flex flex-col justify-start text-left">
                        <div>Deploy NFT contract</div>
                        {
                            progress1 === 'done' &&
                            tx1 &&
                            <div>
                                <div className="text-[0.85em] text-gray-900">NFT ADDRESS: {nftAddress}</div>
                                <div className="text-[0.85em] text-blue-400 mt-1">TX: {formatTxDisplay(tx1)}</div>
                            </div>
                        }
                    </div>
                </div>
                {/* step 2 */}
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
                        <div>Mint NFT</div>
                        {
                            progress2 === 'done' &&
                            tx2 &&
                            <div className="text-[0.85em] text-blue-400">TX: {formatTxDisplay(tx2)}</div>
                        }
                    </div>
                </div>
                {/* step 3 */}
                <div className="mt-4 flex space-x-4">
                    {
                        currStep >= 3
                        ?
                        progress3 === 'done' 
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
                            progress3 === 'done' &&
                            tx3 &&
                            <div className="text-[0.85em] text-blue-400">TX: {formatTxDisplay(tx3)}</div>
                        }
                    </div>
                </div>
                {/* step 4 */}
                <div className="mt-4 flex space-x-4">
                    {
                        currStep >= 4
                        ?
                        progress4 === 'done' 
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
                            <p className="text-[0.7em] text-gray-500 font-semibold">4</p>
                        </div>
                    }
                    <div className="text-[0.9em] text-gray-900 font-semibold flex flex-col justify-start text-left">
                        <div>Listing NFT on marketplace</div>
                        {
                            progress4 === 'done' &&
                            tx4 &&
                            <div className="text-[0.85em] text-blue-400">TX: {formatTxDisplay(tx4)}</div>
                        }
                    </div>
                </div>
                {
                    currStep >= 4 &&
                    progress4 === 'done' &&
                    <div className="mt-8 text-[0.9em]">
                       <p>NFT minted and listed!</p>
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
    )
}

export default MintModal;