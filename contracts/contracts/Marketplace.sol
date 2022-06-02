//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * NFT Marketplace contract based on instant sale price selling method
 * Referenced from https://blog.chain.link/how-to-build-an-nft-marketplace-with-hardhat-and-solidity/
 */
contract Marketplace is ReentrancyGuard {
    // TODO
    // mapping of 

    struct Listing {
        address tokenAddress;
        uint tokenId;
        uint price;
    }

    // state variables
    // seller -> (sales_id -> Listing)
    // nft -> (token_id -> (seller, price))
    mapping(address => mapping(uint256 => Listing)) private salesListings;

    // modifiers

    /**
     * @notice list an NFT for sale
     * 
     */
    function sell() external {
        // must be token owner
        // must not be listed
    }

    function buy() {
        
    }

    function updateListing() {

    }

    function cancelListing() {

    }

    function getListing() {

    }

    function getListingsByOwner() {

    }
}