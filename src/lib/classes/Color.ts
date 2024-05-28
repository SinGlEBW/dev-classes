export type ColorRgba = [number, number, number, number];
export type ColorRgb = [number, number, number];
export type ColorHsla = Record<"h" | "s" | "l" | "a", number>;

export class Color {
  /*Проверить свои методы и возможно исключить т.к. функционал возможно повторяется */
  private static componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };
  static getNumberRGB = (getComputedStyleRGB: string) => {
    let arrSTRNumber = getComputedStyleRGB.match(/\d+/gi);
    if (arrSTRNumber?.length) {
      return arrSTRNumber.map((i) => Number(i));
    }

    return arrSTRNumber ? arrSTRNumber : [255, 255, 255];
  };
  static rgbToHex = (r, g, b) => "#" + Color.componentToHex(r) + Color.componentToHex(g) + Color.componentToHex(b);

  /**
   * https://stackoverflow.com/a/54070620/6758968
   * r, g, b in [0, 255]
   * @returns h in [0,360) and s, v in [0,1]
   */
  static rgbToHsv(r: number, g: number, b: number): [number, number, number] {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    r /= 255;
    g /= 255;
    b /= 255;
    const v = Math.max(r, g, b),
      c = v - Math.min(r, g, b);
    const h = c && (v === r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
    return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
  }

  /**
   * https://stackoverflow.com/a/54024653/6758968
   * @param h [0, 360]
   * @param s [0, 1]
   * @param v [0, 1]
   * @returns r, g, b in [0, 255]
   */
  static hsvToRgb(h: number, s: number, v: number): ColorRgb {
    const f = (n: number, k: number = (n + h / 60) % 6) => Math.round((v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)) * 255);
    return [f(5), f(3), f(1)];
  }
  /**
   * @returns h [0, 360], s [0, 100], l [0, 100], a [0, 1]
   */
  static rgbaToHsla(r: number, g: number, b: number, a: number = 1): ColorHsla {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h: number = 0,
      s: number;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: h * 360,
      s: s * 100,
      l: l * 100,
      a,
    };
  }

  // * https://stackoverflow.com/a/9493060/6758968
  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   *
   * @param   {number}  h       The hue [0, 360]
   * @param   {number}  s       The saturation [0, 1]
   * @param   {number}  l       The lightness [0, 1]
   * @return  {Array}           The RGB representation [0, 255]
   */
  static hslaToRgba(h: number, s: number, l: number, a: number): ColorRgba {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    h /= 360;
    s /= 100;
    l /= 100;
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r, g, b, a].map((v) => Math.round(v * 255)) as ColorRgba;
  }

  static hslaStringToRgba(hsla: string) {
    const splitted = hsla.slice(5, -1).split(", ");
    const alpha = Number(splitted.pop());
    const arr = splitted.map((val) => {
      if (val.endsWith("%")) {
        return +val.slice(0, -1);
      }
  
      return +val;
    });
  
    return Color.hslaToRgba(arr[0], arr[1], arr[2], alpha);
  }

  static hexaToRgba(hexa: string) {
    const arr: ColorRgba = [] as any;
    const offset = hexa[0] === "#" ? 1 : 0;
    if (hexa.length === 5 + offset) {
      hexa = (offset ? "#" : "") + "0" + hexa.slice(offset);
    }
  
    if (hexa.length === 3 + offset) {
      for (let i = offset; i < hexa.length; ++i) {
        arr.push(parseInt(hexa[i] + hexa[i], 16));
      }
    } else if (hexa.length === 4 + offset) {
      for (let i = offset; i < hexa.length - 1; ++i) {
        arr.push(parseInt(hexa[i] + hexa[i], 16));
      }
  
      arr.push(parseInt(hexa[hexa.length - 1], 16));
    } else {
      for (let i = offset; i < hexa.length; i += 2) {
        arr.push(parseInt(hexa.slice(i, i + 2), 16));
      }
    }
  
    return arr;
  }
  
  static hexToRgb(hex: string) {
    return Color.hexaToRgba(hex.slice(0, 7)) as any as ColorRgb;
  }
  
  static hexaToHsla(hexa: string) {
    const rgba = Color.hexaToRgba(hexa);
    return Color.rgbaToHsla(rgba[0], rgba[1], rgba[2], rgba[3]);
  }
  
  static rgbaToHexa(rgba: ColorRgba | ColorRgb) {
    const copyRgba = [...rgba];
    const alpha = copyRgba.pop();
    const alphaHex = Math.round(Math.min(Math.max(alpha ?? 1, 0), 1) * 255);
    return "#" + copyRgba.map((v) => ("0" + v.toString(16)).slice(-2)).join("") + alphaHex.toString(16);
  }
  
  static hslaStringToHexa(hsla: string) {
    return Color.rgbaToHexa(Color.hslaStringToRgba(hsla));
  }
  
  static hslaStringToHex(hsla: string) {
    return Color.hslaStringToHexa(hsla).slice(0, -2);
  }
  
  /**
   * @param weight [0, 1]
   */
  static mixColors(color1: ColorRgb, color2: ColorRgb, weight: number) {
    const out = new Array<number>(3) as ColorRgb;
    for (let i = 0; i < 3; ++i) {
      const v1 = color1[i],
        v2 = color2[i];
      out[i] = Math.floor(v2 + (v1 - v2) * weight);
    }
  
    return out;
  }
  
  static computePerceivedBrightness(color: ColorRgb) {
    return (color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722) / 255;
  }
  
  static getAverageColor(color1: ColorRgb, color2: ColorRgb): ColorRgb {
    return color1.map((v, i) => Math.round((v + color2[i]) / 2)) as ColorRgb;
  }
  
  static getAccentColor(baseHsv: number[], baseColor: ColorRgb, elementColor: ColorRgb): ColorRgb {
    const hsvTemp3 = Color.rgbToHsv(...baseColor);
    const hsvTemp4 = Color.rgbToHsv(...elementColor);
  
    const dist = Math.min((1.5 * hsvTemp3[1]) / baseHsv[1], 1);
  
    hsvTemp3[0] = Math.min(360, hsvTemp4[0] - hsvTemp3[0] + baseHsv[0]);
    hsvTemp3[1] = Math.min(1, (hsvTemp4[1] * baseHsv[1]) / hsvTemp3[1]);
    hsvTemp3[2] = Math.min(1, ((hsvTemp4[2] / hsvTemp3[2] + dist - 1) * baseHsv[2]) / dist);
    if (hsvTemp3[2] < 0.3) {
      return elementColor;
    }
    return Color.hsvToRgb(...hsvTemp3);
  }
  
  static changeColorAccent(baseHsv: number[], accentHsv: number[], color: ColorRgb, isDarkTheme: boolean) {
    const colorHsv = Color.rgbToHsv(...color);
  
    const diffH = Math.min(Math.abs(colorHsv[0] - baseHsv[0]), Math.abs(colorHsv[0] - baseHsv[0] - 360));
    if (diffH > 30) {
      return color;
    }
  
    const dist = baseHsv[1] ? Math.min((1.5 * colorHsv[1]) / baseHsv[1], 1) : 0;
  
    colorHsv[0] = Math.min(360, colorHsv[0] + accentHsv[0] - baseHsv[0]);
    colorHsv[1] = baseHsv[1] ? Math.min(1, (colorHsv[1] * accentHsv[1]) / baseHsv[1]) : 0;
    colorHsv[2] = baseHsv[2] ? Math.min(1, colorHsv[2] * (1 - dist + (dist * accentHsv[2]) / baseHsv[2])) : 0;
  
    let newColor = Color.hsvToRgb(...colorHsv);
  
    const origBrightness = Color.computePerceivedBrightness(color);
    const newBrightness = Color.computePerceivedBrightness(newColor);
  
    // We need to keep colors lighter in dark themes and darker in light themes
    const needRevertBrightness = isDarkTheme ? origBrightness > newBrightness : origBrightness < newBrightness;
  
    if (needRevertBrightness) {
      const amountOfNew = 0.6;
      const fallbackAmount = ((1 - amountOfNew) * origBrightness) / newBrightness + amountOfNew;
      newColor = Color.changeBrightness(newColor, fallbackAmount);
    }
  
    return newColor;
  }
  
  static changeBrightness(color: ColorRgb, amount: number) {
    return color.map((v) => Color.clamp(Math.round(v * amount), 0, 255)) as ColorRgb;
  }
  
  static getHexColorFromTelegramColor(color: number) {
    const hex = (color < 0 ? 0xffffff + color : color).toString(16);
    return "#" + (hex.length >= 6 ? hex : "0".repeat(6 - hex.length) + hex);
  }
  
  static getRgbColorFromTelegramColor(color: number) {
    return Color.hexToRgb(Color.getHexColorFromTelegramColor(color));
  }
  
  static getColorsFromWallPaper(wallPaper) {
    return wallPaper.settings
      ? [
          wallPaper.settings.background_color,
          wallPaper.settings.second_background_color,
          wallPaper.settings.third_background_color,
          wallPaper.settings.fourth_background_color,
        ]
          .filter(Boolean)
          .map(Color.getHexColorFromTelegramColor)
          .join(",")
      : "";
  }
  
  static rgbaToRgb(rgba: ColorRgba, bg: ColorRgb): ColorRgb {
    const a = rgba[3];
    return rgba.slice(0, 3).map((color, idx) => {
      return Color.clamp(Math.round((a * (color / 255) + a * (bg[idx] / 255)) * 255), 0, 255);
    }) as ColorRgb;
  }
  
  static calculateLuminance(rgb: ColorRgb) {
    const [r, g, b] = rgb;
    const luminance = (0.2126 * r) / 255 + (0.7152 * g) / 255 + (0.0722 * b) / 255;
    return luminance;
  }
  
  static getTextColor(luminance: number): ColorRgb {
    return luminance > 0.5 ? [0, 0, 0] : [255, 255, 255];
  }
  
  static calculateOpacity(luminance: number, targetContrast: number) {
    const targetTextLuminance = luminance > 0.5 ? 0 : 1;
    const adaptiveOpacity = (luminance - targetTextLuminance + targetContrast) / targetContrast;
    const opacity = +Math.max(0.5, Math.min(0.64, adaptiveOpacity)).toFixed(2);
  
    return opacity;
  }
  static clamp(v: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, v));
  }
}


