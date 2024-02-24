export default function truncateStr(fullstr, strLen) {
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
