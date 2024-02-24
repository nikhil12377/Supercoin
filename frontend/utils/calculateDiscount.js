export default function calculateDiscount(userType, amount) {
  if ((userType = "plus")) {
    return 40 * amount;
  } else {
    return 20 * amount;
  }
}
