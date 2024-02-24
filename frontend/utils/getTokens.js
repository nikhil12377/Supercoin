export default function getTokens(userType, price) {
  if (userType === "plus") {
    const tempPrice = 0.04 * price;
    return tempPrice < 50 ? tempPrice : 50; // 4% discount for plus users
  } else {
    const tempPrice = 0.02 * price;
    return tempPrice < 25 ? tempPrice : 25; // 2% discount for non-plus users
  }
}
