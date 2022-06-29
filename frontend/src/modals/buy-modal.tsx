import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { PROGRESS } from "../constants";
import { CheckCircle } from "../icons/check-circle";
import { Spinner } from "../icons/spinner";
import { formatTxDisplay } from "../utils";

type Props = {
    openModal: boolean
    progress: string
    txHash: string
    onClose: () => void
}

function BuyModal(props: Props) {
    const {
        openModal,
        progress,
        txHash,
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
                {
                    progress === PROGRESS.CONFIRM

                    ?
                    <>
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                    >
                        Payment Success
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
                        You have bought the NFT.<br/>It would appear under 'Profile' &gt; 'Collectibles'.
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
                        Processing Payment
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
    )
}

export default BuyModal;