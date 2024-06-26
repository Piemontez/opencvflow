/**
 * Convert HSV to RBG color
 */
export function hsv2rgb(h: number, s: number, v: number) {
  s /= 100.0;
  v /= 100.0;
  let C = v * s;
  let hh = h / 60.0;
  let X = C * (1.0 - Math.abs((hh % 2) - 1.0));
  let r = 0,
    g = 0,
    b = 0;
  if (hh >= 0 && hh < 1) {
    r = C;
    g = X;
  } else if (hh >= 1 && hh < 2) {
    r = X;
    g = C;
  } else if (hh >= 2 && hh < 3) {
    g = C;
    b = X;
  } else if (hh >= 3 && hh < 4) {
    g = X;
    b = C;
  } else if (hh >= 4 && hh < 5) {
    r = X;
    b = C;
  } else {
    r = C;
    b = X;
  }
  let m = v - C;
  r += m;
  g += m;
  b += m;
  r *= 255.0;
  g *= 255.0;
  b *= 255.0;
  
  return [Math.round(r), Math.round(g), Math.round(b)];
}

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
