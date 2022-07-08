import { ZERO_ADDRESS } from "../constants";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import { BackendApi } from "../mixin/backend";
import { useAppSelector } from "../store/hooks";
import MintModal from "../modals/mint-modal";
import { useState } from "react";
import { MARKETPLACE_HUMAN_ABI } from "../abi/marketplaceHumanABI";
import { BASIC_NFT_ABI_V2 } from "../abi/basicnftv2ABI";


const BASIC_NFT_V2_BYTECODE_JSON = require('../bytecode/basicnftv2_bytecode.json');
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
    const [metadataIPFS, setMetadataIPFS] = useState('');
    const [progress0, setProgress0] = useState('');
    const [progress1, setProgress1] = useState('');
    const [progress2, setProgress2] = useState('');
    const [progress3, setProgress3] = useState('');
    const [progress4, setProgress4] = useState('');
    const [tx1, setTx1] = useState('');
    const [tx2, setTx2] = useState('');
    const [tx3, setTx3] = useState('');
    const [tx4, setTx4] = useState('');

    const initialState = { nftImgAlt: "", nftImgSrc: "" };
    const [file, setFile] = useState(null); // save blob to transfer to backend
    const [{ nftImgAlt, nftImgSrc }, setPreview] = useState(initialState); // for showing image preview
    const [numAttributes, setNumAttributes] = useState(1); // used to dynamically generate the properties input

    /**
     * close progress modal
     */
    const onCloseModal = () => {
        // delay for the animation to close the modal
        setOpenModal(false);
        setTimeout(() => {
            setCurrStep(1);
            setnftAddress('');
            setMetadataIPFS('');
            setProgress0('');
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
     * upload image and metadata to ipfs
     * @param data form data from react-hook-form
     */
    const onUploadIPFS = async (data: any) => {
        setProgress0('pending');
        let formData = new FormData();

        formData.append("image", file ?? "");

        formData.append("name", data.name);
        formData.append("description", data.description);

        // metadata attributes field
        let attributes = [];

        if (data.attributes) {
            for (const attribute of data.attributes) {
                if (attribute.trait_type && attribute.value) {
                    console.log(attribute);
                    attributes.push(attribute);
                }
            }
        }

        formData.append("attributes", JSON.stringify(attributes));

        const res = await backend.uploadToIPFS(formData);

        if (res.success) {
            setMetadataIPFS(res.result.metadataIPFSHash);
        }

        setProgress0('done');
        return res;
    }


    /**
     * deploy nft contract
     * @param data form data from react-hook-form
     */
    const onDeployNFT = async (data: any) => {
        setCurrStep(2);
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
    const onMint = async (tokenURI: string) => {
        setCurrStep(3);
        setProgress2('pending');

        const mintTx = await nftContract.mint(
            tokenURI,
        {
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
        setCurrStep(4);
        setProgress3('pending');
        
        // approve marketplace first
        const approvalTx = await nftContract.approve(marketplaceAddress, tokenId);
        await approvalTx.wait();

        const signer = provider.getSigner();
        const marketplace = new ethers.Contract(marketplaceAddress, MARKETPLACE_HUMAN_ABI, signer);

        setProgress3('done');
        setTx3(approvalTx.hash);
        setCurrStep(5);
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
        if (!data.name || !data.symbol || !data.salePrice || !file) {
            return;
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        nftFactory = new ethers.ContractFactory(BASIC_NFT_ABI_V2, BASIC_NFT_V2_BYTECODE_JSON.object, signer);

        setOpenModal(true);

        try {
            // 01 - upload img and metadata to pinata
            // 02 - deploy nft contract
            // 03 - mint to wallet
            // 04 - list nft for sale
            const uploadResponse = await onUploadIPFS(data);

            console.log("ipfs upload: ", uploadResponse);

            if (!uploadResponse.success) {
                throw new Error(uploadResponse.result);
            }

            const tokenURI = `https://gateway.pinata.cloud/ipfs/${uploadResponse.result.metadataIPFSHash}`;

            await onDeployNFT(data);
            const mintTx = await onMint(tokenURI);
            const tokenId = mintTx.events[1].args.tokenId.toString();

            // record nft owner to db
            await backend.addMintedNFT({
                token_address: `${nftContract.address.toLowerCase()}`,
                token_id: `${tokenId}`,
                token_name: `${data.name}`,
                token_uri: `${tokenURI}`,
                minter: `${userState.wallet}`,
                owner: `${userState.wallet}`,
            });

            const salePriceWei = ethers.utils.parseEther(`${data.salePrice}`).toString();

            await onSell(tokenId, salePriceWei);
        } catch (e) {
            console.error(e);
            onCloseModal();
        }
    }

    const onUpload = (e: any) => {
        const { files } = e.target;
        setPreview(files.length ? { nftImgSrc: URL.createObjectURL(files[0]), nftImgAlt: files[0].name } : initialState);
        setFile(e.target.files[0]);
    }
    
    return (
        <div className="container mx-auto">
            <h1 className="font-semibold font-kanit text-3xl my-4">Create NFT</h1>
            <div className="text-gray-900 mb-12">Create your own NFT and list it on the marketplace!</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4">
                    <div className="mb-2">
                        <label 
                            htmlFor="nftImage" 
                            className="text-gray-900 font-bold">
                                Upload File
                        </label>
                        <div className="mt-4 px-4 py-4 w-1/3 flex flex-col text-center gap-y-6 border-2 border-gray-400 border-dashed rounded-xl">
                            {
                                nftImgSrc &&
                                <div className="h-fit w-fit mx-auto">
                                    <img src={nftImgSrc} alt={nftImgAlt} className="object-contain rounded-xl" />
                                </div>
                            }
                            <div className="text-gray-400 text-sm font-semibold">JPG, PNG, GIF</div>
                            <input type="file" id="nftImage" className="hidden" onChange={onUpload} accept="image/*"/>
                            <div className="mb-4">
                                <label 
                                    htmlFor="nftImage"
                                    className="cursor-pointer bg-blue-100 text-blue-600 text-sm font-bold rounded-full px-8 py-3">
                                    { nftImgSrc ? "Reupload" : "Choose File" }
                                </label>
                            </div>
                        </div>
                    </div>
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
                    <div className="mb-2">
                        <label 
                            htmlFor="description" 
                            className="text-gray-900 font-bold">
                                Description
                        </label>
                        <input
                            type="text"
                            className="block w-96 mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black" 
                            placeholder={`e.g. "A meteorite stone that landed near Arizona"`}
                            {...register("description", { required: true })}
                        />
                        {errors.description && <p className="text-sm text-red-500 font-bold">Description is required.</p>}
                    </div>
                    <div className="mb-2">
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
                    <div>
                        <label 
                            htmlFor="properties" 
                            className="text-gray-900 font-bold">
                                Properties <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                        </label>
                        <div className="flex flex-col gap-y-8">
                            {
                                [...Array(numAttributes)].map((item: any, index) => {
                                    /* generate numAttributes times of trait_type-value input fields */
                                    let keyName = `attributes.${index}.trait_type`;
                                    let keyValue = `attributes.${index}.value`;

                                    return (
                                        <div key={index} className="flex">
                                            <input
                                                type="text"
                                                className="block w-90 mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black pr-10 mr-8" 
                                                placeholder={`Enter key, e.g. Color`}
                                                {...register(keyName)}
                                            />
                                            <input
                                                type="text"
                                                className="block w-90 mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black pr-10" 
                                                placeholder={`Enter value, e.g. Blue`}
                                                {...register(keyValue)}
                                            />
                                        </div>
                                    );
                                })
                            }
                            <button 
                                type="button"
                                className="bg-teal-100 text-teal-600 text-xs px-2 py-3 rounded-full font-bold w-36"
                                onClick={() => setNumAttributes(numAttributes + 3)}>
                                    Add more fields
                            </button>
                        </div>
                    </div>
                </div>
                <button 
                    type="submit"
                    className="mt-12 mb-8 bg-blue-600 text-white text-sm px-4 py-2 rounded font-bold">
                        Create item
                </button>
            </form>
            <MintModal 
                openModal={openModal}
                currStep={currStep}
                nftAddress={nftAddress}
                metadataIPFS={metadataIPFS}
                progress0={progress0}
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