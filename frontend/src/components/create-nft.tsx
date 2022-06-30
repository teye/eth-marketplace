import { ZERO_ADDRESS } from "../constants";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import { BASIC_NFT_ABI } from "../abi/basicnftABI";
import { MARKETPLACE_ABI } from "../abi/marketplaceABI";
import { BackendApi } from "../mixin/backend";
import { useAppSelector } from "../store/hooks";
import MintModal from "../modals/mint-modal";
import { useState } from "react";


const BASIC_NFT_BYTECODE_JSON = require('../bytecode/basicnft_bytecode.json');
let provider: any;

function CreateNFT() {
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? ZERO_ADDRESS;
    let nftFactory: any;
    let nftContract: any;
    const backend = new BackendApi();

    const userState = useAppSelector((state) => state.user);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [currStep, setCurrStep] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [nftAddress, setnftAddress] = useState('');
    const [progress1, setProgress1] = useState('');
    const [progress2, setProgress2] = useState('');
    const [progress3, setProgress3] = useState('');
    const [progress4, setProgress4] = useState('');
    const [tx1, setTx1] = useState('');
    const [tx2, setTx2] = useState('');
    const [tx3, setTx3] = useState('');
    const [tx4, setTx4] = useState('');

    /**
     * close progress modal
     */
    const onCloseModal = () => {
        // delay for the animation to close the modal
        setOpenModal(false);
        setTimeout(() => {
            setCurrStep(1);
            setnftAddress('');
            setProgress1('');
            setProgress2('');
            setProgress3('');
            setProgress4('');
            setTx1('');
            setTx2('');
            setTx3('');
            setTx4('');
        }, 200);
    }

    /**
     * deploy nft contract
     * @param data form data from react-hook-form
     */
    const onDeployNFT = async (data: any) => {
        setProgress1('pending');

        nftContract = await nftFactory.deploy(data.name, data.symbol);
        const tx = await nftContract.deployTransaction.wait();

        console.log("token contract deployed: ", nftContract.address);
        console.log("deploy tx: ", nftContract.deployTransaction);

        setProgress1('done');
        setTx1(tx.transactionHash);
        setnftAddress(nftContract.address);

        console.log(tx);

        return tx;
    }

    /**
     * mint nft to sender wallet
     */
    const onMint = async () => {
        setCurrStep(currStep+1);
        setProgress2('pending');

        const mintTx = await nftContract.mint({
            value: ethers.utils.parseEther("0.001")
        });

        console.log("mint token: ", mintTx);

        const tx = await mintTx.wait();

        setProgress2('done');
        setTx2(tx.transactionHash);

        return tx;
    }

    /**
     * sell nft on the marketplace; require user to approve marketplace to sell
     */
    const onSell = async (tokenId: string, salePriceWei: string) => {
        setCurrStep(3);
        setProgress3('pending');
        
        // approve marketplace first
        const approvalTx = await nftContract.approve(marketplaceAddress, tokenId);
        await approvalTx.wait();

        const signer = provider.getSigner();
        const marketplace = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, signer);

        setProgress3('done');
        setTx3(approvalTx.hash);
        setCurrStep(4);
        setProgress4('pending');

        const sellTx = await marketplace.sell(
            nftContract.address,
            tokenId,
            salePriceWei
        )
        await sellTx.wait();

        setProgress4('done');
        setTx4(sellTx.hash);

        console.log("sell nft: ", sellTx.hash);
    }

    /**
     * upload and mint the nft
     * @param data form data from react-hook-form
     * @returns 
     */
    const onSubmit = async (data: any) => {
        console.log(data);
        if (!data.name || !data.symbol || !data.salePrice) {
            return;
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        nftFactory = new ethers.ContractFactory(BASIC_NFT_ABI, BASIC_NFT_BYTECODE_JSON.object, signer);

        setOpenModal(true);

        try {
            // 01 - deploy nft contract
            // 02 - mint to wallet
            // 03 - list nft for sale
            await onDeployNFT(data);
            const mintTx = await onMint();
            const tokenId = mintTx.events[1].args.tokenId.toString();

            // record nft owner to db
            await backend.addMintedNFT({
                token_address: `${nftContract.address.toLowerCase()}`,
                token_id: `${tokenId}`,
                minter: `${userState.wallet}`,
                owner: `${userState.wallet}`,
            });

            const salePriceWei = ethers.utils.parseEther(`${data.salePrice}`).toString();

            await onSell(tokenId, salePriceWei);

            // record sell listing to db
            await backend.addListing({
                token_address: `${nftContract.address.toLowerCase()}`,
                token_id: `${tokenId}`,
                seller: `${userState.wallet}`,
                price: salePriceWei,
            })
        } catch (e) {
            console.error(e);
            onCloseModal();
        }
    }
    
    return (
        <div className="container mx-auto">
            <h1 className="font-semibold font-kanit text-3xl my-4">Create NFT</h1>
            <div className="text-gray-900 mb-12">Create your own NFT and list it on the marketplace!</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4">
                    <div className="mb-2">
                        <label 
                            htmlFor="name" 
                            className="text-gray-900 font-bold">
                                Name
                        </label>
                        <input
                            type="text"
                            className="block w-96 mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black" 
                            placeholder={`e.g. "Rare meteorite stone"`}
                            {...register("name", { required: true })} 
                        />
                        {errors.name && <p className="text-sm text-red-500 font-bold">Name is required.</p>}
                    </div>
                    <div className="mb-2">
                        <label 
                            htmlFor="symbol" 
                            className="text-gray-900 font-bold">
                                Symbol
                        </label>
                        <input
                            type="text"
                            className="block w-96 mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black" 
                            placeholder={`e.g. "RMS"`}
                            {...register("symbol", { required: true })}
                        />
                        {errors.symbol && <p className="text-sm text-red-500 font-bold">Symbol is required.</p>}
                    </div>
                    <div>
                        <label 
                            htmlFor="salePrice" 
                            className="text-gray-900 font-bold">
                                Sale Price
                        </label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                className="block w-96 mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black pr-10" 
                                defaultValue={1}
                                {...register("salePrice", { 
                                    required: true, 
                                        validate: {
                                            positiveNumber: (value) => parseFloat(value) > 0
                                        } 
                                    })} 
                            />
                            <div className="-ml-8 font-semibold">ETH</div>
                        </div>
                        {errors.salePrice && errors.salePrice.type === "positiveNumber" && <p className="text-sm text-red-500 font-bold">Price should be a whole number or decimals, e.g. 1, 1.234</p>}
                    </div>
                </div>
                <button 
                    type="submit"
                    className="mt-12 bg-blue-600 text-white text-sm px-4 py-2 rounded font-bold">
                        Create item
                </button>
            </form>
            <MintModal 
                openModal={openModal}
                currStep={currStep}
                nftAddress={nftAddress}
                progress1={progress1}
                progress2={progress2}
                progress3={progress3}
                progress4={progress4}
                tx1={tx1}
                tx2={tx2}
                tx3={tx3}
                tx4={tx4}
                onClose={onCloseModal}
            />
        </div>
    );
}

export default CreateNFT;