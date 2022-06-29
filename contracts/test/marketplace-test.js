const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace contract", function () {

    // global test variables
    let marketplaceFactory;
    let marketplaceDeployed;
    let nftFactory;
    let nftDeployed;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function() {
        [owner, addr1, addr2] = await ethers.getSigners();
        marketplaceFactory = await ethers.getContractFactory("Marketplace");
        nftFactory = await ethers.getContractFactory("DummyNFT");
        marketplaceDeployed = await marketplaceFactory.deploy();
        nftDeployed = await nftFactory.connect(addr1).deploy();

        // mint nft - addr1
        await nftDeployed.connect(addr1).mint({
            value: ethers.utils.parseEther("0.001")
        });
    });

    describe("Sell", function() {
        it("Should list NFT for sale", async function() {
            // approve first
            await nftDeployed.connect(addr1).approve(marketplaceDeployed.address, 1);
            // sell
            const sellTx = await marketplaceDeployed.connect(addr1).sell(nftDeployed.address, 1, "1000000000000000");
            await expect(sellTx).to.emit(marketplaceDeployed, 'NFTListed').withArgs(addr1.address, nftDeployed.address, 1, 1000000000000000);

            expect(await marketplaceDeployed._numNFTListed()).to.equal("1");
        });
    
        it("Should revert if listing an item that is already listed", async function() {
            await nftDeployed.connect(addr1).approve(marketplaceDeployed.address, 1);
    
            const sellTx = await marketplaceDeployed.connect(addr1).sell(nftDeployed.address, 1, "1000000000000000");
            await expect(sellTx).to.emit(marketplaceDeployed, 'NFTListed');
    
            // sell again
            await expect(marketplaceDeployed.connect(addr1).sell(nftDeployed.address, 1, "1000000000000000")).to.be.revertedWith('TokenListed');
        });
    
        it("Should revert when listing an item that is not token owner", async function() {
            await nftDeployed.connect(addr1).approve(marketplaceDeployed.address, 1);
            await expect(marketplaceDeployed.connect(addr2).sell(nftDeployed.address, 1, "1000000000000000")).to.be.revertedWith('NotTokenOwner');
        });
    
        it("Should revert when listing an item that is not approved", async function() {
            await expect(marketplaceDeployed.connect(addr1).sell(nftDeployed.address, 1, "1000000000000000")).to.be.revertedWith('NotApproved');
        });
    });

    describe("Buy", function() {
        beforeEach(async function() {
            // sell token 1
            await nftDeployed.connect(addr1).approve(marketplaceDeployed.address, 1);
            await marketplaceDeployed.connect(addr1).sell(nftDeployed.address, 1, "1000000000000000");
        });

        it("Should buy item", async function() {
            const tx = await marketplaceDeployed.connect(addr2).buy(nftDeployed.address, 1, {
                value: ethers.utils.parseEther("0.001")
            })

            await expect(tx).to.emit(marketplaceDeployed, 'NFTBought').withArgs(addr2.address, nftDeployed.address, 1);

            // check sales listing is deleted
            const listing = await marketplaceDeployed.getListing(nftDeployed.address, 1);
            expect(listing.seller).to.equal("0x0000000000000000000000000000000000000000");

            // check sales proceed is updated
            const sellerProfits = await marketplaceDeployed.getProceeds(addr1.address);
            expect(sellerProfits).to.equal("1000000000000000");

            // check number of NFT listed on sale
            expect(await marketplaceDeployed._numNFTListed()).to.equal("0");

            // check NFT is transferred
            const newTokenOwner = await nftDeployed.ownerOf(1);
            expect(newTokenOwner).to.equal(addr2.address);
        });

        it("Should revert when buying a non-listed item", async function() {
            await expect(marketplaceDeployed.connect(addr2).buy(nftDeployed.address, 9999, {
                value: ethers.utils.parseEther("0.001")
            })).to.be.revertedWith('NotListed');
        });
    
        it("Should revert when buying a listed item not yet approved", async function() {
            // seller clear approval
            await nftDeployed.connect(addr1).approve("0x0000000000000000000000000000000000000000", 1);
            await expect(marketplaceDeployed.connect(addr2).buy(nftDeployed.address, 1, {
                value: ethers.utils.parseEther("0.001")
            })).to.be.revertedWith('NotApproved');
        });
    
        it("Should revert when buying without sufficient payment", async function() {
            await expect(marketplaceDeployed.connect(addr2).buy(nftDeployed.address, 1)).to.be.revertedWith('PriceNotMet');
        });
    });

    describe("Withdraw proceeds", function() {
        beforeEach(async function() {
            // sell token 1
            await nftDeployed.connect(addr1).approve(marketplaceDeployed.address, 1);
            await marketplaceDeployed.connect(addr1).sell(nftDeployed.address, 1, "1000000000000000");

            // buy token 1
            await marketplaceDeployed.connect(addr2).buy(nftDeployed.address, 1, {
                value: ethers.utils.parseEther("0.001")
            })
        });

        it("Should withdraw payment", async function() {
            const initBalance = await ethers.provider.getBalance(addr1.address);
            const initProceeds = await marketplaceDeployed.getProceeds(addr1.address);
            expect(initProceeds).to.equal("1000000000000000");

            await marketplaceDeployed.connect(addr1).withdrawPayment();
            const newBalance = await ethers.provider.getBalance(addr1.address);
            const newProceeds = await marketplaceDeployed.getProceeds(addr1.address);
            // console.log("init: ", initBalance.toString());
            // console.log("new: ", newBalance.toString());
            
            expect(Number(newBalance)).to.be.greaterThan(Number(initBalance));
            expect(newProceeds).to.equal(0);
        });

        it("Should revert when no payment to withdraw", async function() {
            await expect(marketplaceDeployed.connect(addr2).withdrawPayment()).to.be.revertedWith('NoPaymentToWithdraw');
        });
    });

    describe("Cancel listing", function() {
        beforeEach(async function() {
            // sell token 1
            await nftDeployed.connect(addr1).approve(marketplaceDeployed.address, 1);
            await marketplaceDeployed.connect(addr1).sell(nftDeployed.address, 1, "1000000000000000");
        });

        it("Should cancel listing", async function() {
            const tx = await marketplaceDeployed.connect(addr1).cancelListing(nftDeployed.address, 1);
            await expect(tx).to.emit(marketplaceDeployed, "NFTDeListed").withArgs(addr1.address, nftDeployed.address, 1);

            // check sales listing data
            const listing = await marketplaceDeployed.getListing(nftDeployed.address, 1);
            expect(listing.seller).to.equal("0x0000000000000000000000000000000000000000");
        });

        it("Should revert when cancelling a non listed item", async function() {
            await expect(marketplaceDeployed.connect(addr1).cancelListing(nftDeployed.address, 2)).to.be.revertedWith("NotListed");
        });

        it("Should revert when cancelling as not the token owner", async function() {
            await expect(marketplaceDeployed.connect(addr2).cancelListing(nftDeployed.address, 1)).to.be.revertedWith("NotTokenOwner");
        });
    });

    describe("Update listing", function() {
        beforeEach(async function() {
            // sell token 1
            await nftDeployed.connect(addr1).approve(marketplaceDeployed.address, 1);
            await marketplaceDeployed.connect(addr1).sell(nftDeployed.address, 1, "1000000000000000");
        });

        it("Should update listing", async function() {
            const tx = await marketplaceDeployed.connect(addr1).updateListing(nftDeployed.address, 1, "2000000000000000");
            await expect(tx).to.emit(marketplaceDeployed, "ListingUpdated").withArgs(addr1.address, nftDeployed.address, 1, 2000000000000000);

            const listing = await marketplaceDeployed.getListing(nftDeployed.address, 1);
            expect(listing.price).to.equal("2000000000000000");
        });

        it("Should revert when updating a non listed item", async function() {
            await expect(marketplaceDeployed.connect(addr1).updateListing(nftDeployed.address, 9999, "1000000000000000")).to.be.revertedWith("NotListed");
        });

        it("Should revert when updating as not the token owner", async function() {
            await expect(marketplaceDeployed.connect(addr2).updateListing(nftDeployed.address, 1, "2000000000000000")).to.be.revertedWith("NotTokenOwner");
        });

        it("Should revert when updating listing new price is zero", async function() {
            await expect(marketplaceDeployed.connect(addr1).updateListing(nftDeployed.address, 1, "0")).to.be.revertedWith("PriceLessThanZero");
        });

        it("Should revert when updating listing new price is identical to previous price", async function() {
            await expect(marketplaceDeployed.connect(addr1).updateListing(nftDeployed.address, 1, "1000000000000000")).to.be.revertedWith("PriceSameAsPrevious");
        });
    });

});