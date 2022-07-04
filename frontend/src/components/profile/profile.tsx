import { Tab } from '@headlessui/react'
import OnSale from "./on-sale";
import Collectibles from "./collectibles";
import Minted from "./minted";


/**
 * fetch list of nfts owned (minted and bought) by user and display
 * @returns 
 */
function Profile() {
    return (
        <div className="container mx-auto">
            <h1 className="font-semibold font-kanit text-3xl my-4">My Profile</h1>
            <div className="w-full max-w-screen-lg px-2 py-4 sm:px-0">
              <Tab.Group defaultIndex={0}>
                <Tab.List className="flex space-x-4 rounded-xl p-1">
                  <Tab
                    className={({ selected }) => `${selected ? `border-b-black font-bold` : 'border-b-transparent'} border-b-2 bg-white p-2` }>
                    On Sale
                  </Tab>
                  <Tab
                    className={({ selected }) => `${selected ? `border-b-black font-bold` : 'border-b-transparent'} border-b-2 bg-white p-2` }>
                    Collectibles
                  </Tab>
                  <Tab
                    className={({ selected }) => `${selected ? `border-b-black font-bold` : 'border-b-transparent'} border-b-2 bg-white p-2` }>
                    Minted
                  </Tab>
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