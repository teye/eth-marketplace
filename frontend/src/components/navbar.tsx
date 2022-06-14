import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { USER_RESET, UPDATE_IS_CONNECTED, UPDATE_WALLET } from "../store/userSlice";
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

    const onDisconnect = () => {
        dispatch(USER_RESET());
    }

    return (
        <nav>
            <ul className="bg-white py-4 flex m-0 justify-end items-center">
                <li className="mr-auto ml-[2rem]">
                    <Link to={`/`}>
                        <div className="logo px-2 rounded-md">
                            <h1 className="font-kanit text-[1.2em] font-bold uppercase">NFT BAY</h1>
                        </div>
                    </Link>
                </li>
                <li className="nav-item font-kanit text-sm text-gray-700 hover:text-black tracking-wider uppercase">
                    <Link to={`/explore`}>
                        Explore
                    </Link>
                </li>
                <li className="font-kanit text-sm ml-auto mr-[2rem]">
                    {
                        !userState.isConnected 
                        ?
                        <button 
                            className="bg-black text-white py-2 px-4 rounded mr-4"
                            onClick={() => onConnectWallet()}>
                            Connect MetaMask
                        </button>
                        :
                        <button 
                            className="bg-black text-white py-2 px-4 rounded mr-4"
                            onClick={() => onDisconnect()}>
                            Disconnect Wallet
                        </button>
                    }
                </li>
                {
                    userState.wallet &&
                    <li className="nav-item font-kanit text-sm lowercase">
                        <div>{userState.wallet}</div>
                    </li>
                }
            </ul>
        </nav>
    )
}

export default Navbar;