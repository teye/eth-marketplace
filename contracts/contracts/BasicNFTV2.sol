//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


error PriceNotMet();

contract BasicNFTV2 is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // events
    event Mint(address indexed _from, uint256 tokenId, string uri);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    // The following functions are overrides required by Solidity.
    // See https://wizard.openzeppelin.com/#erc721

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /* end override */

    /*
     * @notice mints a token; only contract owner can mint
     * @dev    min 0.001 eth to mint
     * @return minted token ID
     */
    function mint(string memory uri) external payable onlyOwner returns (uint256) {
        if (msg.value < 1000000000000000 wei) {
            revert PriceNotMet();
        }

        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();

        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, uri);

        emit Mint(msg.sender, currentTokenId, uri);

        return currentTokenId;
    }

}
