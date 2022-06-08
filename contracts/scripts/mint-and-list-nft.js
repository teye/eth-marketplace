const hre = require("hardhat");

const SELL_PRICE = hre.ethers.utils.parseEther("0.05");
const MINT_PAYMENT = hre.ethers.utils.parseEther("0.001");

/**
 * mint NFT and list on the marketplace contract
 */
async function main() {
    const [owner] = await ethers.getSigners();

    const marketplaceAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"  // replace this
    const nftAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";         // replace this

    // const marketplaceFactory = await hre.ethers.getContractFactory("Marketplace");
    // const nftFactory = await hre.ethers.getContractFactory("DummyNFT");

    const marketplaceContract = await hre.ethers.getContractAt("Marketplace", marketplaceAddress);
    const nftContract = await hre.ethers.getContractAt("DummyNFT", nftAddress);

    console.log(`Minting NFT for ${owner.address}`);

    const mintTx = await nftContract.connect(owner).mint({
      value: MINT_PAYMENT
    });
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events[1].args.tokenId.toString();

    console.log("Approving Marketplace as operator");

    const approvalTx = await nftContract.connect(owner).approve(marketplaceAddress, tokenId);

    console.log("Listing NFT");
    const tx = await marketplaceContract.connect(owner).sell(nftContract.address, tokenId, SELL_PRICE);
    
    const tokenOwner = await nftContract.ownerOf(tokenId);

    console.log(`NFT ID ${tokenId} minted and listed by owner ${tokenOwner}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });