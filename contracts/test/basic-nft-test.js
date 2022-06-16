const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BasicNFT contract", function () {
    
    // global test variables
    let nftFactory;
    let nftDeployed;
    let owner;

    beforeEach(async function() {
        [owner] = await ethers.getSigners();
        nftFactory = await ethers.getContractFactory("BasicNFT");
        nftDeployed = await nftFactory.deploy("BasicNFT", "BNFT");
    });

    it("Should have the correct name and symbol", async function() {
        expect(await nftDeployed.name()).to.equal("BasicNFT");
        expect(await nftDeployed.symbol()).to.equal("BNFT");
    })
});