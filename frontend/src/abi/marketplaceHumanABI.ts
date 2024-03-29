/**
 * human readable require otherwise the provider listener events sometimes can fail to detect the event
 */
export const MARKETPLACE_HUMAN_ABI = [
    "constructor()",
    "error NotApproved()",
    "error NotListed()",
    "error NoPaymentToWithdraw()",
    "error NotTokenOwner()",
    "error PriceLessThanZero()",
    "error PriceSameAsPrevious()",
    "error PriceNotMet(address tokenAddress, uint256 tokenId, uint256 expectedPrice)",
    "error TokenListed(address tokenAddress, uint256 tokenId)",
    "function _numNFTListed()",
    "event NFTListed(address indexed _from, address indexed _tokenAddress, uint256 tokenId, uint256 price)",
    "event NFTBought(address indexed _from, address indexed _tokenAddress, uint256 tokenId)",
    "event ListingUpdated(address indexed _from, address indexed _tokenAddress, uint256 tokenId, uint256 price)",
    "event NFTDeListed(address indexed _from, address indexed _tokenAddress, uint256 tokenId)",
    "function sell(address tokenAddress, uint256 tokenId, uint256 price) external",
    "function buy(address tokenAddress, uint256 tokenId) external payable",
    "function updateListing(address tokenAddress, uint256 tokenId, uint256 newPrice) external",
    "function cancelListing(address tokenAddress, uint256 tokenId) external",
    "function withdrawPayment() external",
    "function getListing(address tokenAddress, uint256 tokenId)",
    "function getProceeds(address seller) external view returns (uint256)"
]