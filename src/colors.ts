function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export function convertCssRgbToHex(value: string): string {
  // takes in a string of the form "number, number, number"

  const [r, g, b] = value.split(", ").map((val) => Number(val));
  return rgbToHex(r, g, b);
}
