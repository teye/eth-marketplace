import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { USER_RESET, UPDATE_IS_CONNECTED, UPDATE_WALLET, UPDATE_BALANCE } from "../store/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { User } from "../icons/user";
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect } from "react";
import { formatAddressDisplay, truncate } from "../utils";
import { Ethereum } from "../icons/eth";
import { DEFAULT_ETH_PROVIDER } from "../constants";
import { MARKETPLACE_ABI } from "../abi/marketplaceABI";
import { BackendApi } from "../mixin/backend";


let provider: any;

function Navbar() {
    let marketplaceAddress = process.env.REACT_APP_MARKETPLACE_CONTRACT ?? "a";
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

    useEffect(() => {
        const backend = new BackendApi();

        // listen for contract events
        provider = ethers.getDefaultProvider(DEFAULT_ETH_PROVIDER);
        const marketplace = new ethers.Contract(marketplaceAddress, MARKETPLACE_ABI, provider);

        const buyListener = async (from: string, tokenAddress: string, tokenId: number) => {
            console.log(`nft bought event: ${from}, ${tokenAddress}, ${tokenId}`);

            const _tokenAddress = tokenAddress.toLowerCase();
            const _tokenId = tokenId.toString().toLowerCase();
            const _from = from.toLowerCase();
            
            // call db to update owner and remove listing
            await backend.deleteListing(_tokenAddress, _tokenId);
            await backend.updateToken(_tokenAddress, _tokenId, _from);
        }

        const sellListener = async (from: string, tokenAddress: string, tokenId: number, price: number) => {
            console.log(`nft sell event: ${from}, ${tokenAddress}, ${tokenId}, ${price}`);

            // call db to add new sell listing
            const _tokenAddress = tokenAddress.toLowerCase();
            const _tokenId = tokenId.toString().toLowerCase();
            const _from = from.toLowerCase();
            const _price = price.toString();

            await backend.addListing({
                token_address: _tokenAddress,
                token_id: _tokenId,
                seller: _from,
                price: _price,
            });
        }

        const updateListener = () => {
            // call db to update listing details
        }

        const cancelListener = async (from: string, tokenAddress: string, tokenId: number) => {
            // call db to remove listing
            console.log(`nft cancel event: ${from}, ${tokenAddress}, ${tokenId}`);

            const _tokenAddress = tokenAddress.toLowerCase();
            const _tokenId = tokenId.toString().toLowerCase();
            const _from = from.toLowerCase();

            await backend.deleteListing(_tokenAddress, _tokenId);
        }

        provider.once("block", () => {
            marketplace.on("NFTBought", buyListener);
            marketplace.on("NFTListed", sellListener);
            marketplace.on("NFTDeListed", cancelListener);
        });

        // marketplace.on("NFTBought", buyListener);

        // marketplace.on("NFTListed", sellListener);


        return () => {
            marketplace.removeListener("NFTBought", buyListener);
            marketplace.removeListener("NFTListed", sellListener);
            marketplace.removeListener("NFTDeListed", cancelListener);
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
                <li className="nav-item font-kanit text-sm text-gray-700 hover:text-violet-500 tracking-wider uppercase">
                    <Link to={`/explore`}>
                        Explore
                    </Link>
                </li>
                {
                    userState.isConnected &&
                    <li className="nav-item font-kanit text-sm text-gray-700 hover:text-violet-500 tracking-wider uppercase">
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
                            className="bg-violet-600 text-white py-2 px-4 rounded mr-4"
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
                                            active ? 'bg-violet-500 text-white' : 'text-gray-900'
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
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
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