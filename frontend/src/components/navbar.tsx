import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { UPDATE_IS_CONNECTED, UPDATE_WALLET } from "../store/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";


let provider;

function Navbar() {
    const userState = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const onConnectWallet = () => {
        if (!window.ethereum) {
          console.log("Please install Metamask");
          return;
        }
    
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // MetaMask requires requesting permission to connect users accounts
        // await provider.send("eth_requestAccounts", []);
        provider.send("eth_requestAccounts", [])
          .then((accounts) => {
            if (accounts.length > 0) {
              dispatch(UPDATE_WALLET(accounts[0]));
              dispatch(UPDATE_IS_CONNECTED(true));
            }
          })
          .catch((e) => console.error(e));
    }

    return (
        <nav className="bg-white z-100 max-w-full">
            <div className="mx-auto p-4">
                <div className="flex justify-between items-center bg-green-400">
                    <div className="flex space-x-7">
                        {/* website logo & name */}
                        <div className='logo px-2 py-0 rounded-md'>
                            <Link to={`/`}>
                                <h1 className="font-kanit text-[1.2em] font-bold uppercase">NFT BAY</h1>
                            </Link>
                        </div>
                        {/* links */}
                        <div>
                            <ul className="inline-flex text-[0.85em] text-slate font-bold font-kanit uppercase">
                                <li className="tracking-wider mr-6">
                                    <Link to={`/explore`}>
                                        Explore
                                    </Link>
                                </li>
                                <li>
                                    <button 
                                        className="bg-black text-white py-2 px-4 rounded mr-4"
                                        onClick={() => onConnectWallet()}>
                                        Connect MetaMask
                                    </button>
                                </li>
                                {
                                    userState.wallet &&
                                    <li className="lowercase">
                                        <div>{userState.wallet}</div>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;