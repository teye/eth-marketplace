import { useState } from "react";
import { ethers } from 'ethers';

let provider;

/**
 * connect to metamask
 * fetch list of nfts owned (minted and bought) by user and display
 * @returns 
 */
function Profile() {
    const [currentAccount, setCurrentAccount] = useState("");

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
              setCurrentAccount(accounts[0]);
            }
          })
          .catch((e) => console.error(e));
    }

    return (
        <div className="container mx-auto">
            <h1 className="font-semibold font-kanit text-3xl my-4">My Profile</h1>
            <div className="mb-4">
            <button 
                className="bg-blue-500 font-semibold text-white text-sm py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={onConnectWallet}>
                Connect to MetaMask
            </button>
            {
                currentAccount ?
                <div>
                  <p><strong>Account</strong>: {currentAccount}</p>
                </div>
                :
                <span className="text-gray-600">No account found. Click on "Connect to MetaMask."</span>
              }
            </div>
        </div>
    );
}

export default Profile;