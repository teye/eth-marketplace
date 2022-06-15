import { ZERO_ADDRESS } from "../constants";
import { useForm } from "react-hook-form";


function CreateNFT() {
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? ZERO_ADDRESS;
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    }
    
    return (
        <div className="container mx-auto">
            <h1 className="font-semibold font-kanit text-3xl my-4">Create NFT</h1>
            <div className="text-gray-900">Create your own NFT and list it on the marketplace!</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input {...register("name")} />
                </div>
                <div>
                    <label htmlFor="symbol">Symbol</label>
                    <input {...register("symbol")} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreateNFT;