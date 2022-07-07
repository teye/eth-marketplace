const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BasicNFT contract", function () {
    
    // global test variables
    let nftFactory;
    let nftDeployed;
    let owner;

    beforeEach(async function() {
        [owner] = await ethers.getSigners();
        nftFactory = await ethers.getContractFactory("BasicNFTV2");
        nftDeployed = await nftFactory.deploy("BasicNFTV2", "BNFTV2");
    });

    it("Should have the correct name and symbol", async function() {
        expect(await nftDeployed.name()).to.equal("BasicNFTV2");
        expect(await nftDeployed.symbol()).to.equal("BNFTV2");
    })

    it("Should mint with correct owner and URI", async function() {
        await nftDeployed.connect(owner).mint("https://image.google.com", {
            value: ethers.utils.parseEther("0.001")
        });

        expect(await nftDeployed.ownerOf(1)).to.equal(owner.address);
        expect(await nftDeployed.tokenURI(1)).to.equal("https://image.google.com");
    })
});