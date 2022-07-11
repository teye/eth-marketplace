import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { USER_RESET, UPDATE_IS_CONNECTED, UPDATE_WALLET, UPDATE_BALANCE } from "../store/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { User } from "../icons/user";
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect } from "react";
import { formatAddressDisplay, truncate } from "../utils";
import { Ethereum } from "../icons/eth";


let provider: any;

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
          .then((accounts: any) => {
            if (accounts.length > 0) {
              dispatch(UPDATE_WALLET(accounts[0]));
              dispatch(UPDATE_IS_CONNECTED(true));

              provider.getBalance(accounts[0])
                .then((result: any) => {
                    const bal = ethers.utils.formatEther(result);
                    dispatch(UPDATE_BALANCE(bal));
                });
            }
          })
          .catch((e: any) => console.error(e));
    }

    const onDisconnect = () => {
        dispatch(USER_RESET());
    }

    /**
     * on metamask change account - update redux store and balance
     * @param accounts 
     * @returns 
     */
    const onAccountsChange = (accounts: any) => {
        console.log("new accounts: ", accounts);
        
        if (accounts.length === 0) {
            return;
        }

        dispatch(UPDATE_WALLET(accounts[0]));

        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        provider.getBalance(accounts[0])
            .then((result: any) => {
                const bal = ethers.utils.formatEther(result);
                dispatch(UPDATE_BALANCE(bal));
            });
    }

    useEffect(() => {
        if (!window.ethereum) {
            return;
        }
      
        provider = new ethers.providers.Web3Provider(window.ethereum);

        const { provider: ethereum } = provider;

        ethereum.on('accountsChanged', onAccountsChange)

        return () => {
            ethereum.removeListener('accountsChanged', onAccountsChange);
        }
    }, []);

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
                <li className="nav-item font-kanit text-sm text-gray-700 hover:text-blue-500 tracking-wider uppercase">
                    <Link to={`/explore`}>
                        Explore
                    </Link>
                </li>
                {
                    userState.isConnected &&
                    <li className="nav-item font-kanit text-sm text-gray-700 hover:text-blue-500 tracking-wider uppercase">
                        <Link to={`/create-nft`}>
                            Create
                        </Link>
                    </li>
                }
                <li className="font-kanit text-sm ml-auto mr-[2rem]">
                    {
                        !userState.isConnected 
                        &&
                        <button 
                            className="bg-blue-500 text-white py-2 px-4 rounded mr-4"
                            onClick={() => onConnectWallet()}>
                            Connect MetaMask
                        </button>
                    }
                </li>
                {
                    userState.wallet &&
                    <li className="nav-item text-sm lowercase">
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                            <Menu.Button className="inline-flex w-full justify-center rounded-full border-2 border-black shadow-sm text-sm font-medium p-1 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                <User 
                                    width="26"
                                    height="26"
                                />
                            </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
                                <div className="px-1 py-1">
                                    <div className="px-2 pt-2 text-sm normal-case font-semibold">Connected</div>
                                    <div className="px-2 py-2 flex content-center items-center">
                                        <div className="rounded-full bg-blue-500 h-8 w-8 mr-2 flex justify-center items-center">
                                            <Ethereum 
                                                width="12"
                                                classNames="text-white"
                                            />
                                        </div>
                                        <div>{formatAddressDisplay(userState.wallet)}</div>
                                    </div>
                                </div>
                                <div className="px-1 py-1 ">
                                    <div className="px-2 py-2 flex content-center items-center">
                                        <div className="rounded-full bg-blue-50 h-8 w-8 mr-2 flex justify-center items-center">
                                            <Ethereum 
                                                width="12"
                                                classNames="text-blue-300"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-[0.9em] text-gray-500 normal-case">Ethereum</div>
                                            <div className="text-black normal-case font-semibold">{truncate(userState.balance, 2)} ETH</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-1 py-1.5">
                                <Menu.Item>
                                    {({ active }) => (
                                    <Link to={`/profile`}>
                                        <button
                                            className={`${
                                            active ? 'text-blue-500' : 'text-gray-900'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            View Profile
                                        </button>
                                    </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                    <button
                                        className={`${
                                        active ? 'text-blue-500' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() => onDisconnect()}
                                    >
                                        Disconnect Wallet
                                    </button>
                                    )}
                                </Menu.Item>
                                </div>
                            </Menu.Items>
                            </Transition>
                        </Menu>
                    </li>
                }
            </ul>
        </nav>
    )
}

export default Navbar;