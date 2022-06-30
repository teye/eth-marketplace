export const formatTxDisplay = (txHash: string) => {
    if (!txHash) {
        return "";
    }
    return `${txHash.substring(0, 40)}...`;
}

export const formatAddressDisplay = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(36,40)}`;
}

/**
 * truncate extra decimal places for eth wallet balance
 * @param str the balance in eth str with decimal places
 * @param maxDecimalDigits 
 * @returns 
 */
export const truncate = (str: string, maxDecimalDigits: number) => {
    if (str.includes('.')) {
        const parts = str.split('.');
        return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
    }
    return str;
}