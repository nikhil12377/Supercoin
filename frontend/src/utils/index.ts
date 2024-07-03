export function calculateDiscount(amount: number) {
    return 20 * amount;
}

export function getTokens(price: number) {
    const tempPrice = 0.02 * price;
    return tempPrice < 25 ? tempPrice : 25; // 2% discount
}

export function timestampToHours(timestamp: number) {
    const secondsPerDay = 86400;
    const secondsPerHour = 3600;

    const hours = Math.floor((timestamp % secondsPerDay) / secondsPerHour);

    return `${hours}h ago`;
}

export function truncateStr(fullstr: string, strLen: number) {
    if (fullstr.length <= strLen) return fullstr;

    const seperator = "...";
    const seperatorLength = seperator.length;
    const charToShow = strLen - seperatorLength;
    const frontChars = Math.ceil(charToShow / 2);
    const backChars = Math.floor(charToShow / 2);
    return (
        fullstr.substring(0, frontChars) +
        seperator +
        fullstr.substring(fullstr.length - backChars)
    );
}