export type ListingDetails = {
    tokenAddress: string;
    tokenName: string;
    tokenId: string;
    tokenURI?: string;
    seller: string;
    price: string;
}

export type NFTDetails = {
    tokenAddress: string;
    tokenName: string;
    tokenId: string;
    tokenURI?: string;
    owner: string;
    isListed: boolean;
}