export type ColorRgb = [number, number, number];

export interface Color_P {
  ColorRgb: ColorRgb;
  ColorRgba: [...ColorRgb, number];
  ColorHsla: Record<"h" | "s" | "l" | "a", number>;
  TypeBrightness_OR: "BT601" | "BT709" | "BT2020";
}

export interface ColorProps {
  componentToHex: (c: number) => string;
  // getNumberRGB(getComputedStyleRGB: string): Color_P['ColorRgb'];
  rgbToHex(r: number, g: number, b: number): string;
  rgbToHsv(r: number, g: number, b: number): Color_P["ColorRgb"];
  hsvToRgb(h: number, s: number, v: number): Color_P["ColorRgb"];
  rgbaToHsla(r: number, g: number, b: number, a: number): Color_P["ColorHsla"];
  hslaToRgba(h: number, s: number, l: number, a: number): Color_P["ColorRgba"];
  hslaStringToRgba(hsla: string): Color_P["ColorRgba"];
  hexaToRgba(hexa: string, isNormalizeAlpha?: boolean): Color_P["ColorRgba"];
  hexToRgb(hex: string): Color_P["ColorRgb"];
  hexaToHsla(hexa: string): Color_P["ColorHsla"];
  rgbaToHexa(rgba: Color_P["ColorRgba"] | Color_P["ColorRgb"]): string;
  hslaStringToHexa(hsla: string): string;
  hslaStringToHex(hsla: string): string;
  mixColors(color1: Color_P["ColorRgb"], color2: Color_P["ColorRgb"], weight: number): Color_P["ColorRgb"];
  getRgbByTypeBrightness(type: Color_P["TypeBrightness_OR"]): Color_P["ColorRgb"];
  getAverageColor(color1: Color_P["ColorRgb"], color2: Color_P["ColorRgb"]): Color_P["ColorRgb"];
  getAccentColor(baseHsv: number[], baseColor: Color_P["ColorRgb"], elementColor: Color_P["ColorRgb"]): Color_P["ColorRgb"];
  changeColorAccent(baseHsv: number[], accentHsv: number[], color: Color_P["ColorRgb"], isDarkTheme: boolean): Color_P["ColorRgb"];
  changeBrightness(color: Color_P["ColorRgb"], amount: number): Color_P["ColorRgb"];
  hexBrightness(hex: string, amount: number): string;
  getHexColorFromTelegramColor(color: number): string;
  getRgbColorFromTelegramColor(color: number): Color_P["ColorRgb"];
  // getColorsFromWallPaper(wallPaper): string;
  rgbaToRgb(rgba: Color_P["ColorRgba"], bg: Color_P["ColorRgb"]): Color_P["ColorRgb"];
  calculateBrightness(rgb: Color_P["ColorRgb"], type?: Color_P["TypeBrightness_OR"]): number;
  getTextColor(luminance: number): Color_P["ColorRgb"];
  calculateOpacity(luminance: number, targetContrast: number): number;
  clamp(v: number, min: number, max: number): number;

  isBrightAndVivid: (color: string) => boolean;
  generate: {
    rgb: () => number[];
    hex: () => string;
    hexMultiple: () => string[];
    pastelColor: () => string;
    neonColor: () => string;
    brightColor: () => string;
  };
 
}
