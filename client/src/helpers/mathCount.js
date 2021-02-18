export const mathCount = (count) => {
  const format = (toCut, letter) => String(count).slice(0, -toCut) + letter;

  if (count > 999999999) {
    return format(9, "B");
  }

  if (count > 999999) {
    return format(6, "M");
  }

  if (count > 999) {
    return format(3, "K");
  } 

  return count
}