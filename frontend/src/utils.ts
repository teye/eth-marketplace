export const formatTxDisplay = (txHash: string) => {
    return `${txHash.substring(0, 40)}...`;
}