//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


/**
 * Custom errors
 */
error NotApproved();
error NotListed();
error NoPaymentToWithdraw();
error NotTokenOwner();
error PriceLessThanZero();
error PriceSameAsPrevious();
error PriceNotMet(address tokenAddress, uint256 tokenId, uint256 expectedPrice);
error TokenListed(address tokenAddress, uint256 tokenId);

/**
 * Self-study NFT Marketplace contract based on instant sale price selling method
 * Marketplace allows users to sell ERC-721 NFT
 * Referenced from https://blog.chain.link/how-to-build-an-nft-marketplace-with-hardhat-and-solidity/
 */
contract Marketplace is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _numNFTListed;

    struct Listing {
        address tokenAddress;
        address seller;
        uint tokenId;
        uint price;
    }

    // events
    event NFTListed(address indexed _from, address indexed _tokenAddress, uint256 tokenId);
    event NFTBought(address indexed _from, address indexed _tokenAddress, uint256 tokenId);
    event ListingUpdated(address indexed _from, address indexed _tokenAddress, uint256 tokenId);
    event NFTDeListed(address indexed _from, address indexed _tokenAddress, uint256 tokenId);

    // state variables
    // to get the list of NFT sold by owner address; we should store the token address and token_id in some offchain database during the sell process
    mapping(address => mapping(uint256 => Listing)) private salesListings;  // nft -> (token_id -> (seller, price))
    mapping(address => uint256) private salesProceeds;                      // seller -> profits

    // modifiers
    modifier isListed(address tokenAddress, uint256 tokenId) {
        if (salesListings[tokenAddress][tokenId].price <= 0) {
            revert NotListed();
        }
        _;
    }

    modifier isNotListed(address tokenAddress, uint256 tokenId) {
        if (salesListings[tokenAddress][tokenId].price > 0) {
            revert TokenListed(tokenAddress, tokenId);
        }
        _;
    }

    modifier isTokenOwner(address tokenAddress, uint256 tokenId) {
        IERC721 nft = IERC721(tokenAddress);
        address owner = nft.ownerOf(tokenId);
        if (msg.sender != owner) {
            revert NotTokenOwner();
        }
        _;
    }

    modifier isApproved(address tokenAddress, uint256 tokenId) {
        IERC721 nft = IERC721(tokenAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApproved();
        }
        _;
    }

    /**
     * @notice list an NFT for sale
     * 
     */
    function sell(address tokenAddress, uint256 tokenId, uint256 price) external 
        isNotListed(tokenAddress, tokenId)
        isTokenOwner(tokenAddress, tokenId)
        isApproved(tokenAddress, tokenId)
    {
        if (price <= 0) {
            revert PriceLessThanZero();
        }
        _numNFTListed.increment();
        salesListings[tokenAddress][tokenId] = Listing(tokenAddress, msg.sender, tokenId, price);
        emit NFTListed(msg.sender, tokenAddress, tokenId);
    }

    /**
     * @notice purchase an NFT on the marketplace
     */
    function buy(address tokenAddress, uint256 tokenId) external payable 
        isListed(tokenAddress, tokenId)
        isApproved(tokenAddress, tokenId)
        nonReentrant
    {
        Listing memory listedNFT = salesListings[tokenAddress][tokenId];
        if (msg.value < listedNFT.price) {
            revert PriceNotMet(tokenAddress, tokenId, listedNFT.price);
        }

        // don't transfer seller the profits directly; let user withdraw themselves
        // https://fravoll.github.io/solidity-patterns/pull_over_push.html
        salesProceeds[listedNFT.seller] += msg.value;

        // delete entry first then transfer NFT to buyer
        delete salesListings[tokenAddress][tokenId];
        _numNFTListed.decrement();
        IERC721(tokenAddress).safeTransferFrom(listedNFT.seller, msg.sender, tokenId);
        emit NFTBought(msg.sender, tokenAddress, tokenId);
    }

    /**
     * @notice update a listing; only token owner can update
     * @dev    new price must not be equal to old price
     */
    function updateListing(address tokenAddress, uint256 tokenId, uint256 newPrice) external 
        isListed(tokenAddress, tokenId)
        isTokenOwner(tokenAddress, tokenId)
        nonReentrant
    {
        // price must not be the same as previous
        if (newPrice <= 0) {
            revert PriceLessThanZero();
        }

        Listing memory listedNFT = salesListings[tokenAddress][tokenId];
        if (newPrice == listedNFT.price) {
            revert PriceSameAsPrevious();
        }

        salesListings[tokenAddress][tokenId].price = newPrice;
        emit ListingUpdated(msg.sender, tokenAddress, tokenId);
    }

    /**
     * @notice cancel a listing; only token owner can cancel
     */
    function cancelListing(address tokenAddress, uint256 tokenId) external
        isListed(tokenAddress, tokenId)
        isTokenOwner(tokenAddress, tokenId)
    {
        _numNFTListed.decrement();
        delete salesListings[tokenAddress][tokenId];
        emit NFTDeListed(msg.sender, tokenAddress, tokenId);
    }

    /**
     * @notice used by seller to withdraw sales profits
     */
    function withdrawPayment() external {
        uint256 payment = salesProceeds[msg.sender];
        if (payment <= 0) {
            revert NoPaymentToWithdraw();
        }

        salesProceeds[msg.sender] = 0;

        address payable receiver = payable(msg.sender);
        receiver.transfer(payment);
    }

    /**
     * @notice get a specific listing details
     */
    function getListing(address tokenAddress, uint256 tokenId) external view returns (Listing memory) {
        return salesListings[tokenAddress][tokenId];
    }

    /** 
     * @notice retrieve the sales profits
     */
    function getProceeds(address seller) external view returns (uint256) {
        return salesProceeds[seller];
    }
}