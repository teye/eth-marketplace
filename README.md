# eth-marketplace
A self-study project to create a marketplace on ethereum

## Table of Contents

- [1. About the Project](#1-about-the-project)
- [2. Features](#2-features)
- [3. Deployment (Local)](#3-deployment-local)
- [4. Deployment (Dockerized)](#4-deployment-dockerized)

## 1. About the Project

The project showcases how a NFT marketplace works from the beginning (user minting a NFT) to selling the NFT on a marketplace app. The marketplace supports ERTC-721.

The project has a few components:
1. `frontend`: web app that allows users to browse the marketplace, create, list and buy NFTs.
2. `backend`: REST API server that is connected to a MongoDB Atlas database. The mongo db stores non-time critical information about the NFT, e.g. token uri, token name. It is to allow ease of fetching of token information without fetching on-chain.
3. `contracts` : `hardhat` project to design and test the NFT and marketplace contracts.

## 2. Features

Users can perform the following:
- Mint and list a ERC-721 on the marketplace. The token metadata and image are uploaded to Pinata IPFS and not stored on mongo db.
- Sell NFTs
- Buy NFTs
- Retrieve sales profits
- View other NFTs listed on the marketplace

## 3. Deployment (Local)

First, we need to deploy the marketplace contract, then configure the backend and finally the frontend.

The following sub-sections will walkthrough each of the process in detail. 

For the purpose of learning, we are going to run a **local hardhat node** and the frontend app will connect to this local ethereum node.

### 3.1 Deploy Marketplace Contract

The marketplace contract is located at `contracts/Marketplace.sol`.

The NFT contract is located at `contracts/BasicNFTV2.sol`.

Run tests to ensure the contracts are alright:
```
npx hardhat test --network hardhat ./test/marketplace-test.js
npx hardhat test --network hardhat ./test/basic-nft-v2-test.js
```

Execute the following to run a local hardhat node and deploy the marketplace contract:
```
cd contracts

npx hardhat node

cd bash_scripts

./init_marketplace.sh
```

Note down the deployed marketplace contract address. If this is the first deployment, the contract address should be `0x5FbDB2315678afecb367f032d93F642f64180aa3`.

### 3.2 Configure MongoDB Atlas

Head to [https://www.mongodb.com/](https://www.mongodb.com/) and create a free MongoDB project on Atlas.

Create a database name: `marketplace_db`.

Create two collections: `listings` and `tokens`. The `listings` would store all the NFT listings information such as the seller address and price. The `tokens` would store all the NFTs minted via the marketplace and tells us which NFT belongs to which wallet.

On the left panel, click on **Database Access**.

Create a new database user, `marketplace_user` and randomly generate a `password`. Note down this password for later steps. Leave the other settings as it is.

On the left panel, click on **Database**. On your cluster, click **Connect** > **Connect your application**. Set the `DRIVER - Node.js` and `VERSION - 4.1 or later`. Note down the `mongodb+srv://<username>...`.

Lastly, click on **Network Access** > **IP Access List** > **Add IP Address**. On the **Access List Entry** input field, enter `0.0.0.0/0`. This allows any IP address to access the mongo db cloud.


At the end, you should have record down these variables. If you have missed any refer to the above steps again:
```
database username
database password
mongodb cluster url
```

### 3.3 Configure Pinata

Next, we need to register for a Pinata account. We would be using Pinata to store our minted NFT image and metadata.

Create an API key by following the instructions here, [https://knowledge.pinata.cloud/en/articles/6191471-how-to-create-an-pinata-api-key](https://knowledge.pinata.cloud/en/articles/6191471-how-to-create-an-pinata-api-key).

We do not require admin access for the API key, configure the API key with these access:

```
Pinning - pinFileToIPFS
Pinning - pinJSONToIPFS
Pinning - addpinobject
Pinning - getpinobject
```

When prompted, note down the `API_KEY` and `API_SECRET`.

### 3.4 Configure and Deploy Backend

In the `backend` repo, create a `.env` file with the following properties:

```
DB_URL=mongodb+srv://marketplace_user:<password>@<cluster_url>
PORT=5000
PINATA_API_KEY=<API_KEY>
PINATA_SECRET_KEY=<API_SECRET>
```

Copy and paste the required variables from previous sections 3.2 and 3.3.

Once done, run the backend:

```
cd backend
npm start
```

If success, you should see this:
```
> backend@1.0.0 start
> node server.js

Connected to MongoDB
Server is running on port: 5000
```

### 3.5 Configure and Deploy Frontend

Now, we will configure the `.env` variables for the frontend.

```
cd frontend

vi .env

REACT_APP_MARKETPLACE_CONTRACT=<Step 3.1, e.g. 0x5FbDB2315678afecb367f032d93F642f64180aa3>
REACT_APP_BACKEND_URL=http://localhost
REACT_APP_BACKEND_PORT=5000
REACT_APP_ETH_PROVIDER=http://localhost:8545
```

Modify the variables accordingly.

Once done, run the frontend:

```
npm start
```

If success, you should see this:
```
webpack compiled with 1 warning
No issues found.
```

Done. Browse your app at https://localhost:3000.

## 4. Deployment (Dockerized)
