import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { USER_RESET, UPDATE_IS_CONNECTED, UPDATE_WALLET } from "../store/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { User } from "../icons/user";
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from "react";


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
                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1 ">
                                <Menu.Item>
                                    {({ active }) => (
                                    <button
                                        className={`${
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        Edit
                                    </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                    <button
                                        className={`${
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        Duplicate
                                    </button>
                                    )}
                                </Menu.Item>
                                </div>
                                <div className="px-1 py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                    <button
                                        className={`${
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        Archive
                                    </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                    <button
                                        className={`${
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        Move
                                    </button>
                                    )}
                                </Menu.Item>
                                </div>
                                <div className="px-1 py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                    <button
                                        className={`${
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        Delete
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