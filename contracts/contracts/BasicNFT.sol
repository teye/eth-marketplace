//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


error PriceNotMet();

contract BasicNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // events
    event Mint(address indexed _from, uint256 tokenId);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    // The following functions are overrides required by Solidity.
    // See https://wizard.openzeppelin.com/#erc721

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /*
     * @notice mints a token; only contract owner can mint
     * @dev    min 0.001 eth to mint
     * @return minted token ID
     */
    function mint() external payable onlyOwner returns (uint256) {
        if (msg.value < 1000000000000000 wei) {
            revert PriceNotMet();
        }

        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();

        _safeMint(msg.sender, currentTokenId);

        emit Mint(msg.sender, currentTokenId);

        return currentTokenId;
    }

}
