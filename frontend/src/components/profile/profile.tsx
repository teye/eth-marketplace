import { Fragment, useState } from "react";
import { ethers } from 'ethers';
import { Tab } from '@headlessui/react'
import OnSale from "./on-sale";
import Collectibles from "./collectibles";
import Minted from "./minted";

let provider;

/**
 * fetch list of nfts owned (minted and bought) by user and display
 * @returns 
 */
function Profile() {
    return (
        <div className="container mx-auto">
            <h1 className="font-semibold font-kanit text-3xl my-4">My Profile</h1>
            <div className="text-gray-900 mb-12">Manage your NFTs</div>
            <div className="w-full max-w-screen-lg px-2 py-4 sm:px-0">
              <Tab.Group defaultIndex={0}>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                  <Tab
                    className={({ selected }) => selected ? 'bg-blue-500' : 'bg-white'}>
                    On Sale
                  </Tab>
                  <Tab>Collectibles</Tab>
                  <Tab>Minted</Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <OnSale />
                  </Tab.Panel>
                  <Tab.Panel>
                    <Collectibles />
                  </Tab.Panel>
                  <Tab.Panel>
                    <Minted />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
        </div>
    );
}

export default Profile;