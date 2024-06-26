function hexValue(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

/**
 * Convert HSV to HEX color
 */
export function rgb2Hex(r: number, g: number, b: number) {
  return hexValue(r) + hexValue(g) + hexValue(b);
}
